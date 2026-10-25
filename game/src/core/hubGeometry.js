// Геометрия хотспотов в процентах сцены 0..100, без зависимости от DOM.
export function normalizeScenePoints(points) {
  if (!Array.isArray(points) || points.length < 3) {
    throw new RangeError('Для силуэта нужны минимум три вершины');
  }
  return points.map((point, index) => {
    const x = Array.isArray(point) ? point[0] : point?.x;
    const y = Array.isArray(point) ? point[1] : point?.y;
    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100) {
      throw new RangeError(`Вершина ${index} должна иметь конечные координаты от 0 до 100`);
    }
    return { x, y };
  });
}

function cssNumber(value) {
  return String(Number(value.toFixed(4)));
}

export function scenePolygonGeometry(input) {
  const points = normalizeScenePoints(input);
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const width = right - left;
  const height = bottom - top;
  if (width <= 0 || height <= 0) {
    throw new RangeError('Силуэт должен занимать ненулевую ширину и высоту');
  }

  const localPoints = points.map((point) => ({
    x: ((point.x - left) / width) * 100,
    y: ((point.y - top) / height) * 100,
  }));
  const polygon = `polygon(${localPoints.map((point) => `${cssNumber(point.x)}% ${cssNumber(point.y)}%`).join(', ')})`;

  let area2 = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const cross = a.x * b.y - b.x * a.y;
    area2 += cross;
    cx += (a.x + b.x) * cross;
    cy += (a.y + b.y) * cross;
  }
  const center = Math.abs(area2) > 1e-9
    ? { x: cx / (3 * area2), y: cy / (3 * area2) }
    : { x: left + width / 2, y: top + height / 2 };
  const labelAnchor = { x: center.x, y: bottom };
  const localCenter = {
    x: ((center.x - left) / width) * 100,
    y: ((center.y - top) / height) * 100,
  };

  return {
    points,
    bbox: { left, top, width, height },
    left,
    top,
    width,
    height,
    polygon,
    center,
    localCenter,
    labelAnchor,
  };
}
