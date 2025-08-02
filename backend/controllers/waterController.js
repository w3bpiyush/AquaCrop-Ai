const getPrecipitation = async (req, res) => {
  try {
    const { lat, long, start_date, end_date } = req.query;

    if (!lat || !long || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required query parameters: lat, long, start_date, end_date' });
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&start_date=${start_date}&end_date=${end_date}&daily=precipitation_sum&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.daily || !data.daily.precipitation_sum) {
      return res.status(500).json({ error: 'Invalid data from weather API' });
    }

    res.json({
      location: { lat, long },
      start_date,
      end_date,
      dates: data.daily.time,
      precipitation: data.daily.precipitation_sum,
    });
  } catch (error) {
    console.error('Error fetching precipitation:', error);
    res.status(500).json({ error: 'Failed to fetch precipitation data' });
  }
};
module.exports = { getPrecipitation };