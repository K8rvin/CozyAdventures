import argparse
import importlib.util
from pathlib import Path
from types import SimpleNamespace

import json

GAME_ROOT = Path(__file__).resolve().parents[1]
ART_ROOT = GAME_ROOT.parent / "art-src"
TMP_ROOT = GAME_ROOT.parent / "tmp"
MANIFEST_PATH = ART_ROOT / "knight" / "production-manifest.json"

spec = importlib.util.spec_from_file_location("prepare_knight_layer", Path(__file__).with_name("prepare-knight-layer.py"))
layer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layer)


def parse_args():
    parser = argparse.ArgumentParser(description="Пакетная подготовка изолированных предметов по production-manifest.json")
    parser.add_argument("ids", nargs="*", help="ID записей manifest; без них используйте --all-ready")
    parser.add_argument("--manifest", help="Другой manifest")
    parser.add_argument("--body", choices=["male", "female", "both"], default="both")
    parser.add_argument("--all-ready", action="store_true", help="Выбрать записи с заполненным transform")
    parser.add_argument("--apply", action="store_true", help="Записать PNG только для approved/exported; без него только preview")
    return parser.parse_args()


def load_manifest(path):
    with path.open(encoding="utf-8") as opened:
        data = json.load(opened)
    if data.get("version") != 1 or not isinstance(data.get("items"), list):
        raise ValueError("Ожидается manifest version=1 со списком items")
    result = {}
    for entry in data["items"]:
        item_id = entry.get("id")
        if not item_id or item_id in result:
            raise ValueError(f"Пустой или повторный id: {item_id}")
        if entry.get("part") == "both" and not entry.get("mask"):
            raise ValueError(f"{item_id}: для part=both нужна mask")
        result[item_id] = entry
    return result


def selected_entries(entries, args):
    if args.ids:
        unknown = [item_id for item_id in args.ids if item_id not in entries]
        if unknown:
            raise ValueError(f"Неизвестные id: {', '.join(unknown)}")
        return [entries[item_id] for item_id in dict.fromkeys(args.ids)]
    if not args.all_ready:
        raise ValueError("Укажите id или --all-ready")
    required = ("width", "height", "centerX", "centerY")
    return [entry for entry in entries.values() if all(entry.get(key) is not None for key in required)]


def namespace(entry, body_id, apply):
    required = ("width", "height", "centerX", "centerY")
    missing = [key for key in required if entry.get(key) is None]
    if missing:
        raise ValueError(f"нет transform: {', '.join(missing)}")
    return SimpleNamespace(
        body=body_id,
        item=entry.get("outputId", entry["id"]),
        slot=entry["slot"],
        part=entry.get("part", "main"),
        output_mode=entry.get("outputMode", "body"),
        source=entry["source"],
        mask=entry.get("mask"),
        angle=entry.get("angle", 0),
        width=entry["width"],
        height=entry["height"],
        center_x=entry["centerX"],
        center_y=entry["centerY"],
        padding=entry.get("padding", 8),
        pocket=entry.get("pockets", []),
        detail=entry.get("detail"),
        out=None,
        preview=str(TMP_ROOT / f"batch-{body_id}-{entry['id']}-review.jpg"),
        apply=apply,
    )


def main():
    args = parse_args()
    manifest_path = Path(args.manifest) if args.manifest else MANIFEST_PATH
    if not manifest_path.is_absolute():
        manifest_path = ART_ROOT / manifest_path
    entries = selected_entries(load_manifest(manifest_path), args)
    if not entries:
        print("Нет записей с заполненным transform")
        return 0
    body_ids = ["male", "female"] if args.body == "both" else [args.body]
    errors = []
    for entry in entries:
        if args.apply and entry.get("status") not in ("approved", "exported"):
            errors.append(f"{entry['id']}: статус {entry.get('status')} не разрешает --apply")
            continue
        for body_id in body_ids:
            try:
                options = namespace(entry, body_id, args.apply)
                source_path = layer.art_path(options.source, None)
                if not source_path.is_file():
                    raise FileNotFoundError(f"нет исходника: {source_path}")
                source = layer.load_source(source_path, options.pocket)
                parts = layer.make_parts(source, options)
                assembled = layer.assemble(parts, options)
                preview_path = layer.save_preview(parts, assembled, options)
                print(f"Preview {body_id}/{entry['id']}: {preview_path}")
                if args.apply:
                    for part, image in parts.items():
                        path = layer.output_path(options, part)
                        layer.save_png(path, image)
                        with layer.Image.open(path) as saved:
                            assert saved.size == layer.SIZE and saved.mode == "RGBA" and saved.getpixel((0, 0))[3] == 0, path
                        print(f"Применено {body_id}/{entry['id']} ({part}): {path}")
            except Exception as error:
                errors.append(f"{body_id}/{entry['id']}: {error}")
    for error in errors:
        print(f"ОШИБКА: {error}")
    print(f"Обработка завершена: записей {len(entries)}, ошибок {len(errors)}. Режим: {'apply' if args.apply else 'dry-run'}.")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
