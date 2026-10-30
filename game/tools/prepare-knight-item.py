import argparse
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

GAME_ROOT = Path(__file__).resolve().parents[1]
ART_ROOT = GAME_ROOT.parent / "art-src"
TMP_ROOT = GAME_ROOT.parent / "tmp"
SIZE = (1536, 1920)
RESAMPLING = Image.Resampling.LANCZOS


def parse_args():
    parser = argparse.ArgumentParser(
        description="Подготовка layered-арта брони и кистей по золотой базе. Без --apply только preview."
    )
    parser.add_argument("--body", choices=["male", "female"], required=True)
    parser.add_argument("--item", required=True, help="ID предмета, например arm_ash_wayfarer")
    parser.add_argument("--composite", help="Путь к полному item composite; по умолчанию composites/<item>_<body>.jfif")
    parser.add_argument("--apply", action="store_true", help="Записать body/hands/armor в art-src. Без флага — только preview")
    parser.add_argument("--preview", help="Путь к итоговому preview; по умолчанию tmp/<item>-<body>-review.jpg")
    parser.add_argument("--armor-out", help="Путь предметного слоя; по умолчанию parts/<body>/<item>.png")
    parser.add_argument("--body-out", help="Путь body; по умолчанию doll/<body>/body.png")
    parser.add_argument("--hands-out", help="Путь кистей по рукаву; по умолчанию doll/<body>/hands.png")
    parser.add_argument("--template-out", help="Reusable-шаблон; по умолчанию doll/<body>/hands_base.png")
    parser.add_argument("--cut-right-a", type=float, help="Наклон правого среза: y=b+a*(x-950)")
    parser.add_argument("--cut-right-b", type=float, help="Пересечение правого среза при x=950")
    parser.add_argument("--cut-left-a", type=float, help="Наклон левого среза: y=b+a*(x-550); без него левая кисть не режется")
    parser.add_argument("--cut-left-b", type=float, help="Пересечение левого среза при x=550")
    parser.add_argument("--seed-x", type=int, default=768)
    parser.add_argument("--seed-y", type=int, default=600)
    parser.add_argument("--threshold", type=float, default=20.0)
    parser.add_argument("--head-cut", type=int, help="Убрать базовую голову выше y; по умолчанию 350 male / 400 female")
    return parser.parse_args()


def rgba_resize(image, size):
    return image.convert("RGBa").resize(size, RESAMPLING).convert("RGBA")


def outer_alpha(image):
    if image.mode == "RGBA" and image.getchannel("A").getextrema()[0] < 250:
        return image.getchannel("A").copy()
    array = np.asarray(image.convert("RGB"))
    candidate = Image.fromarray(np.where(np.min(array, axis=2) > 232, 255, 0).astype(np.uint8), "L").copy()
    for point in [(0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1)]:
        if candidate.getpixel(point) == 255:
            ImageDraw.floodfill(candidate, point, 128)
    background = np.asarray(candidate) == 128
    if not background[0, 0]:
        raise ValueError("Не удалось найти внешний фон заливкой от углов")
    return Image.fromarray(np.where(~background, 255, 0).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.45))


def normalize_composite(path):
    source = Image.open(path).convert("RGBA")
    source.putalpha(outer_alpha(source))
    if source.size == SIZE:
        return source
    width, height = source.size
    if width / height > 0.8:
        padded_size = (width, round(width * 1.25))
    else:
        padded_size = (round(height * 0.8), height)
    padded = Image.new("RGBA", padded_size, (0, 0, 0, 0))
    padded.alpha_composite(source, ((padded_size[0] - width) // 2, (padded_size[1] - height) // 2))
    return rgba_resize(padded, SIZE)


def connected(mask, seed):
    data = mask.load()
    actual = None
    for radius in range(0, 80, 3):
        for y in range(max(0, seed[1] - radius), min(SIZE[1], seed[1] + radius + 1), 3):
            for x in range(max(0, seed[0] - radius), min(SIZE[0], seed[0] + radius + 1), 3):
                if data[x, y]:
                    actual = (x, y)
                    break
            if actual:
                break
        if actual:
            break
    if not actual:
        raise ValueError(f"Не найдена связная область рядом с seed={seed}")
    result = mask.copy()
    ImageDraw.floodfill(result, actual, 128)
    selected = np.asarray(result) == 128
    if not selected.any():
        raise ValueError(f"Пустая связная область рядом с seed={seed}")
    return Image.fromarray(np.where(selected, 255, 0).astype(np.uint8), "L")


def cut_lines(args):
    right_a = args.cut_right_a if args.cut_right_a is not None else (0.3 if args.body == "male" else 0.4)
    right_b = args.cut_right_b if args.cut_right_b is not None else (985 if args.body == "male" else 1000)
    if args.cut_left_a is not None or args.cut_left_b is not None:
        left_a = args.cut_left_a if args.cut_left_a is not None else 0.25
        left_b = args.cut_left_b if args.cut_left_b is not None else 980
    elif args.body == "male":
        left_a, left_b = 0.25, 980
    else:
        left_a, left_b = None, None
    return right_a, right_b, left_a, left_b


def art_path(value, default):
    path = Path(value) if value else default
    return path if path.is_absolute() else ART_ROOT / path


def template_path(args):
    default = ART_ROOT / "knight" / "doll" / args.body / "hands_base.png"
    return art_path(args.template_out, default)


def save_png(path, image):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp.png")
    image.save(temporary)
    os.replace(temporary, path)


def main():
    args = parse_args()
    body_id = args.body
    item_id = args.item
    composite_path = art_path(args.composite, ART_ROOT / "knight" / "composites" / f"{item_id}_{body_id}.jfif")
    full_path = ART_ROOT / "knight" / "doll" / body_id / "full.png"
    hands_path = ART_ROOT / "knight" / "doll" / body_id / "hands.png"
    template = template_path(args)
    if template.exists():
        reusable_path = template
    elif hands_path.exists():
        reusable_path = hands_path
    else:
        raise FileNotFoundError(
            f"Нет {template} или {hands_path}. Сначала создайте кисти по контуру и сохраните reusable-шаблон."
        )
    full = Image.open(full_path).convert("RGBA")
    composite = normalize_composite(composite_path)
    reusable = Image.open(reusable_path).convert("RGBA")
    reusable_alpha = np.asarray(reusable.getchannel("A"), dtype=np.float32) / 255.0
    full_alpha = np.asarray(full.getchannel("A"), dtype=np.float32) / 255.0
    base = np.asarray(full)[..., :3].astype(np.float32)
    composite_rgb = np.asarray(composite)[..., :3].astype(np.float32)
    composite_alpha = np.asarray(composite.getchannel("A"))
    distance = np.sqrt(np.mean((base - composite_rgb) ** 2, axis=2))
    y, x = np.indices(distance.shape)
    right_a, right_b, left_a, left_b = cut_lines(args)
    cut_line = right_b + right_a * (x - 950)
    if left_a is not None:
        cut_line = np.where(x < 800, left_b + left_a * (x - 550), cut_line)

    raw = Image.fromarray(
        np.where((distance > args.threshold) & (composite_alpha > 0), 255, 0).astype(np.uint8),
        "L",
    ).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    main_mask = connected(raw, (args.seed_x, args.seed_y))
    closed = main_mask.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.MinFilter(31))
    mask = ((np.asarray(closed) > 0) & (distance > 8) & (composite_alpha > 0)) | (np.asarray(main_mask) > 0)
    mask &= ~((np.asarray(full.getchannel("A")) > 0) & (distance < 12))
    head_cut = args.head_cut if args.head_cut is not None else (350 if body_id == "male" else 400)
    mask[y < head_cut] = False
    mask[(np.asarray(full.getchannel("A")) > 0) & (y > 1000) & (distance < 45)] = False
    expanded_base = full.getchannel("A").point(lambda value: 255 if value else 0).filter(ImageFilter.MaxFilter(15))
    mask[(np.asarray(expanded_base) > 0) & (y > 1400)] = False

    restore_right = (x > 850) & (x < 1100) & (y > 800) & (y < 1120) & (distance > 20) & (composite_alpha > 0)
    mask[restore_right] = True
    if left_a is not None:
        restore_left = (x > 400) & (x < 750) & (y > 800) & (y < 1250) & (distance > 20) & (composite_alpha > 0)
        mask[restore_left] = True
    mask[(reusable_alpha > 0) & (y >= cut_line)] = False

    armor = composite.copy()
    armor.putalpha(Image.fromarray(np.where(mask, 255, 0).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.35)))
    body = full.copy()
    body.putalpha(Image.fromarray(np.rint(full_alpha * (1 - reusable_alpha) * 255).astype(np.uint8), "L"))
    hands = full.copy()
    hands.putalpha(Image.fromarray(np.rint(reusable_alpha * (y >= cut_line) * 255).astype(np.uint8), "L"))

    preview_path = Path(args.preview) if args.preview else TMP_ROOT / f"{item_id}-{body_id}-review.jpg"
    if not preview_path.is_absolute():
        preview_path = TMP_ROOT / preview_path
    preview_path.parent.mkdir(parents=True, exist_ok=True)
    room_path = ART_ROOT / "knight" / "room.png"
    room = Image.open(room_path).convert("RGBA").resize(SIZE, RESAMPLING)
    assembled = room.copy()
    assembled.alpha_composite(body)
    assembled.alpha_composite(armor)
    assembled.alpha_composite(hands)
    full_view = assembled.copy()
    full_view.thumbnail((320, 400), RESAMPLING)
    right_detail = assembled.crop((760, 620, 1260, 1320)).resize((320, 400), RESAMPLING)
    panels = [("full", full_view)]
    if left_a is not None:
        left_detail = assembled.crop((350, 800, 800, 1320)).resize((320, 400), RESAMPLING)
        panels.append(("left hand", left_detail))
    panels.append(("right hand", right_detail))
    sheet = Image.new("RGB", (320 * len(panels), 430), "#211a16")
    draw = ImageDraw.Draw(sheet)
    for index, (label, image) in enumerate(panels):
        sheet.paste(image.convert("RGB"), (index * 320, 0))
        draw.text((index * 320 + 10, 405), label, fill="#eadbc2")
    sheet.save(preview_path, quality=96)

    armor_out = art_path(args.armor_out, ART_ROOT / "knight" / "parts" / body_id / f"{item_id}.png")
    body_out = art_path(args.body_out, ART_ROOT / "knight" / "doll" / body_id / "body.png")
    hands_out = art_path(args.hands_out, ART_ROOT / "knight" / "doll" / body_id / "hands.png")
    if args.apply:
        if not template.exists():
            save_png(template, reusable)
        save_png(body_out, body)
        save_png(hands_out, hands)
        save_png(armor_out, armor)
        for path in [body_out, hands_out, armor_out, template]:
            with Image.open(path) as image:
                assert image.size == SIZE and image.mode == "RGBA" and image.getpixel((0, 0))[3] == 0, path
        print(f"Применено: {body_out}, {hands_out}, {armor_out}; шаблон: {template}")
    else:
        print("DRY-RUN: рабочие файлы не изменены. Для записи добавьте --apply.")
    print(f"Preview: {preview_path}")
    print(f"Срез: y={right_b}+({right_a})*(x-950)" + (f"; слева y={left_b}+({left_a})*(x-550)" if left_a is not None else "; левая кисть без среза"))


if __name__ == "__main__":
    main()
