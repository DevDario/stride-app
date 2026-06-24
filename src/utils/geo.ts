type Point = [number, number];

export function pointInPolygon(
  point: [number, number],
  polygon: Point[]
): boolean {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function chaikinSmooth(
  polygon: Point[],
  iterations: number = 3
): Point[] {
  if (polygon.length < 3) return polygon;

  const isClosed =
    polygon[0][0] === polygon[polygon.length - 1][0] &&
    polygon[0][1] === polygon[polygon.length - 1][1];

  const pts = isClosed ? polygon.slice(0, -1) : polygon;

  let current = pts;

  for (let iter = 0; iter < iterations; iter++) {
    const next: Point[] = [];
    for (let i = 0; i < current.length; i++) {
      const p0 = current[i];
      const p1 = current[(i + 1) % current.length];

      const qx = p0[0] * 0.75 + p1[0] * 0.25;
      const qy = p0[1] * 0.75 + p1[1] * 0.25;
      const rx = p0[0] * 0.25 + p1[0] * 0.75;
      const ry = p0[1] * 0.25 + p1[1] * 0.75;

      next.push([qx, qy] as Point);
      next.push([rx, ry] as Point);
    }
    current = next;
  }

  if (isClosed) {
    current.push(current[0]);
  }

  return current;
}
