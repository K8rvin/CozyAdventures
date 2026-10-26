import hashlib
import json
import math
import os
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

SIZE = 512
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "achievements"
CONTACT = ROOT.parent / "tmp"
RESAMPLING = Image.Resampling.LANCZOS
PALETTES = {
    "common": ("#80684c", "#d3b98c", "#3d3024"),
    "uncommon": ("#49755f", "#a4d2a7", "#203d32"),
    "rare": ("#416f9b", "#b0d9ef", "#202f48"),
    "epic": ("#795698", "#e0b9ee", "#382542"),
    "legendary": ("#a56d21", "#ffe080", "#4d2e14"),
}


def gradient(size, inner, outer):
    mask = Image.radial_gradient("L").resize((size, size), RESAMPLING)
    return ImageOps.colorize(mask, black=inner, white=outer).convert("RGBA")


def rgba_resize(image, size):
    return image.convert("RGBa").resize(size, RESAMPLING).convert("RGBA")


def cover(image, size):
    width, height = image.size
    scale = max(size[0] / width, size[1] / height)
    resized = rgba_resize(image, (max(1, round(width * scale)), max(1, round(height * scale))))
    left = (resized.width - size[0]) // 2
    top = (resized.height - size[1]) // 2
    return resized.crop((left, top, left + size[0], top + size[1]))


def contain(image, size):
    scale = min(size[0] / image.width, size[1] / image.height)
    copy = rgba_resize(image, (max(1, round(image.width * scale)), max(1, round(image.height * scale))))
    result = Image.new("RGBA", size)
    result.alpha_composite(copy, ((size[0] - copy.width) // 2, (size[1] - copy.height) // 2))
    return result


def variant_stage(item):
    value = item.get("variant", 0)
    if isinstance(value, dict):
        value = value.get("stage", value.get("tier", value.get("index", 0)))
    if isinstance(value, (int, float)):
        return int(value) % 5 + 1
    digest = hashlib.sha256(f"{item['id']}:{value}".encode()).digest()
    return digest[0] % 5 + 1


def leaf_layer(color):
    layer = Image.new("RGBA", (SIZE, SIZE))
    for side in (-1, 1):
        for index in range(7):
            angle = math.radians(118 + index * 18 if side < 0 else 62 - index * 18)
            x = 256 + math.cos(angle) * 211
            y = 256 + math.sin(angle) * 211
            leaf = Image.new("RGBA", (22, 42))
            draw = ImageDraw.Draw(leaf)
            draw.ellipse((2, 1, 20, 40), fill=color, outline="#2b2119", width=2)
            leaf = leaf.rotate(math.degrees(angle) + (35 if side < 0 else -35), Image.Resampling.BICUBIC, expand=True)
            layer.alpha_composite(leaf, (round(x - leaf.width / 2), round(y - leaf.height / 2)))
    return layer


def artwork(item):
    source = Image.open(ROOT / item["sourceArt"]).convert("RGBA")
    transparent = source.getchannel("A").getextrema()[0] < 245
    if transparent:
        base = gradient(356, "#594a38", "#211a17")
        fitted = contain(source, (326, 326))
        base.alpha_composite(fitted, (15, 15))
    else:
        base = cover(source, (356, 356))
    if item["id"] == "_secret":
        grey = ImageOps.grayscale(base)
        base = ImageOps.colorize(grey, black="#100f16", white="#69616f").convert("RGBA")
    mask = Image.new("L", (356, 356))
    ImageDraw.Draw(mask).ellipse((0, 0, 355, 355), fill=255)
    base.putalpha(mask)
    return base


def render(item):
    rarity = item.get("rarity") if item.get("rarity") in PALETTES else "common"
    dark, light, deep = PALETTES[rarity]
    canvas = Image.new("RGBA", (SIZE, SIZE))

    shadow = Image.new("RGBA", (SIZE, SIZE))
    ImageDraw.Draw(shadow).ellipse((35, 43, 477, 485), fill=(0, 0, 0, 185))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(15)))

    canvas.alpha_composite(leaf_layer(dark))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((35, 29, 477, 471), fill=deep, outline=light, width=8)
    draw.ellipse((51, 45, 461, 455), fill=dark, outline="#2a2019", width=4)
    draw.ellipse((66, 60, 446, 440), fill=light, outline=light, width=3)
    draw.ellipse((76, 70, 436, 430), fill=deep, outline="#2b2119", width=4)

    canvas.alpha_composite(artwork(item), (78, 72))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((78, 72, 434, 428), outline=light, width=5)
    draw.arc((48, 42, 464, 458), 198, 322, fill=light, width=5)
    draw.arc((57, 51, 455, 449), 200, 305, fill="#fff0c8", width=2)

    draw.polygon(((102, 392), (172, 408), (148, 487), (93, 459), (117, 438)), fill=dark, outline=deep)
    draw.polygon(((410, 392), (340, 408), (364, 487), (419, 459), (395, 438)), fill=dark, outline=deep)
    draw.rounded_rectangle((142, 407, 370, 466), radius=18, fill=deep, outline=light, width=4)
    stage = variant_stage(item)
    spacing = 32
    start = 256 - (stage - 1) * spacing / 2
    for index in range(stage):
        x = round(start + index * spacing)
        y = 437
        draw.polygon(((x, y - 10), (x + 10, y), (x, y + 10), (x - 10, y)), fill=light, outline=dark)

    digest = hashlib.sha256(item["id"].encode()).digest()
    for index in range(4):
        angle = math.radians(32 + index * 82 + digest[index] % 17)
        x = 256 + math.cos(angle) * 207
        y = 250 + math.sin(angle) * 207
        radius = 4 + digest[index + 4] % 3
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=light, outline=dark)

    if item["id"] == "_secret":
        draw.ellipse((222, 180, 290, 248), fill="#17141d", outline=light, width=4)
        draw.polygon(((240, 226), (272, 226), (293, 331), (219, 331)), fill="#17141d", outline=light)
        draw.ellipse((217, 316, 295, 340), fill="#17141d", outline=light, width=3)

    highlight = Image.new("RGBA", (SIZE, SIZE))
    hdraw = ImageDraw.Draw(highlight)
    hdraw.arc((44, 36, 468, 464), 205, 295, fill=(255, 255, 255, 100), width=3)
    canvas.alpha_composite(highlight.filter(ImageFilter.GaussianBlur(1)))
    return canvas


def contact_sheets(rendered):
    CONTACT.mkdir(parents=True, exist_ok=True)
    prefix = os.environ.get("ACHIEVEMENT_CONTACT_PREFIX", "achievements-contact")
    columns = 5
    per_sheet = 40
    tile_w, tile_h = 170, 195
    for sheet_index in range((len(rendered) + per_sheet - 1) // per_sheet):
        chunk = rendered[sheet_index * per_sheet:(sheet_index + 1) * per_sheet]
        rows = (len(chunk) + columns - 1) // columns
        sheet = Image.new("RGB", (columns * tile_w, rows * tile_h), "#211a16")
        draw = ImageDraw.Draw(sheet)
        for index, (item, image) in enumerate(chunk):
            x = (index % columns) * tile_w
            y = (index // columns) * tile_h
            thumb = image.resize((154, 154), RESAMPLING)
            sheet.paste(thumb, (x + 8, y + 2), thumb)
            draw.text((x + 8, y + 162), item["id"][:23], fill="#eadbc2")
            draw.text((x + 8, y + 178), item.get("rarity", "common"), fill="#b9a88e")
        sheet.save(CONTACT / f"{prefix}-{sheet_index + 1}.jpg", quality=90)


def main():
    items = json.load(sys.stdin)
    OUT.mkdir(parents=True, exist_ok=True)
    rendered = []
    for item in items:
        image = render(item)
        image.save(OUT / f"{item['id']}.webp", "WEBP", quality=88, method=6)
        rendered.append((item, image))
    contact_sheets(rendered)
    print(f"Создано медальонов: {len(rendered)}; контактные листы: {CONTACT}")


if __name__ == "__main__":
    main()
