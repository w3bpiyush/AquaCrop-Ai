"use client";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { DrawProvider, useDraw } from "../context/DrawContext";
import { getDateRangeLast7Days } from "../utils/areaFunctions";
import { Droplet } from "lucide-react";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const useModal = () => {
  const [isVisible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return { isVisible, open, close };
};

const DrawFarmButton = () => {
  const { setTriggerDraw, setCropInputs } = useDraw();
  const modal = useModal();
  const [inputs, setInputs] = useState({
    cropType: "",
    growthStage: "",
    irrigationType: "",
    waterFlow: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setInputs(prev => ({ ...prev, [name]: value }));
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

    modal.close();
    setTriggerDraw(true);
    setCropInputs({ cropType, growthStage, irrigationType, waterFlow: flow });

    console.log("Crop Info Submitted:", {
      cropType,
      growthStage,
      irrigationType,
      waterFlow: flow,
    });

    setInputs({ cropType: "", growthStage: "", irrigationType: "", waterFlow: "" });
  };

  return (
    <>
      <button
        onClick={modal.open}
        className="bg-green-600 text-white px-5 py-2 rounded-md shadow hover:bg-green-700 transition"
      >
        Set Crop Info
      </button>

      {modal.isVisible && (
        <Modal title="Set Crop Information" onClose={modal.close}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select name="cropType" value={inputs.cropType} onChange={handleChange} label="Crop Type" options={["wheat", "barley", "maize", "millet", "sorghum", "rice", "beansgreen"]} />
            <Select name="growthStage" value={inputs.growthStage} onChange={handleChange} label="Growth Stage" options={["Seedling", "Adult", "Elderly"]} />
            <Select name="irrigationType" value={inputs.irrigationType} onChange={handleChange} label="Irrigation Type" options={["Surface", "Sprinkler", "Drip", "Subsurface"]} />
            <input
              type="number"
              name="waterFlow"
              value={inputs.waterFlow}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
              placeholder="Water Flow (gallons/minute)"
              className="input"
            />
            <button type="submit" className="btn-primary">Draw Farm Area</button>
          </form>
        </Modal>
      )}
    </>
  );
};

const GetFarmButton = () => {
  const { setCenter } = useDraw();
  const modal = useModal();
  const [inputs, setInputs] = useState({ lat: "", lng: "" });

  const handleChange = ({ target: { name, value } }) => {
    setInputs(prev => ({ ...prev, [name]: value }));
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
    modal.close();
    setInputs({ lat: "", lng: "" });
  };

  return (
    <>
      <button onClick={modal.open} className="btn-primary">Set Farm Location</button>

      {modal.isVisible && (
        <Modal title="Set Farm Location" onClose={modal.close}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="lat"
              value={inputs.lat}
              onChange={handleChange}
              required
              placeholder="Enter Latitude"
              className="input"
            />
            <input
              type="text"
              name="lng"
              value={inputs.lng}
              onChange={handleChange}
              required
              placeholder="Enter Longitude"
              className="input"
            />
            <button type="submit" className="btn-primary">Confirm</button>
          </form>
        </Modal>
      )}
    </>
  );
};

const GetWaterUsagesButton = () => {
  const { cropInputs, polygonData, setPolygonData, setCropInputs } = useDraw();
  const modal = useModal();
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const requestBody = useMemo(() => {
    if (!cropInputs || !polygonData) return null;
    const { startDate, endDate } = getDateRangeLast7Days();

    return {
      lat: polygonData.center.lat,
      long: polygonData.center.lng,
      start_date: startDate,
      end_date: endDate,
      coords: polygonData.latlngs.map(({ lat, lng }) => ({ lat, lng })),
      cropType: cropInputs.cropType,
      growthStage: cropInputs.growthStage,
      area: polygonData.area,
      flowRate: parseFloat(cropInputs.waterFlow),
    };
  }, [cropInputs, polygonData]);

  const handleFetch = async () => {
    if (!requestBody) {
      alert("Please fill in crop info and draw a polygon first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResponseData(null);

      const res = await fetch("http://localhost:3001/api/water/getIrrigationPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

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
    modal.open();
    handleFetch();
  };

  return (
    <>
      <button onClick={openModal} className="btn-primary">Get Water Usages</button>

      {modal.isVisible && (
        <Modal title="Water Usage Forecast" onClose={modal.close} wide scroll>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-2/3 mx-auto h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-pulse w-full" />
              </div>
              <p className="text-sm text-gray-500 mt-4">Fetching water usage data...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : responseData?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {responseData.map((entry, index) => (
                <div key={index} className="rounded-xl px-5 py-4 shadow-md bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Droplet className="text-green-600 w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{entry.date}</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p className="mb-1"><span className="font-medium">Water:</span> {entry.waterRequirement} L</p>
                    <p><span className="font-medium">End Time:</span> {entry.endtime}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No data available.</p>
          )}
        </Modal>
      )}
    </>
  );
};

const AskAiButton = () => {
  const modal = useModal();
  return (
    <>
      <button onClick={modal.open} className="btn-primary">SprinklAI 🌱</button>
      {/* Future AI modal here */}
    </>
  );
};

// Modal, Select, Input and Button styles
const Modal = ({ title, onClose, children, wide, scroll }) => (
  <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-[1100]">
    <div className={`bg-white rounded-lg shadow-xl ${wide ? "w-[170vw] max-w-6xl" : "w-96"} p-6 mx-4 ${scroll ? "max-h-[100vh] overflow-y-auto" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>
      {children}
    </div>
  </div>
);

const Select = ({ name, value, onChange, label, options }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    required
    className="input"
  >
    <option value="">{`Select ${label}`}</option>
    {options.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

export default function HomePage() {
  return (
    <DrawProvider>
      <main className="relative w-full h-full">
        <Map />
        <div className="fixed bottom-4 left-4 z-[1000] flex flex-wrap gap-4">
          <DrawFarmButton />
          <GetFarmButton />
          <GetWaterUsagesButton />
          <AskAiButton />
        </div>
      </main>
    </DrawProvider>
  );
}
