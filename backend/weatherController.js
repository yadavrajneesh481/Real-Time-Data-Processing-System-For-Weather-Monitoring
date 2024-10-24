const axios = require('axios');
const WeatherSummary = require('./weatherModel');

const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const API_KEY = '43e401bc4bd69a8d0182c720e1306440';  // Replace with your actual API key

// Function to save weather data received from frontend to MongoDB
const fetchAndSaveWeatherData = async (req, res) => {
  try {
    const weatherData = req.body;  // Data received from frontend

    const summary = new WeatherSummary({
      date: new Date(),  // Use full date and time
      avg_temperature: weatherData.avgTemp,
      max_temperature: weatherData.maxTemp,
      min_temperature: weatherData.minTemp,
      dominant_condition: weatherData.condition,
      reason_for_condition: `Dominant condition is ${weatherData.condition} based on frontend data`,
      raw_data_count: 1,
      all_api_data: weatherData  // Optionally save all data
    });

    const savedSummary = await summary.save();
    console.log('Weather summary saved:', savedSummary);
    // res.status(201).json({ message: 'Weather summary saved successfully', summary: savedSummary });
  } catch (error) {
    console.error('Error saving weather data:', error);
    // res.status(500).json({ error: 'Failed to save weather data', details: error.message });
  }
};

const fetchWeatherFromAPI = async (city) => {
  try {
    // Get coordinates for the city
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    const geoResponse = await axios.get(geoUrl);
    
    if (!geoResponse.data || geoResponse.data.length === 0) {
      throw new Error('City not found');
    }
    
    const { lat, lon } = geoResponse.data[0];
    
    // Get current weather
    const currentWeatherUrl = `${CURRENT_WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const currentWeatherResponse = await axios.get(currentWeatherUrl);
    
    // Get 5-day forecast (since OneCall API might not be available in free tier)
    const forecastUrl = `${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const forecastResponse = await axios.get(forecastUrl);
    
    // Process forecast data to get daily data
    const dailyData = processForecastData(forecastResponse.data.list);
    
    // Save the fetched data to the database
    await saveWeatherDataToDB({
      avgTemp: currentWeatherResponse.data.main.temp,
      maxTemp: currentWeatherResponse.data.main.temp_max,
      minTemp: currentWeatherResponse.data.main.temp_min,
      condition: currentWeatherResponse.data.weather[0].main,
      // Add any other necessary fields
    }, city); // Pass the city name

    return {
      current: currentWeatherResponse.data,
      daily: dailyData
    };
  } catch (error) {
    console.error('Error in fetchWeatherFromAPI:', error);
    throw error;
  }
};

// Helper function to process forecast data
const processForecastData = (forecastList) => {
    const dailyData = [];
    const dailyMap = new Map();

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyMap.has(date)) {
            dailyMap.set(date, {
                dt: item.dt,
                temp: {
                    day: item.main.temp,
                    min: item.main.temp_min,
                    max: item.main.temp_max
                },
                weather: item.weather
            });
        }
    });

    dailyMap.forEach(value => {
        dailyData.push(value);
    });

    return dailyData.slice(0, 7);
};

const saveWeatherDataToDB = async (weatherData, city) => {
  try {
    // Use full date and time for uniqueness
    const currentDate = new Date();

    // Check if a document with the same date and city already exists
    const existingSummary = await WeatherSummary.findOne({ date: currentDate, city });

    if (existingSummary) {
      // Update the existing document
      existingSummary.avg_temperature = weatherData.avgTemp;
      existingSummary.max_temperature = weatherData.maxTemp;
      existingSummary.min_temperature = weatherData.minTemp;
      existingSummary.dominant_condition = weatherData.condition;
      existingSummary.reason_for_condition = `Dominant condition is ${weatherData.condition} based on API data`;
      existingSummary.raw_data_count += 1; // Increment the count
      existingSummary.all_api_data = weatherData; // Optionally update all data

      const updatedSummary = await existingSummary.save();
      console.log('Weather data updated in DB:', updatedSummary);
    } else {
      // Insert a new document
      const summary = new WeatherSummary({
        date: currentDate,
        avg_temperature: weatherData.avgTemp,
        max_temperature: weatherData.maxTemp,
        min_temperature: weatherData.minTemp,
        dominant_condition: weatherData.condition,
        reason_for_condition: `Dominant condition is ${weatherData.condition} based on API data`,
        raw_data_count: 1,
        all_api_data: weatherData, // Optionally save all data
        city: city // Add the city field
      });

      const savedSummary = await summary.save();
      console.log('Weather data saved to DB');
    }
  } catch (error) {
    console.error('Error saving weather data to DB');
  }
};

module.exports = { fetchAndSaveWeatherData, fetchWeatherFromAPI, saveWeatherDataToDB };
