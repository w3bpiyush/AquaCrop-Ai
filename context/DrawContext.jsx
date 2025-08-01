"use client";
import { createContext, useContext, useState } from "react";

const DrawContext = createContext();

export const useDraw = () => useContext(DrawContext);

export const DrawProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  const [center, setCenter] = useState([36.7783, -119.4179]); 

  return (
    <DrawContext.Provider value={{ enabled, setEnabled, center, setCenter }}>
      {children}
    </DrawContext.Provider>
  );
};
