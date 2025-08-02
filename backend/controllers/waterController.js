const { cropData } = require("../constant/croptable");
const { addTimeToStartTime, roundToNearestQuarter } = require("../utils/waterUtils");

const fetchWeatherData = async (lat, long, start_date, end_date) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&start_date=${start_date}&end_date=${end_date}&daily=precipitation_sum,et0_fao_evapotranspiration&timezone=auto`;
  const response = await fetch(url);

  if (!response.ok) throw new Error("Weather API request failed");

  const data = await response.json();
  const { precipitation_sum: precipitation, et0_fao_evapotranspiration: et0, time: dates } = data.daily || {};

  if (!precipitation || !et0 || !dates) throw new Error("Incomplete weather data from API");



  return { precipitation, et0, dates };
};

// Calculate water in litres (1 mm over 1 m² = 1 L)
const calculateWaterRequirements = (et0List, precipitationList, kc, area) => {
  return et0List.map((et0, i) => {
    const etc = et0 * kc;
    const netEtc = Math.max(0, etc - precipitationList[i]);
    const litres = netEtc * area; // ✅ Already in litres
    return Math.ceil(litres);
  });
};

const calculateEndTimes = (requirements, flowRate) => {
  const flowRateLPH = flowRate * 60 * 3.78541; // gal/min → LPH
  return requirements.map(req => {
    const hours = req / flowRateLPH;
    const rounded = roundToNearestQuarter(hours);
    return addTimeToStartTime(rounded);
  });
};

const getIrrigationPlan = async (req, res) => {
  try {
    const {
      lat, long, start_date, end_date,
      coords, cropType, growthStage, area, flowRate
    } = req.body;

    if (!lat || !long || !start_date || !end_date ||
        !Array.isArray(coords) || coords.length < 3 ||
        !cropType || !growthStage || !area || !flowRate) {
      return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    const kc = cropData[cropType]?.[growthStage];
    if (!kc) {
      console.log(`❌ Invalid cropType or growthStage`, cropType, growthStage);
      return res.status(400).json({ error: "Invalid cropType or growthStage" });
    }

    const { precipitation, et0, dates } = await fetchWeatherData(lat, long, start_date, end_date);

    if (et0.length !== 7 || precipitation.length !== 7 || dates.length !== 7) {
      return res.status(400).json({ error: "Data must contain exactly 7 days" });
    }

    const requirements = calculateWaterRequirements(et0, precipitation, kc, area);
    const endTimes = calculateEndTimes(requirements, flowRate);

    const plan = dates.map((date, i) => ({
      date,
      waterRequirement: requirements[i], // in litres
      endtime: endTimes[i]
    }));

    return res.json(plan);
  } catch (error) {
    console.error("❗Irrigation Plan Error:", error);
    return res.status(500).json({ error: "Failed to generate irrigation plan" });
  }
};

module.exports = { getIrrigationPlan };
