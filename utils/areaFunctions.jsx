export function calculatePolygonArea(latLngs) {
  const n = latLngs.length;
  if (n < 3) return 0;

  let area = 0;
  for (let i = 0; i < n; i++) {
    const { lat: lat1, lng: lng1 } = latLngs[i];
    const { lat: lat2, lng: lng2 } = latLngs[(i + 1) % n];
    area += lng1 * lat2 - lng2 * lat1;
  }

  return Math.abs(area / 2); 
}

export function calculatePolygonCenter(latLngs) {
  const n = latLngs.length;
  if (n < 3) return { lat: 0, lng: 0 };

  let areaSum = 0;
  let centroidX = 0;
  let centroidY = 0;

  for (let i = 0; i < n; i++) {
    const { lat: lat1, lng: lng1 } = latLngs[i];
    const { lat: lat2, lng: lng2 } = latLngs[(i + 1) % n];
    const cross = lng1 * lat2 - lng2 * lat1;

    areaSum += cross;
    centroidX += (lng1 + lng2) * cross;
    centroidY += (lat1 + lat2) * cross;
  }

  const factor = 1 / (3 * areaSum);
  return { lat: centroidY * factor, lng: centroidX * factor };
}
