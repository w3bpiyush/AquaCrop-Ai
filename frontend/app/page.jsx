"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { DrawProvider, useDraw } from "../context/DrawContext";
import { getDateRangeLast7Days } from "../utils/areaFunctions";
import { Droplet } from "lucide-react";

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

  const { setCropInputs } = useDraw();

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

    console.log("Crop Info Submitted:", {
      cropType,
      growthStage,
      irrigationType,
      waterFlow: flow,
    });

    setCropInputs({ cropType, growthStage, irrigationType, waterFlow: flow });

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
              <h2 className="text-lg font-semibold text-gray-800">
                Set Crop Information
              </h2>
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
                <option value="wheat">Wheat</option>
                <option value="barley">Barley</option>
                <option value="maize">Maize</option>
                <option value="millet">Millet</option>
                <option value="sorghum">Sorghum</option>
                <option value="rice">Rice</option>
                <option value="beansgreen">Beans Green</option>
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
              <h2 className="text-lg font-semibold text-gray-800">
                Set Farm Location
              </h2>
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
  const { cropInputs, polygonData } = useDraw();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const { setPolygonData, setCropInputs } = useDraw();

  const handleFetch = async () => {
    if (!polygonData || !cropInputs) {
      alert("Please fill in crop info and draw a polygon first.");
      return;
    }

    const { cropType, growthStage, irrigationType, waterFlow } = cropInputs;
    const { area, center, latlngs } = polygonData;
    const { startDate, endDate } = getDateRangeLast7Days();

    const body = {
      lat: center.lat,
      long: center.lng,
      start_date: startDate,
      end_date: endDate,
      coords: latlngs.map(({ lat, lng }) => ({ lat, lng })),
      cropType,
      growthStage,
      area,
      flowRate: parseFloat(waterFlow),
    };

    try {
      setLoading(true);
      setError(null);
      setResponseData(null);

      const res = await fetch(
        "http://localhost:3001/api/water/getIrrigationPlan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch water usage.");
      const data = await res.json();
      setResponseData(data);
      setPolygonData(null);
      setCropInputs(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
    handleFetch();
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-green-600 text-white px-5 py-2 rounded-md shadow hover:bg-green-700 transition"
      >
        Get Water Usages
      </button>

      {showModal && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-[1100]">
          <div className="bg-white rounded-lg shadow-xl w-[170vw] max-w-6xl p-6 mx-4 max-h-[100vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Water Usage Forecast
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-2/3 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 animate-pulse w-full"></div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Fetching water usage data...
                </p>
              </div>
            ) : error ? (
              <div className="text-red-600 text-sm">{error}</div>
            ) : responseData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {responseData.map((entry, index) => (
                  <div
                    key={index}
                    className="rounded-xl px-5 py-4 shadow-md bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Droplet className="text-green-600 w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {entry.date}
                      </p>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="mb-1">
                        <span className="font-medium">Water:</span>{" "}
                        {entry.waterRequirement} L
                      </p>
                      <p>
                        <span className="font-medium">End Time:</span>{" "}
                        {entry.endtime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No data available.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

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
};

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
