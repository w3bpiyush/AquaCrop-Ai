"use client";
import { createContext, useContext, useState } from "react";

const DrawContext = createContext();

export const useDraw = () => useContext(DrawContext);

export const DrawProvider = ({ children }) => {
  const [center, setCenter] = useState([36.7783, -119.4179]); // Default: California
  const [map, setMap] = useState(null);
  const [triggerDraw, setTriggerDraw] = useState(false);
  const [polygonData, setPolygonData] = useState(null); // { latlngs, area, center }

  return (
    <DrawContext.Provider
      value={{
        center,
        setCenter,
        map,
        setMap,
        triggerDraw,
        setTriggerDraw,
        polygonData,
        setPolygonData,
      }}
    >
      {children}
    </DrawContext.Provider>
  );
};
