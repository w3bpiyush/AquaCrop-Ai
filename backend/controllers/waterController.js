const cropTable = "../constant/croptable";

const getPrecipitation = async (req, res) => {
  try {
    const { lat, long, start_date, end_date } = req.query;

    if (!lat || !long || !start_date || !end_date) {
      return res.status(400).json({
        error: "Missing required query parameters: lat, long, start_date, end_date"
      });
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&start_date=${start_date}&end_date=${end_date}&daily=precipitation_sum&timezone=auto`;

    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(500).json({ error: "Weather API request failed" });
    }

    const data = await response.json();

    if (!data.daily?.precipitation_sum || !data.daily?.time) {
      return res.status(500).json({ error: "Invalid data from weather API" });
    }

    return res.json({
      location: { lat: parseFloat(lat), long: parseFloat(long) },
      start_date,
      end_date,
      dates: data.daily.time,
      precipitation: data.daily.precipitation_sum
    });

  } catch (error) {
    console.error("Error fetching precipitation:", error.message);
    return res.status(500).json({ error: "Failed to fetch precipitation data" });
  }
};

const getETData = async (req, res) => {
  try {
    const { start_date, end_date, coords } = req.body;

    if (!start_date || !end_date || !Array.isArray(coords) || coords.length < 3) {
      return res.status(400).json({
        error: "start_date, end_date, and at least 3 coordinates are required"
      });
    }

    // Convert coordinates to flat array format efficiently
    const geometry = [];
    for (const coord of coords) {
      geometry.push(coord.lng, coord.lat);
    }

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

    if (!response.ok) {
      return res.status(500).json({ error: "OpenET API request failed" });
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return res.status(500).json({ error: "Unexpected response from OpenET API" });
    }

    // Extract ET values efficiently
    const et_values = data.map(item => item.ET ?? item.et ?? null);

    return res.json({
      start_date,
      end_date,
      et_values
    });

  } catch (error) {
    console.error("Error fetching ET data:", error.message);
    return res.status(500).json({ error: "Failed to fetch ET data" });
  }
};

const getWaterRequirement = (req, res) => {
   try {
      
   } catch (error) {
      return res.status(500).json({ error: "Failed to calculate water requirement" });
   }
}  

module.exports = { getPrecipitation, getETData };