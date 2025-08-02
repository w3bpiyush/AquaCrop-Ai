export function calculatePolygonArea(latLngs) {
  const n = latLngs.length;
  if (n < 3) return 0;

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  let area = 0;
  
  // Apply Shoelace formula directly on spherical coordinates
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n; // Next vertex index, wrapping around
    
    // Convert to radians
    const lat1 = toRadians(latLngs[i].lat);
    const lat2 = toRadians(latLngs[j].lat);
    const lng1 = toRadians(latLngs[i].lng);
    const lng2 = toRadians(latLngs[j].lng);
    
    // Shoelace formula on spherical surface
    area += lng1 * lat2 - lng2 * lat1;
  }
  
  area = Math.abs(area) / 2;
  
  // Convert from steradians to square meters
  // Earth's radius in meters (WGS84 mean radius)
  const earthRadius = 6378137;
  const conversionFactor = Math.PI / 180; // degrees to radians
  
  // Convert area from degrees² to m²
  area = area * (earthRadius ** 2) * (conversionFactor ** 2);
  
  return area;
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
