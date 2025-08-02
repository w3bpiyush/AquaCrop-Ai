const { cropData } = require("../constant/croptable");
const { addTimeToStartTime, roundToNearestQuarter } = require("../utils/waterUtils");

// Fetch precipitation data from Open-Meteo API
const fetchPrecipitationData = async (lat, long, start_date, end_date) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&start_date=${start_date}&end_date=${end_date}&daily=precipitation_sum&timezone=auto`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Weather API request failed");

  const data = await response.json();
  const { precipitation_sum: precipitation, time: dates } = data.daily || {};

  if (!precipitation || !dates) throw new Error("Invalid precipitation data from weather API");

  return { precipitation, dates };
};

// Fetch ET data from OpenET API
const fetchETData = async (start_date, end_date, coords) => {
  const geometry = coords.flatMap(({ lng, lat }) => [lng, lat]);

  const payload = {
    date_range: [start_date, end_date],
    geometry,
    file_format: "JSON",
    interval: "daily",
    model: "SSEBop",
    reducer: "mean",
    reference_et: "gridMET",
    units: "mm",
    variable: "ET"
  };

  const response = await fetch("https://openet-api.org/raster/timeseries/polygon", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": process.env.OPENET_APIKEY
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error("OpenET API request failed");

  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Unexpected response from OpenET API");

  return data.map(item => item.ET ?? item.et ?? null);
};

// Calculate daily water requirement (litres)
const calculateWaterRequirements = (etValues, precipitation, kc, area) =>
  etValues.map((et, i) => Math.max(0, Math.ceil(((et * kc) - precipitation[i]) * area)));

// Calculate irrigation end times based on flow rate
const calculateEndTimes = (requirements, flowRate) => {
  const flowRateLPH = flowRate * 60 * 3.78541;
  return requirements.map(req => addTimeToStartTime(roundToNearestQuarter(req / flowRateLPH)));
};

// Controller to generate irrigation plan
const getIrrigationPlan = async (req, res) => {
  try {
    const {
      lat, long, start_date, end_date,
      coords, cropType, growthStage, area, flowRate
    } = req.body;

    if (!lat || !long || !start_date || !end_date ||
        !Array.isArray(coords) || coords.length < 3 ||
        !cropType || !growthStage || !area || !flowRate) {
      return res.status(400).json({
        error: "Missing or invalid required fields"
      });
    }

    const kc = cropData[cropType]?.[growthStage];
    if (!kc) {
      console.log(`Available growth stages for ${cropType}:`, Object.keys(cropData[cropType] || {}));
      return res.status(400).json({ error: "Invalid cropType or growthStage" });
    }

    const [precipData, etValues] = await Promise.all([
      fetchPrecipitationData(lat, long, start_date, end_date),
      fetchETData(start_date, end_date, coords)
    ]);

    const { precipitation, dates } = precipData;

    if ([etValues, precipitation, dates].some(arr => arr.length !== 7)) {
      return res.status(400).json({ error: "Data must contain exactly 7 days" });
    }

    const waterRequirement = calculateWaterRequirements(etValues, precipitation, kc, area);
    const endTimes = calculateEndTimes(waterRequirement, flowRate);

    const plan = dates.map((date, i) => ({
      waterRequirement: waterRequirement[i],
      endtime: endTimes[i],
      date
    }));

    return res.json(plan);
  } catch (error) {
    console.error("Irrigation Plan Error:", error);
    return res.status(500).json({ error: "Failed to generate irrigation plan" });
  }
};

module.exports = { getIrrigationPlan };
