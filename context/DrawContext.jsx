"use client";
import { createContext, useContext, useState } from "react";

const DrawContext = createContext();

export const useDraw = () => useContext(DrawContext);

export const DrawProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  const [center, setCenter] = useState([26.6685, 87.2776]); 

  return (
    <DrawContext.Provider value={{ enabled, setEnabled, center, setCenter }}>
      {children}
    </DrawContext.Provider>
  );
};
