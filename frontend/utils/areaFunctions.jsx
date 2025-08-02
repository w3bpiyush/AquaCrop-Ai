export function calculatePolygonArea(latLngs) {
  const n = latLngs.length;
  if (n < 3) return 0;

  // Shoelace formula helper
  const shoelaceArea = (coords) => {
    let area = 0;
    for (let i = 0; i < coords.length; i++) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[(i + 1) % coords.length];
      area += x1 * y2 - x2 * y1;
    }
    return Math.abs(area / 2);
  };

  // Convert lat/lng to km for accurate area calculation
  const avgLat = latLngs.reduce((sum, p) => sum + p.lat, 0) / n;
  const kmPerDegLat = 111; // ~111 km per degree latitude
  const kmPerDegLng = 111 * Math.cos((avgLat * Math.PI) / 180);

  const coordsKm = latLngs.map((p) => [p.lat * kmPerDegLat, p.lng * kmPerDegLng]);

  // Area in km²
  const areaKm2 = shoelaceArea(coordsKm);

  // Convert to m²
  return areaKm2 * 1_000_000;
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

    const cross = p1.lng * p2.lat - p2.lng * p1.lat;
    areaSum += cross;
    centroidX += (p1.lng + p2.lng) * cross;
    centroidY += (p1.lat + p2.lat) * cross;
  }

  const area = areaSum / 2;
  const factor = 1 / (3 * area);

  return L.latLng(centroidY * factor, centroidX * factor);
}
