# 🪴 AquaCrop – Smart Irrigation Planner for Farmers

**AquaCrop** is an open-source solution designed to help farmers optimize water usage and improve crop health through data-driven irrigation scheduling. Leveraging NASA’s OpenET evapotranspiration data, AquaCrop AI maps farmland, considers crop and irrigation details, and delivers personalized 7-day water schedules.

> 💡 Built using NASA OpenET, Open-Meteo, and satellite-based analytics.

---

## 🚀 Features

- 🌦 **Weather & Rain Forecast Integration**
- 🌱 **Evapotranspiration (ET) Estimates via OpenET**
- 💧 **Daily Water Requirement Calculation**
- 🗺 **Supports Field Polygon Mapping via Web UI**
- 📆 **7-Day Smart Irrigation Schedule Generation**
- 📉 **Efficient Water Use & Cost Reduction**

---

## 📷 Screenshot of ET Data Visualization

Below is a sample evapotranspiration (ET) data visualization used in AquaCrop:

![ET Data Visualization](https://i.imgur.com/gpmFg9m.gif)


> ☝️ *ET (Evapotranspiration) refers to the total water lost through soil evaporation and plant transpiration.*

---

## 📖 Key Terms Explained

| Term              | Description |
|------------------|-------------|
| **Evapotranspiration (ET)** | The sum of water loss from the soil surface (evaporation) and from the crop (transpiration). Measured in mm/day. |
| **Crop Coefficient (Kc)** | A crop-specific factor used to estimate crop water needs at different growth stages by multiplying it with ET. |
| **ET<sub>c</sub>**          | Crop evapotranspiration = ET × Kc |
| **Flow Rate**     | The speed at which water flows from the irrigation system (e.g., gallons per minute). |
| **OpenET**        | A NASA-backed platform that provides satellite-based ET data across the U.S. and other regions. |
| **Precipitation** | Rainfall data that helps reduce irrigation needs when sufficient. |
| **Irrigation Plan** | The daily volume and timing of water required for the crop to thrive. |

---

## 🧮 How It Works

1. **Input**
   - Latitude, Longitude
   - Field Coordinates
   - Crop Type and Growth Stage
   - Area in Square Meters
   - Flow Rate (GPM)

2. **Data Sources**
   - Rainfall Forecast: [Open-Meteo API](https://open-meteo.com)
   - ET Data: [NASA OpenET API](https://openetdata.org)
   - Crop Coefficients: Based on FAO data, stored locally

3. **Computation**
   - ET<sub>c</sub> = ET × Kc
   - Daily water need = (ET<sub>c</sub> − precipitation) × area
   - Converted to liters and divided by flow rate to compute irrigation duration

4. **Output**
   - Water Required (Liters)
   - Suggested End Time for Irrigation
   - 7-Day Forecasted Plan

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Data APIs:** Open-Meteo, OpenET
- **Frontend:** React (or Next.js), Leaflet for mapping
- **Deployment:** Vercel

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/AquaCrop.git
cd AquaCrop
npm install
```

Set your environment variables:

```env
OPENET_APIKEY=your_openet_api_key
```

Then run the server:

```bash
npm start
```


## 🧠 Ideas for Future Enhancements

- 🤖 AI Assistant for Crop Advisory
- 🌍 Soil Moisture Integration (SMAP/Sentinel-1)
- 🔔 Smart Alerts (Rain warnings, heat stress, drought)
- 🧬 Personalized Irrigation using ML models
- 🧑‍🌾 Farmer Community Data Dashboard

---

## 📄 License

MIT License. See `LICENSE` file.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## 👨‍💻 Maintainer

**Piyush Manna**  
