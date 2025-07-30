"use client";
import dynamic from "next/dynamic";
import { DrawProvider, useDraw } from "../context/DrawContext";
import { useState } from "react";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const DrawButton = () => {
  const { setEnabled } = useDraw();

  return (
    <button
      onClick={() => setEnabled((prev) => !prev)}
      className="bg-green-600 text-white px-5 py-2 rounded-md shadow hover:bg-green-700 transition"
    >
      Set Crop Info
    </button>
  );
};

const GetFarmButton = () => {
  const { setCenter } = useDraw(); 
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState({ lat: "", lng: "" });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(inputs.lat);
    const lng = parseFloat(inputs.lng);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid numeric coordinates.");
      return;
    }

    setCenter([lat, lng]);
    setShowModal(false);
    setInputs({ lat: "", lng: "" });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-5 py-2 rounded-md shadow hover:bg-green-700 transition"
      >
        Set Farm Location
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1100]">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-full p-6 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Set Farm Location</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="lat"
                value={inputs.lat}
                onChange={handleChange}
                required
                placeholder="Enter Latitude"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <input
                type="text"
                name="lng"
                value={inputs.lng}
                onChange={handleChange}
                required
                placeholder="Enter Longitude"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default function HomePage() {
  return (
    <DrawProvider>
      <main className="relative min-h-screen">
        <Map />
        <div className="fixed bottom-4 left-4 z-[1000] flex space-x-4">
          <DrawButton />
          <GetFarmButton />
        </div>
      </main>
    </DrawProvider>
  );
}
