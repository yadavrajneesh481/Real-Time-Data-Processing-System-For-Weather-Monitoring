export const processWeatherData = (dailyData) => {
  if (!dailyData || !Array.isArray(dailyData)) {
    console.error('Invalid daily data:', dailyData);
    return [];
  }

  return dailyData.slice(0, 7).map(day => ({
    date: new Date(day.dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }),
    avgTemp: Math.round(day.temp.day),
    maxTemp: Math.round(day.temp.max),
    minTemp: Math.round(day.temp.min),
    dominantCondition: day.weather[0].main
  }));
};
