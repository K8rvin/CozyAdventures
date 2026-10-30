import argparse
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

GAME_ROOT = Path(__file__).resolve().parents[1]
ART_ROOT = GAME_ROOT.parent / "art-src"
TMP_ROOT = GAME_ROOT.parent / "tmp"
SIZE = (1536, 1920)
RESAMPLING = Image.Resampling.LANCZOS


def parse_args():
    parser = argparse.ArgumentParser(
        description="Подготовка изолированного предмета в зарегистрированный слой. Без --apply только preview."
    )
    parser.add_argument("--body", choices=["male", "female"], required=True)
    parser.add_argument("--item", required=True)
    parser.add_argument("--slot", choices=["weapon", "shield", "boots", "gloves", "amulet", "ring", "helmet", "consumable"], default="weapon")
    parser.add_argument("--part", choices=["main", "back", "both"], default="main")
    parser.add_argument("--output-mode", choices=["body", "shared"], default="body", help="parts/<body>/ или общий parts/<item>.png")
    parser.add_argument("--source", help="По умолчанию knight/isolated/<item>_<body>.jfif относительно art-src")
    parser.add_argument("--mask", help="Белая маска включаемой части; размер приводится к исходнику")
    parser.add_argument("--angle", type=float, default=0.0, help="Поворот по часовой стрелке до расчёта bbox; одинаковый для всех частей")
    parser.add_argument("--width", type=float, required=True, help="Максимальная ширина исходного предмета на кадре")
    parser.add_argument("--height", type=float, required=True, help="Максимальная высота исходного предмета на кадре")
    parser.add_argument("--center-x", type=float, required=True)
    parser.add_argument("--center-y", type=float, required=True)
    parser.add_argument("--padding", type=int, default=8, help="Прозрачный запас вокруг исходного alpha bbox")
    parser.add_argument("--pocket", type=int, nargs=2, action="append", default=[], metavar=("X", "Y"), help="Точка замкнутого белого фона в исходнике; повторяемая опция")
    parser.add_argument("--detail", type=int, nargs=4, metavar=("LEFT", "TOP", "RIGHT", "BOTTOM"), help="Область крупного плана на общем кадре")
    parser.add_argument("--out", help="Путь PNG для main/back; несовместимо с --part both")
    parser.add_argument("--preview", help="По умолчанию tmp/<item>-<body>-layer-review.jpg")
    parser.add_argument("--apply", action="store_true", help="Записать выбранные слои в art-src")
    args = parser.parse_args()
    if args.part == "both" and not args.mask:
        parser.error("--part both требует --mask для main; back остаётся полным")
    if args.part == "both" and args.out:
        parser.error("--out несовместим с --part both")
    if args.width <= 0 or args.height <= 0:
        parser.error("--width и --height должны быть положительными")
    return args


def art_path(value, default):
    path = Path(value) if value else default
    return path if path.is_absolute() else ART_ROOT / path


def rgba_resize(image, size):
    return image.convert("RGBa").resize(size, RESAMPLING).convert("RGBA")


def outer_alpha(image, pockets):
    if image.mode == "RGBA" and image.getchannel("A").getextrema()[0] < 250:
        return image.getchannel("A").copy()
    array = np.asarray(image.convert("RGB"))
    candidate = Image.fromarray(np.where(np.min(array, axis=2) > 232, 255, 0).astype(np.uint8), "L").copy()
    points = [(0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1)]
    points.extend(tuple(point) for point in pockets)
    for point in points:
        if candidate.getpixel(point) == 255:
            ImageDraw.floodfill(candidate, point, 128)
    background = np.asarray(candidate) == 128
    if not background[0, 0]:
        raise ValueError("Не удалось найти внешний белый фон заливкой от углов")
    return Image.fromarray(np.where(~background, 255, 0).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.45))


def load_source(path, pockets):
    with Image.open(path) as opened:
        source = ImageOps.exif_transpose(opened).convert("RGBA")
    source.putalpha(outer_alpha(source, pockets))
    return source


def rotate_image(image, angle):
    if not angle:
        return image
    if image.mode == "RGBA":
        return image.convert("RGBa").rotate(-angle, Image.Resampling.BICUBIC, expand=True, fillcolor=(0, 0, 0, 0)).convert("RGBA")
    return image.rotate(-angle, Image.Resampling.BICUBIC, expand=True, fillcolor=0)


def load_mask(path, size):
    with Image.open(path) as opened:
        return ImageOps.exif_transpose(opened).convert("L").resize(size, Image.Resampling.NEAREST)


def crop_box(alpha, padding):
    box = alpha.getbbox()
    if not box:
        raise ValueError("Исходник полностью прозрачен после удаления фона")
    return (
        max(0, box[0] - padding),
        max(0, box[1] - padding),
        min(alpha.width, box[2] + padding),
        min(alpha.height, box[3] + padding),
    )


def register(source, alpha, box, args):
    cropped = source.crop(box)
    cropped.putalpha(alpha.crop(box))
    scale = min(args.width / cropped.width, args.height / cropped.height)
    resized_size = (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale)))
    resized = rgba_resize(cropped, resized_size)
    registered = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    position = (round(args.center_x - resized.width / 2), round(args.center_y - resized.height / 2))
    registered.alpha_composite(resized, position)
    if not registered.getchannel("A").getbbox():
        raise ValueError("Предмет оказался полностью за пределами кадра")
    return registered


def make_parts(source, args):
    source = rotate_image(source, args.angle)
    full_alpha = source.getchannel("A")
    box = crop_box(full_alpha, args.padding)
    masked_alpha = ImageChops.multiply(full_alpha, rotate_image(load_mask(art_path(args.mask, None), source.size), args.angle)) if args.mask else full_alpha
    selected = {}
    if args.part in ("back", "both"):
        selected["back"] = register(source, full_alpha, box, args)
    if args.part in ("main", "both"):
        selected["main"] = register(source, masked_alpha, box, args)
    for part, image in selected.items():
        if not image.getchannel("A").getbbox():
            raise ValueError(f"Слой {part} пуст после применения маски")
    return selected


def base_layers(body_id):
    full = Image.open(ART_ROOT / "knight" / "doll" / body_id / "full.png").convert("RGBA")
    hands = Image.open(ART_ROOT / "knight" / "doll" / body_id / "hands_base.png").convert("RGBA")
    full_alpha = np.asarray(full.getchannel("A"), dtype=np.float32) / 255.0
    hands_alpha = np.asarray(hands.getchannel("A"), dtype=np.float32) / 255.0
    body = full.copy()
    body.putalpha(Image.fromarray(np.rint(full_alpha * (1 - hands_alpha) * 255).astype(np.uint8), "L"))
    return body, hands


def assemble(parts, args):
    room = Image.open(ART_ROOT / "knight" / "room.png").convert("RGBA").resize(SIZE, RESAMPLING)
    body, hands = base_layers(args.body)
    if "back" in parts:
        room.alpha_composite(parts["back"])
    room.alpha_composite(body)
    if args.slot in ("boots", "weapon") and "main" in parts:
        room.alpha_composite(parts["main"])
    if args.slot == "gloves" and "main" in parts:
        room.alpha_composite(parts["main"])
    else:
        room.alpha_composite(hands)
    if args.slot in ("shield", "amulet", "ring", "helmet", "consumable") and "main" in parts:
        room.alpha_composite(parts["main"])
    return room


def combined_box(parts, args):
    boxes = [image.getchannel("A").getbbox() for image in parts.values()]
    left = min(box[0] for box in boxes)
    top = min(box[1] for box in boxes)
    right = max(box[2] for box in boxes)
    bottom = max(box[3] for box in boxes)
    if args.detail:
        return tuple(args.detail)
    return (
        max(0, left - 70),
        max(0, top - 70),
        min(SIZE[0], right + 70),
        min(SIZE[1], bottom + 70),
    )


def fit_panel(image, background):
    scale = min(320 / image.width, 400 / image.height)
    resized = rgba_resize(image, (max(1, round(image.width * scale)), max(1, round(image.height * scale))))
    panel = Image.new("RGBA", (320, 400), background)
    panel.alpha_composite(resized, ((320 - resized.width) // 2, (400 - resized.height) // 2))
    return panel


def save_preview(parts, assembled, args):
    preview_path = Path(args.preview) if args.preview else TMP_ROOT / f"{args.item}-{args.body}-layer-review.jpg"
    if not preview_path.is_absolute():
        preview_path = TMP_ROOT / preview_path
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    box = combined_box(parts, args)
    panels = [("full", rgba_resize(assembled, (320, 400))), ("detail", fit_panel(assembled.crop(box), "#211a16"))]
    for label, color in [("dark", "#263832"), ("light", "#eee7da")]:
        isolated = Image.new("RGBA", SIZE, color)
        for image in parts.values():
            isolated.alpha_composite(image)
        panels.append((label, fit_panel(isolated.crop(box), color)))
    sheet = Image.new("RGB", (1280, 430), "#211a16")
    draw = ImageDraw.Draw(sheet)
    for index, (label, image) in enumerate(panels):
        sheet.paste(image.convert("RGB"), (index * 320, 0))
        draw.text((index * 320 + 10, 405), label, fill="#eadbc2")
    sheet.save(preview_path, quality=96)
    return preview_path


def save_png(path, image):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp.png")
    image.save(temporary)
    os.replace(temporary, path)


def output_path(args, part):
    suffix = "__back" if part == "back" else ""
    root = ART_ROOT / "knight" / "parts"
    default = root / f"{args.item}{suffix}.png" if args.output_mode == "shared" else root / args.body / f"{args.item}{suffix}.png"
    return art_path(args.out, default)


def main():
    args = parse_args()
    source_path = art_path(args.source, ART_ROOT / "knight" / "isolated" / f"{args.item}_{args.body}.jfif")
    source = load_source(source_path, args.pocket)
    parts = make_parts(source, args)
    assembled = assemble(parts, args)
    preview_path = save_preview(parts, assembled, args)
    if args.apply:
        written = []
        for part, image in parts.items():
            path = output_path(args, part)
            save_png(path, image)
            with Image.open(path) as saved:
                assert saved.size == SIZE and saved.mode == "RGBA" and saved.getpixel((0, 0))[3] == 0, path
            written.append(path)
        print(f"Применено: {', '.join(str(path) for path in written)}")
    else:
        print("DRY-RUN: рабочие файлы не изменены. Для записи добавьте --apply.")
    print(f"Исходник: {source_path}")
    print(f"Preview: {preview_path}")


if __name__ == "__main__":
    main()
