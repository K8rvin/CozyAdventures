import argparse
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageOps

SIZE = (768, 960)


def parse_args():
    parser = argparse.ArgumentParser(description="Конвертация сгенерированного портрета в постоянный WebP-кэш")
    parser.add_argument("input")
    parser.add_argument("output")
    parser.add_argument("metadata")
    parser.add_argument("--key", required=True)
    parser.add_argument("--model", required=True)
    parser.add_argument("--prompt-version", type=int, required=True)
    parser.add_argument("--state", required=True)
    return parser.parse_args()


def atomic_json(path, value):
    temporary = path.with_suffix(".tmp.json")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def main():
    args = parse_args()
    output = Path(args.output)
    metadata = Path(args.metadata)
    output.parent.mkdir(parents=True, exist_ok=True)
    metadata.parent.mkdir(parents=True, exist_ok=True)
    if output.exists() and metadata.exists():
        print(f"Кэш уже существует: {output}")
        return
    with Image.open(args.input) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        converted = ImageOps.fit(image, SIZE, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    temporary = output.with_suffix(".tmp.webp")
    converted.save(temporary, "WEBP", quality=86, method=6)
    with Image.open(temporary) as saved:
        if saved.size != SIZE or saved.format != "WEBP":
            raise ValueError("Проверка WebP после конвертации не прошла")
    if temporary.stat().st_size < 1000:
        raise ValueError("Результат конвертации подозрительно мал")
    os.replace(temporary, output)
    atomic_json(metadata, {
        "key": args.key,
        "model": args.model,
        "promptVersion": args.prompt_version,
        "state": json.loads(args.state),
        "width": SIZE[0],
        "height": SIZE[1],
        "format": "webp",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    })
    print(f"WebP сохранён: {output}")


if __name__ == "__main__":
    main()
