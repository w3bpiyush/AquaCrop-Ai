"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { DrawProvider, useDraw } from "../context/DrawContext";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const DrawFarmButton = () => {
  const { setTriggerDraw } = useDraw();
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState({
    cropType: "",
    growthStage: "",
    irrigationType: "",
    waterFlow: "",
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { cropType, growthStage, irrigationType, waterFlow } = inputs;

    if (!cropType || !growthStage || !irrigationType || !waterFlow) {
      alert("Please fill in all fields.");
      return;
    }

    const flow = parseFloat(waterFlow);
    if (isNaN(flow) || flow <= 0) {
      alert("Enter a valid water flow rate.");
      return;
    }

    setShowModal(false);
    setTriggerDraw(true); 

    console.log("Crop Info:", { cropType, growthStage, irrigationType, waterFlow: flow });

    setInputs({
      cropType: "",
      growthStage: "",
      irrigationType: "",
      waterFlow: "",
    });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 text-white px-5 py-2 rounded-md shadow hover:bg-green-700 transition"
      >
        Set Crop Info
      </button>

      {showModal && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-[1100]">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-full p-6 mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Set Crop Information</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="cropType"
                value={inputs.cropType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select Crop Type</option>
                <option value="Alfalfa">Alfalfa</option>
                <option value="Onions">Onions</option>
                <option value="Apples">Apples</option>
                <option value="Pasture">Pasture</option>
                <option value="Apricots">Apricots</option>
                <option value="Peaches">Peaches</option>
                <option value="BeansGreen">Beans Green</option>
              </select>

              <select
                name="growthStage"
                value={inputs.growthStage}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select Growth Stage</option>
                <option value="Seedling">Seedling</option>
                <option value="Adult">Adult</option>
                <option value="Elderly">Elderly</option>
              </select>

              <select
                name="irrigationType"
                value={inputs.irrigationType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="">Select Irrigation Type</option>
                <option value="Surface">Surface</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Drip">Drip</option>
                <option value="Subsurface">Subsurface</option>
              </select>

              <input
                type="number"
                name="waterFlow"
                value={inputs.waterFlow}
                onChange={handleChange}
                required
                min="0"
                step="0.1"
                placeholder="Water Flow (gallons/minute)"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
              >
                Draw Farm Area
              </button>
            </form>
          </div>
        </div>
      )}
    </>
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
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-[1100]">
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

const GetWaterUsagesButton = () => {

  const [showWaterModel, setWaterShowModal] = useState(false);

    return (
    <>
      <button
        onClick={() => setWaterShowModal(true)}
        className="bg-green-600 text-white px-5 py-2 rounded-md shadow hover:bg-green-700 transition"
      >
        Get Water Usages
      </button>
    </>
  );    
}

const AskAiButton = () => {

  const [showAiModal, setAiShowModal] = useState(false);

    return (
    <>
      <button
        onClick={() => setAiShowModal(true)}
        className="bg-green-600 text-white px-5 py-2 rounded-md shadow hover:bg-green-700 transition"
      >
        SprinklAI 🌱
      </button>
    </>
  );    
}

export default function HomePage() {
  return (
    <DrawProvider>
        <main className="relative w-full h-full">
          <Map />
          <div className="fixed bottom-4 left-4 z-[1000] flex space-x-4">
            <DrawFarmButton />
            <GetFarmButton />
            <GetWaterUsagesButton />
            <AskAiButton />
          </div>
        </main>
    </DrawProvider>
  );
}
