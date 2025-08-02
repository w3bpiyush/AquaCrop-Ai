"use client";
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useDraw } from "../context/DrawContext";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import { calculatePolygonArea, calculatePolygonCenter } from "../utils/areaFunctions";

const MapSetup = () => {
  const map = useMap();
  const { setMap } = useDraw();

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
};

const MapUpdater = () => {
  const { center } = useDraw();
  const map = useMap();

  useEffect(() => {
    if (map && center) map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

const AutoDrawPolygon = () => {
  const map = useMap();
  const { triggerDraw, setTriggerDraw } = useDraw();

  useEffect(() => {
    if (triggerDraw && map) {
      const polygonDrawer = new L.Draw.Polygon(map);
      polygonDrawer.enable();
      setTriggerDraw(false);
    }
  }, [triggerDraw, map, setTriggerDraw]);

  return null;
};

export default function Map() {
  const featureGroupRef = useRef();
  const { setPolygonData, map } = useDraw();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
     setMounted(true);
    
    if (map) {
      map.remove();
    }
  }, []);

  const handleCreated = (e) => {
    const layer = e.layer;
    const latlngs = layer.getLatLngs()[0];
    featureGroupRef.current?.addLayer(layer);

    const area = calculatePolygonArea(latlngs);
    const center = calculatePolygonCenter(latlngs);
    setPolygonData({ latlngs, area, center });
  };

  if (!mounted) return null;

  return (
    <MapContainer center={[36.7783, -119.4179]} zoom={13} className="h-screen w-full z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapUpdater />
      <MapSetup />
      <AutoDrawPolygon />
      <FeatureGroup ref={featureGroupRef}>
        <EditControl
          position="topright"
          draw={{
            polygon: false,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
            polyline: false,
          }}
          edit={{ edit: true, remove: true }}
          onCreated={handleCreated}
        />
      </FeatureGroup>
    </MapContainer>
  );
}

