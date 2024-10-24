// App.js
import React, { useState } from 'react';
import WeatherCard from './components/WeatherCard';
import './App.css';

const App = () => {
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  // List of major cities in India
const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Ranchi', 'Guwahati',
  'Chandigarh', 'Coimbatore', 'Mysore', 'Vijayawada', 'Rajkot',
    'Jodhpur', 'Raipur', 'Kochi', 'Amritsar', 'Jabalpur', 'Gwalior',
  ];  
  return (
    <div className="app-container">
      {/* City List on the Left */}
      <div className="city-list">
        <h3>City List</h3>
        <ul>
          {cities.map((city) => (
            <li
              key={city}
              className={selectedCity === city ? 'active' : ''}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      </div>

      {/* Weather Card on the Right */}
      <div className="weather-card-container">
        <WeatherCard city={selectedCity} />
      </div>
    </div>
  );
};

export default App;
