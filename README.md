# Weather Dashboard

## Overview
Weather Dashboard is a React-based web application that provides real-time weather updates and forecasts for various cities. It utilizes the OpenWeather API to fetch current weather data, including temperature, humidity, wind speed, and weather conditions. The application is designed to help users plan their day or week by providing up-to-date weather information.

## Features
- Display current weather conditions including temperature, humidity, and wind speed.
- Show a 7-day weather forecast with daily summaries.
- Interactive charts to visualize temperature trends.
- Alerts for extreme weather conditions based on predefined thresholds.
## Data Visualization

### Graphical Representation

#### Temperature Trend Chart
The Weather Dashboard utilizes Chart.js to render a line chart that displays the temperature trends over the next seven days. This chart provides a visual representation of the average, maximum, and minimum temperatures forecasted for each day. The line chart is interactive, allowing users to hover over points to see detailed temperature data for specific days.

Key features of the temperature trend chart include:
- **Line Colors**: Different colors represent average, maximum, and minimum temperatures, making it easy to distinguish between them.
- **Hover Details**: Users can move their cursor over the chart to see tooltips that provide exact temperature values and the date.


### Tabular Representation

#### Daily Weather Summary Table
Alongside the graphical representation, the Weather Dashboard provides a detailed table that lists daily weather conditions for the selected city. This table is particularly useful for users who prefer a quick, textual overview of the weather forecast.

Features of the weather summary table include:
- **Columns**: The table includes columns for date, average temperature, maximum temperature, minimum temperature, and dominant weather condition.


Both the graphical and tabular representations are designed to provide users with clear, concise, and useful weather information, helping them make informed decisions based on weather conditions.

## The UI Img





## Technologies Used
- **React**: Frontend framework for building the user interface.
- **Node.js and Express**: Backend server to handle API requests.
- **Axios**: Used for making HTTP requests to external weather API.
- **Chart.js**: For generating graphical representations of weather data.
- **MongoDB**: Database to store historical weather data.

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yadavrajneesh481/Real-Time-Data-Processing-System-For-Weather-Monitoring.git
   
   ```

2. **Install dependencies for the backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Install dependencies for the frontend:**
   ```bash
   cd weather-frontend
   npm install
   ```



### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   node index.js
   ```

2. **Run the frontend application:**
   ```bash
   cd weather-frontend
   npm start
   ```
   This will launch the Weather Dashboard on `http://localhost:3000`.

## Usage
Navigate to `http://localhost:3000` on your web browser to view the application. Select a city from the list to view current weather conditions and the forecast for the next seven days.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue to discuss proposed changes or additions.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Email - yadavrajneesh481@gmail.com

