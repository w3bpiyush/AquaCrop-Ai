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

  const handleCreated = (e) => {
    const latlngs = e.layer.getLatLngs();
    console.log("Created:", latlngs);
    setEnabled(false);
  };

  const handleEdited = (e) => {
    const latlngs = e.layer.getLatLngs();
    console.log("Edited:", latlngs);
    setEnabled(false);
  };

  const handleDeleted = (e) => {
    const latlngs = e.layer.getLatLngs();
    console.log("Deleted:", latlngs);
    setEnabled(false);
  };

  return (
    <MapContainer center={center} zoom={13} className="h-screen w-full z-0">
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