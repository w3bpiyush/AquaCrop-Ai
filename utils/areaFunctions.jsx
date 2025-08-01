export function calculatePolygonArea(latLngs) {
  const n = latLngs.length;
  if (n < 3) return 0;

  let area = 0;
  for (let i = 0; i < n; i++) {
    const p1 = latLngs[i];
    const p2 = latLngs[(i + 1) % n]; 

    area += (p1.lng * p2.lat) - (p2.lng * p1.lat);
  }

  return Math.abs(area / 2);
}

export function calculatePolygonCenter(latLngs) {
  const n = latLngs.length;
  if (n < 3) return L.latLng(0, 0);

  let areaSum = 0;
  let centroidX = 0;
  let centroidY = 0;

  for (let i = 0; i < n; i++) {
    const p1 = latLngs[i];
    const p2 = latLngs[(i + 1) % n];

    const cross = (p1.lng * p2.lat) - (p2.lng * p1.lat);
    areaSum += cross;
    centroidX += (p1.lng + p2.lng) * cross;
    centroidY += (p1.lat + p2.lat) * cross;
  }

  const area = areaSum / 2;
  const factor = 1 / (3 * area);

  return L.latLng(centroidY * factor, centroidX * factor);
}