"use client";
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useDraw } from "../context/DrawContext";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useEffect } from "react";

const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);

  return null;
};

export default function Map() {
  const { enabled, setEnabled, center } = useDraw();

  const extractCoordinates = (layer) => {
    const latlngs = layer.getLatLngs();
    const ring = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
    return ring.map(({ lat, lng }) => ({ lat, lng }));
  };

  const handleCreated = (e) => {
    const coords = extractCoordinates(e.layer);
    console.log("Created:", coords);
    setEnabled(false);
  };

  const handleEdited = (e) => {
    const allCoords = [];
    e.layers.eachLayer((layer) => {
      const coords = extractCoordinates(layer);
      allCoords.push(coords);
    });
    console.log("Edited:", allCoords);
  };

  const handleDeleted = (e) => {
    const allCoords = [];
    e.layers.eachLayer((layer) => {
      const coords = extractCoordinates(layer);
      allCoords.push(coords);
    });
    console.log("Deleted:", allCoords);
  };

  return (
    <MapContainer center={center} zoom={18} className="h-screen w-full z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapUpdater center={center} />
      <FeatureGroup>
        <EditControl
          position="topright"
          draw={{
            polygon: enabled,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
            polyline: false,
          }}
          edit={{ edit: true, remove: true }}
          onCreated={handleCreated}
          onEdited={handleEdited}
          onDeleted={handleDeleted}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
