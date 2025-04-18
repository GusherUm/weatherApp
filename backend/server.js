const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 7000;

app.use(cors());

const apiKey = process.env.OPENWEATHER_API_KEY;

// Weather route
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: city,
        units: 'metric',
        appid: apiKey
      }
    });

    const weatherData = {
      city: response.data.name,
      temperature: response.data.main.temp,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    };

    res.json(weatherData);
  } catch (error) {
    res.status(404).json({ error: 'City not found' });
  }
});

// Suggestions route
app.get('/api/suggest', async (req, res) => {
  const query = req.query.q;

  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Suggestion fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

app.listen(PORT, () => {
  console.log(`Weather backend running at http://localhost:${PORT}`);
});