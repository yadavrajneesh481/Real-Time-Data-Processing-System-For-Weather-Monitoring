// routes.js
const express = require('express');
const { fetchWeatherFromAPI } = require('./weatherController');
const cors = require('cors');
const axios = require('axios');

// Create a new router instance
const router = express.Router();
router.use(cors());

// Route to get weather data from API
router.get('/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const weatherData = await fetchWeatherFromAPI(city);
        res.json(weatherData.current); // Only send current weather data
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({
            error: 'Failed to fetch weather data',
            message: error.message
        });
    }
});

// Route to get 7-day forecast for a city
router.get('/:city/forecast', async (req, res) => {
    try {
        const city = req.params.city;
        const weatherData = await fetchWeatherFromAPI(city);
        res.json(weatherData); // Send both current and daily forecast
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({
            error: 'Failed to fetch weather data',
            message: error.message
        });
    }
});

// Export the router object for use in other parts of the application
module.exports = router;



