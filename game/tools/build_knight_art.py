import json
import math
import sys
from collections import Counter
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT.parent / "art-src" / "knight"
RUNTIME_ROOT = ROOT / "assets" / "knight"
CONTACT_ROOT = ROOT.parent / "tmp"
RESAMPLING = Image.Resampling.LANCZOS
QUALITY = 89
THUMB_SIZE = (192, 240)
TILE_SIZE = (216, 274)
COLUMNS = 5
PER_PAGE = 20


def safe_path(root, relative):
    root = root.resolve()
    candidate = (root / Path(relative)).resolve()
    try:
        candidate.relative_to(root)
    except ValueError as error:
        raise ValueError(f"Путь выходит за разрешённый каталог: {relative}") from error
    return candidate


def is_4x5(size):
    width, height = size
    return width > 0 and height > 0 and width * 5 == height * 4


def rgba_resize(image, size):
    return image.convert("RGBa").resize(size, RESAMPLING).convert("RGBA")


def round_shift(value):
    return math.floor(value + 0.5) if value >= 0 else math.ceil(value - 0.5)


class KnightArtBuild:
    def __init__(self, payload):
        self.check = payload["check"] is True
        self.target = (payload["target"]["width"], payload["target"]["height"])
        self.tasks = payload["tasks"]
        self.base_tasks = [task for task in self.tasks if task["kind"] == "base"]
        self.selected_ids = set(payload["selectedIds"])
        self.selected_tasks = [task for task in self.tasks if task["id"] in self.selected_ids]
        self.contact_prefix = payload["contactPrefix"]
        self.records = {}
        self.missing = []
        self.errors = []
        self.warnings = []
        self.invalid = set()
        self.common_size = None
        self.processed_base = 0
        self.processed_items = 0
        self.exported_files = 0
        self.validated_files = 0
        self.contact_tiles = []
        self.contact_files = []
        self.contact_bases = {}

    def issue(self, task, message):
        text = f"{task['id']} [{task['wave']}/{task['slot']}]: {message}"
        if task["id"] in self.selected_ids:
            self.errors.append(text)
            self.invalid.add(task["id"])
        else:
            self.warnings.append(f"Невыбранный исходник: {text}")

    def prepare_records(self):
        for task in self.tasks:
            for source in task["sources"]:
                candidates = []
                for relative in source["sourceCandidates"]:
                    candidate = safe_path(SOURCE_ROOT, relative)
                    candidates.append((relative, candidate))
                existing = [(relative, candidate) for relative, candidate in candidates if candidate.is_file()]
                key = (task["id"], source["part"])
                if existing:
                    relative, candidate = existing[0]
                    self.records[key] = {
                        "task": task,
                        "source": source,
                        "relative": relative,
                        "path": candidate,
                        "size": None,
                        "frame_error": False,
                    }
                elif task["id"] in self.selected_ids:
                    self.missing.append({"task": task, "source": source})
                    self.invalid.add(task["id"])

    def scan_metadata(self):
        for record in self.records.values():
            task = record["task"]
            try:
                with Image.open(record["path"]) as image:
                    width, height = image.size
                    orientation = image.getexif().get(274)
                    if orientation in {5, 6, 7, 8}:
                        width, height = height, width
                    record["size"] = (width, height)
            except Exception as error:
                self.issue(task, f"не читается {record['relative']}: {error}")

    def validate_frames(self):
        if not is_4x5(self.target):
            raise ValueError(f"Целевой кадр не 4:5: {self.target[0]}x{self.target[1]}")
        part_records = []
        for record in self.records.values():
            size = record["size"]
            if size is None:
                continue
            task = record["task"]
            if task["id"] == "room":
                continue
            if not is_4x5(size):
                record["frame_error"] = True
                self.issue(task, f"кадр {size[0]}x{size[1]} не 4:5: {record['relative']}")
                continue
            part_records.append(record)
        counts = Counter(record["size"] for record in part_records)
        order = {}
        for record in part_records:
            order.setdefault(record["size"], len(order))
        if counts:
            self.common_size = max(counts, key=lambda size: (counts[size], -order[size]))
        for record in part_records:
            size = record["size"]
            if size != self.common_size:
                record["frame_error"] = True
                expected = f"{self.common_size[0]}x{self.common_size[1]}"
                self.issue(
                    record["task"],
                    f"кадр {size[0]}x{size[1]} отличается от общего {expected}: {record['relative']}",
                )

    def load_record(self, record, require_alpha):
        if record["size"] is None:
            raise ValueError(f"нет метаданных изображения: {record['relative']}")
        if record["frame_error"]:
            raise ValueError(f"исходник не прошёл проверку кадра: {record['relative']}")
        with Image.open(record["path"]) as opened:
            oriented = ImageOps.exif_transpose(opened)
            try:
                image = oriented.convert("RGBA" if require_alpha else "RGB")
            finally:
                if oriented is not opened:
                    oriented.close()
        if image.size != record["size"]:
            image.close()
            raise ValueError(f"размер изменился после чтения EXIF: {record['relative']}")
        if require_alpha:
            minimum, maximum = image.getchannel("A").getextrema()
            if minimum >= 250:
                image.close()
                raise ValueError(
                    f"нет настоящего alpha (min alpha={minimum} >= 250): {record['relative']}; "
                    "белый или шахматный фон не считается прозрачностью"
                )
            if maximum == 0:
                image.close()
                raise ValueError(f"слой полностью прозрачен: {record['relative']}")
        return image

    def resize(self, image):
        if image.mode == "RGBA":
            return rgba_resize(image, self.target)
        return image.resize(self.target, RESAMPLING)

    def save_webp(self, image, runtime_src):
        destination = safe_path(RUNTIME_ROOT, Path(runtime_src).relative_to("assets/knight"))
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, "WEBP", quality=QUALITY, method=6)
        self.exported_files += 1

    def process_base(self, task):
        record = self.records[(task["id"], "main")]
        image = self.load_record(record, require_alpha=task["id"] != "room")
        resized = None
        try:
            if self.check:
                self.validated_files += 1
                return
            resized = self.resize(image)
            self.save_webp(resized, task["runtimeSrc"])
        finally:
            image.close()
            if resized is not None:
                resized.close()

    def second_shift(self, image, second):
        width, height = image.size
        dx = round_shift(width * second["dx"])
        dy = round_shift(height * second["dy"])
        bbox = image.getchannel("A").getbbox()
        if bbox is None:
            raise ValueError("нельзя сдвинуть полностью прозрачный второй слот")
        left, top, right, bottom = bbox
        shifted = (left + dx, top + dy, right + dx, bottom + dy)
        if shifted[0] < 0 or shifted[1] < 0 or shifted[2] > width or shifted[3] > height:
            raise ValueError(
                "сдвиг второго слота обрезал бы содержимое: "
                f"dx={dx}, dy={dy}, alpha bbox={bbox}, сдвинутый bbox={shifted}, кадр={width}x{height}"
            )
        return dx, dy

    def shift_image(self, image, dx, dy):
        return image.transform(
            image.size,
            Image.Transform.AFFINE,
            (1, 0, -dx, 0, 1, -dy),
            resample=Image.Resampling.NEAREST,
            fillcolor=(0, 0, 0, 0),
        )

    def process_item(self, task):
        originals = {}
        prepared = {}
        try:
            for source in task["sources"]:
                record = self.records[(task["id"], source["part"])]
                originals[source["part"]] = self.load_record(record, require_alpha=True)
            shift = None
            if task["second"]:
                shift = self.second_shift(originals["main"], task["second"])
            output_count = len(task["sources"]) + (1 if task["second"] else 0)
            if self.check:
                self.validated_files += output_count
                return
            for source in task["sources"]:
                prepared[source["src"]] = rgba_resize(originals[source["part"]], self.target)
            if task["second"]:
                shifted = self.shift_image(originals["main"], *shift)
                try:
                    prepared[task["second"]["src"]] = rgba_resize(shifted, self.target)
                finally:
                    shifted.close()
            for runtime_src, image in prepared.items():
                self.save_webp(image, runtime_src)
            self.add_contact_tiles(task, prepared)
        finally:
            for image in originals.values():
                image.close()
            for image in prepared.values():
                image.close()

    def load_runtime_base(self, task):
        relative = Path(task["runtimeSrc"]).relative_to("assets/knight")
        source = safe_path(RUNTIME_ROOT, relative)
        if not source.is_file():
            raise ValueError("runtime-файл отсутствует")
        with Image.open(source) as opened:
            image = opened.convert("RGBA")
        if image.size != self.target:
            image.close()
            raise ValueError(f"runtime-кадр {image.size} не равен {self.target}")
        if task["id"] != "room":
            minimum, maximum = image.getchannel("A").getextrema()
            if minimum >= 250 or maximum == 0:
                image.close()
                raise ValueError("runtime-слой не содержит пригодный alpha")
        return image

    def load_contact_base_layer(self, task):
        problems = []
        try:
            return self.load_runtime_base(task)
        except Exception as error:
            problems.append(str(error))
        record = self.records.get((task["id"], "main"))
        if record is None:
            raise ValueError("; ".join(problems + ["исходник отсутствует"]))
        image = None
        try:
            image = self.load_record(record, require_alpha=task["id"] != "room")
            resized = self.resize(image)
            if resized.mode != "RGBA":
                rgba = resized.convert("RGBA")
                resized.close()
                resized = rgba
            return resized
        except Exception as error:
            problems.append(str(error))
            raise ValueError("; ".join(problems)) from error
        finally:
            if image is not None:
                image.close()

    def contact_base_tasks(self, body_id):
        return [
            task for task in self.base_tasks
            if task["key"] == "room" or task.get("bodyId") == body_id
        ]

    def get_contact_base(self, body_id):
        if body_id in self.contact_bases:
            return self.contact_bases[body_id]
        images = {}
        problems = []
        for task in self.contact_base_tasks(body_id):
            try:
                images[task["runtimeSrc"]] = self.load_contact_base_layer(task)
            except Exception as error:
                problems.append(f"{task['id']}: {error}")
        if problems:
            for image in images.values():
                image.close()
            self.contact_bases[body_id] = None
            print(
                f"Контактные листы для {body_id} пропущены; экспорт выбранных слоёв продолжен. "
                f"Нужны общая room и база {body_id}: " + " | ".join(problems)
            )
            return None
        self.contact_bases[body_id] = images
        return images

    def add_contact_tiles(self, task, prepared):
        body_id = task["bodyId"]
        base = self.get_contact_base(body_id)
        if base is None:
            return
        base_tasks = self.contact_base_tasks(body_id)
        hidden = set(task["hideBase"])
        for variant in task["variants"]:
            canvas = Image.new("RGBA", self.target, (0, 0, 0, 0))
            fitted = None
            try:
                layers = []
                for base_task in base_tasks:
                    if base_task["key"] not in hidden:
                        layers.append((base_task["z"], 0, base_task["key"], base[base_task["runtimeSrc"]]))
                for index, layer in enumerate(variant["layers"]):
                    layers.append((layer["z"], 1, index, prepared[layer["src"]]))
                for _, _, _, image in sorted(layers, key=lambda entry: entry[:3]):
                    canvas.alpha_composite(image)
                fitted = rgba_resize(canvas, THUMB_SIZE)
                tile = fitted.convert("RGB")
            finally:
                canvas.close()
                if fitted is not None:
                    fitted.close()
            self.contact_tiles.append((body_id, f"{task['id']} [{variant['slot']}]", tile))

    def write_contacts(self):
        CONTACT_ROOT.mkdir(parents=True, exist_ok=True)
        groups = {}
        for body_id, label, tile in self.contact_tiles:
            groups.setdefault(body_id, []).append((label, tile))
        for body_id, tiles in groups.items():
            for page_index in range((len(tiles) + PER_PAGE - 1) // PER_PAGE):
                chunk = tiles[page_index * PER_PAGE:(page_index + 1) * PER_PAGE]
                rows = (len(chunk) + COLUMNS - 1) // COLUMNS
                sheet = Image.new("RGB", (COLUMNS * TILE_SIZE[0], rows * TILE_SIZE[1]), "#211a16")
                try:
                    draw = ImageDraw.Draw(sheet)
                    for index, (label, tile) in enumerate(chunk):
                        x = (index % COLUMNS) * TILE_SIZE[0]
                        y = (index // COLUMNS) * TILE_SIZE[1]
                        sheet.paste(tile, (x + 12, y + 8))
                        draw.text((x + 12, y + 253), label[:34], fill="#eadbc2")
                    destination = CONTACT_ROOT / f"{self.contact_prefix}-{body_id}-{page_index + 1}.jpg"
                    sheet.save(destination, "JPEG", quality=90)
                    self.contact_files.append(destination)
                finally:
                    sheet.close()

    def report_missing(self):
        if not self.missing:
            return
        base = [entry for entry in self.missing if entry["task"]["kind"] == "base"]
        special = [
            entry for entry in self.missing
            if entry["task"]["kind"] == "item" and entry["source"]["part"] != "main"
        ]
        ordinary = [
            entry for entry in self.missing
            if entry["task"]["kind"] == "item" and entry["source"]["part"] == "main"
        ]
        print(f"Отсутствуют исходники: {len(self.missing)}.", file=sys.stderr)
        if base:
            print("  Основа:", file=sys.stderr)
            for entry in base:
                candidates = " или ".join(entry["source"]["sourceCandidates"])
                print(f"    {entry['task']['id']}: {candidates}", file=sys.stderr)
        if special:
            print("  Обязательные back/grip по KNIGHT_DOLL_ITEM_RULES:", file=sys.stderr)
            for entry in special:
                candidates = " или ".join(entry["source"]["sourceCandidates"])
                print(f"    {entry['task']['id']} ({entry['source']['part']}): {candidates}", file=sys.stderr)
        if ordinary:
            print("  Предметы по волнам/слотам (unisex: parts/<itemId>.png; body-specific: parts/<bodyId>/<itemId>.png):", file=sys.stderr)
            groups = {}
            for entry in ordinary:
                task = entry["task"]
                waves = groups.setdefault(task["wave"], {})
                waves.setdefault(task["slot"], []).append(task["id"])
            for wave, slots in groups.items():
                print(f"    {wave}:", file=sys.stderr)
                for slot, ids in slots.items():
                    print(f"      {slot} ({len(ids)}): {', '.join(ids)}", file=sys.stderr)

    def report(self):
        self.report_missing()
        if self.errors:
            print("Ошибки валидации/экспорта:", file=sys.stderr)
            for error in self.errors:
                print(f"  {error}", file=sys.stderr)
        if self.warnings:
            print("Предупреждения:", file=sys.stderr)
            for warning in self.warnings:
                print(f"  {warning}", file=sys.stderr)
        problems = len(self.missing) + len(self.errors)
        if self.check:
            print(
                f"Проверка: базовых задач {self.processed_base}, предметов {self.processed_items}, "
                f"файлов {self.validated_files}; проблем {problems}. --check ничего не записал."
            )
        else:
            print(
                f"Экспорт: базовых задач {self.processed_base}, предметов {self.processed_items}, "
                f"WebP {self.exported_files}; проблем {problems}."
            )
            if self.contact_files:
                print("Контактные листы:")
                for destination in self.contact_files:
                    print(f"  {destination}")

    def run(self):
        self.prepare_records()
        self.scan_metadata()
        self.validate_frames()
        for task in self.selected_tasks:
            if task["id"] in self.invalid:
                continue
            try:
                if task["kind"] == "base":
                    self.process_base(task)
                    self.processed_base += 1
                else:
                    self.process_item(task)
                    self.processed_items += 1
            except Exception as error:
                self.issue(task, str(error))
        if not self.check and self.contact_tiles:
            try:
                self.write_contacts()
            except Exception as error:
                self.errors.append(f"Не удалось записать контактные листы: {error}")
        self.report()
        for base in self.contact_bases.values():
            for image in (base or {}).values():
                image.close()
        for _, _, tile in self.contact_tiles:
            tile.close()
        return 1 if self.missing or self.errors else 0


def main():
    for stream in (sys.stdin, sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8")
    payload = json.load(sys.stdin)
    return KnightArtBuild(payload).run()


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        print(f"Ошибка dev-экспорта рыцаря: {error}", file=sys.stderr)
        sys.exit(1)
