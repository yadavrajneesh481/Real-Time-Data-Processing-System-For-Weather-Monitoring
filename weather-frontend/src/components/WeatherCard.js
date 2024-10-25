// WeatherCard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './WeatherCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThermometerHalf, 
  faTemperatureLow, 
  faTemperatureHigh, 
  faWind, 
  faTint, 
  faCloud, 
  faSun, 
  faCloudRain, 
  faSnowflake, 
  faSmog, 
  faPooStorm 
} from '@fortawesome/free-solid-svg-icons';

import { processWeatherData as processWeather } from '../utils/processWeatherData';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);


const WeatherCard = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [thresholds, setThresholds] = useState({
    temperature: 35, // Temperature threshold in Celsius
    condition: 'Rain' // Specific weather condition to alert on
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [heatmapData, setHeatmapData] = useState([]);
  const [conditionData, setConditionData] = useState({
    labels: ['Rainy', 'Sunny', 'Cloudy', 'Snowy', 'Foggy'],
    datasets: [{
      data: [10, 15, 7, 5, 3],
      backgroundColor: ['#4D4DFF', '#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4D4DFF', '#FFCE56', '#E7E9ED']
    }]
  });



  const loadWeatherData = async () => {
    try {
        const url = `http://localhost:5000/api/${city}/forecast`;
        const response = await axios.get(url);
        
        if (!response.data || !response.data.daily) {
            throw new Error('Invalid response format from weather API');
        }

        const processedData = processWeather(response.data.daily);
        setWeatherData(processedData);
        setForecastData(processedData);

        // Set current weather data
        if (response.data.current) {
            const maxTemp = Math.round(response.data.current.main.temp_max);
            const minTemp = Math.round(response.data.current.main.temp_min);
            const avgTemp = Math.round((maxTemp + minTemp) / 2);

            setCurrentWeather({
                temp: Math.round(response.data.current.main.temp),
                maxTemp: maxTemp,
                minTemp: minTemp,
                avgTemp: avgTemp,
                condition: response.data.current.weather[0].main,
                humidity: response.data.current.main.humidity,
                windSpeed: Number(response.data.current.wind.speed.toFixed(1))
            });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(`Failed to fetch weather data for ${city}: ${error.message}`);
    }
};

  
  const loadCurrentWeather = async () => {
    try {
      const url = `http://localhost:5000/api/${city}`;
      const response = await axios.get(url);
      console.log('Weather API Response:', response.data);

      const maxTemp = Math.round(response.data.main.temp_max);
      const minTemp = Math.round(response.data.main.temp_min);
      const avgTemp = Math.round((maxTemp + minTemp) / 2);

      setCurrentWeather({
        temp: Math.round(response.data.main.temp),
        maxTemp: maxTemp,
        minTemp: minTemp,
        avgTemp: avgTemp,
        condition: response.data.weather[0].main,
        humidity: Math.round(response.data.main.humidity),
        windSpeed: Number(response.data.wind.speed.toFixed(1))
      });

    } catch (error) {
      console.error('Error fetching current weather:', error);
      setError(error.message);
    }
  };

  const checkThresholds = (weather) => {
    let newAlerts = [];
    // Check temperature threshold
    if (weather.temp >= thresholds.temperature) {
      newAlerts.push(`Temperature alert: ${weather.temp}°C exceeds the threshold of ${thresholds.temperature}°C.`);
    }
    // Check condition threshold
    if (weather.condition === thresholds.condition) {
      newAlerts.push(`Weather condition alert: Current condition is ${weather.condition}.`);
    }
    return newAlerts;
  };

  useEffect(() => {
    loadCurrentWeather();
    loadWeatherData(); // Load forecast data
  }, [city]); // This useEffect now depends only on city

  useEffect(() => {
    if (currentWeather) {
      const message = `Current temperature in ${city} is ${currentWeather.temp}°C`;
      if (currentWeather.temp > 35) {
        setAlertMessage( " Danger! High temperature exceeding 35°C.");
      } else {
        setAlertMessage(message);
      }
      setShowAlert(true);
    }
  }, [currentWeather]); // This new useEffect depends only on currentWeather

  // Simulate fetching data
  useEffect(() => {
    const data = new Array(7).fill(0).map(() => new Array(35).fill(0).map(() => Math.floor(Math.random() * 100)));
    setHeatmapData(data);
  }, []);

  useEffect(() => {
    if (currentWeather) {
      const newAlerts = checkThresholds(currentWeather);
      setAlerts(newAlerts); // Assuming you have a state to hold alerts
    }
  }, [currentWeather]); // This useEffect now depends on currentWeather and will check thresholds whenever it updates


  if (error) return <div>Error: {error}</div>;
  if (!weatherData) return <div>Loading...</div>;


  const CustomAlert = ({ message, onClose, temp }) => (
    <div 
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        backgroundColor: temp > 35 ? '#f8d7da' : '#d4edda', // Reddish for high temp, greenish for low temp
      }}
      className={`alert ${temp > 35 ? 'alert-danger' : 'alert-success'}`} role="alert">
      <h4 className="alert-heading">{temp > 35 ? 'High Temperature Warning!' : 'Temperature Normal'}</h4>
      <hr/>
      <p>{message}</p>
      <button type="button" className="btn btn-danger" onClick={onClose}>Close</button>
    </div>
  );

  const getConditionIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <><FontAwesomeIcon icon={faSun} style={{ color: 'yellow' }} /> Clear</>;
      case 'Rain':
        return <><FontAwesomeIcon icon={faCloudRain} style={{ color: 'skyblue' }} /> Rain</>;
      case 'Snow':
        return <><FontAwesomeIcon icon={faSnowflake} style={{ color: 'lightblue' }} /> Snow</>;
      case 'Fog':
      case 'Mist':
        return <><FontAwesomeIcon icon={faSmog} style={{ color: 'lightblue' }} /> Fog/Mist</>;
      case 'Thunderstorm':
        return <><FontAwesomeIcon icon={faPooStorm} style={{ color: 'darkblue' }} /> Thunderstorm</>;
      default:
        return <><FontAwesomeIcon icon={faCloud} style={{ color: 'silver' }} /> {condition}</>;
    }
  };

  const temperatureTrendData = {
    labels: forecastData.map(data => data.date), // Assuming forecastData is already sorted by date
    datasets: [
      {
        label: 'Average Temperature (°C)',
        data: forecastData.map(data => data.avgTemp),
        borderColor: 'rgba(255, 255, 255, 0.8)', // Set color to white with some transparency
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Optional: Adjust background color to a lighter white if needed
        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3.8, // Points remain hidden
        pointHoverRadius: 3.8,
        pointHitRadius: 10,
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgba(255, 255, 255, 0.5)',
        pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
      }
    ]
  };

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          color: 'white' // Change x-axis label color
        }
      },
      y: {
        ticks: {
          color: 'white' // Change y-axis label color
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white' // Change legend label color
        }
      }
    }
  };

  return (
    <>
    <div className="weather-card" style={{fontSize: '16px', fontWeight: '600'}}>
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} temp={currentWeather?.temp} />}
      <h2>{city}</h2>
      {currentWeather && (
        <div>
          <p> Current Temperature: <FontAwesomeIcon icon={faThermometerHalf} style={{ color: 'red' }} />{currentWeather.temp}°C</p>
          <p> Average Temperature: <FontAwesomeIcon icon={faTemperatureLow} style={{ color: 'blue' }} />{currentWeather.avgTemp}°C</p>
          <p> High Temperature: <FontAwesomeIcon icon={faTemperatureHigh} style={{ color: 'orange' }} />{currentWeather.maxTemp}°C</p>
          <p> Low Temperature: <FontAwesomeIcon icon={faTemperatureLow} style={{ color: 'lightblue' }} />{currentWeather.minTemp}°C</p>
          <p> Wind Speed: <FontAwesomeIcon icon={faWind} style={{ color: 'lightblue' }} />{currentWeather.windSpeed} km/h</p>
          <p> Humidity: <FontAwesomeIcon icon={faTint} style={{ color: 'blue' }} />{currentWeather.humidity}%</p>
          <p> Dominant Condition: {forecastData.length > 0 ? getConditionIcon(forecastData[0].dominantCondition) : 'N/A'}</p>
        </div>
      )}
      {weatherData && weatherData.length > 0 ? (
        <>
          
          <div style={{ width: '100%', height: '150px', marginTop: '20px' }}>
            <Line data={temperatureTrendData} options={chartOptions} />
          </div>
          
        </>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
    
    <div style={{
      maxHeight: '300px', 
      overflowY: 'auto', 
      width: '100%', 
      boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', 
      backgroundColor: '#d3d3d3', 
      marginLeft: '15px'
    }}>
      <table className="table" style={{
        fontSize: '12px',
        margin: 'auto',
        borderCollapse: 'collapse'
      }}>
        <thead>
          <tr style={{
            backgroundColor: '#4CAF50',
            color: 'white'
          }}>
            <th style={{ padding: '10px', border: '1px solid #ddd', position: 'sticky', top: 0, zIndex: 100 }}>Date</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', position: 'sticky', top: 0, zIndex: 100 }}>Avg Temperature</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', position: 'sticky', top: 0, zIndex: 100 }}>Max Temperature</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', position: 'sticky', top: 0, zIndex: 100 }}>Min Temperature</th>
            <th style={{ padding: '10px', border: '1px solid #ddd', position: 'sticky', top: 0, zIndex: 100 }}>Dominant Condition</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map((data, index) => (
            <tr key={index} style={{
              backgroundColor: index % 2 ? '#f2f2f2' : 'white',
              '&:hover': {
                backgroundColor: '#ddd'
              }
            }}>
              <td>{data.date}</td>
              <td>{data.avgTemp}</td>
              <td>{data.maxTemp}</td>
              <td>{data.minTemp}</td>
              <td>{getConditionIcon(data.dominantCondition)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
    
  );
  
};

export default WeatherCard;
