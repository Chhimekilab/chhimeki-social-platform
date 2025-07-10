import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snow, Wind, Thermometer, Droplets, Eye } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock weather data - in a real app, you'd fetch from a weather API
  useEffect(() => {
    const fetchWeather = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWeather = {
        location: 'San Francisco, CA',
        temperature: 72,
        condition: 'partly-cloudy',
        description: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
        uvIndex: 6,
        hourlyForecast: [
          { time: '12 PM', temp: 72, icon: 'partly-cloudy' },
          { time: '1 PM', temp: 74, icon: 'sunny' },
          { time: '2 PM', temp: 76, icon: 'sunny' },
          { time: '3 PM', temp: 75, icon: 'partly-cloudy' },
          { time: '4 PM', temp: 73, icon: 'cloudy' }
        ],
        weeklyForecast: [
          { day: 'Today', high: 76, low: 58, icon: 'partly-cloudy' },
          { day: 'Tomorrow', high: 78, low: 60, icon: 'sunny' },
          { day: 'Wed', high: 74, low: 56, icon: 'cloudy' },
          { day: 'Thu', high: 71, low: 54, icon: 'rainy' },
          { day: 'Fri', high: 69, low: 52, icon: 'rainy' }
        ]
      };
      
      setWeather(mockWeather);
      setLoading(false);
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition, size = 'w-8 h-8') => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'partly-cloudy':
        return <Cloud className={`${size} text-gray-500`} />;
      case 'cloudy':
        return <Cloud className={`${size} text-gray-600`} />;
      case 'rainy':
        return <CloudRain className={`${size} text-blue-500`} />;
      case 'snowy':
        return <Snow className={`${size} text-blue-200`} />;
      default:
        return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getBackgroundGradient = (condition) => {
    switch (condition) {
      case 'sunny':
        return 'from-yellow-400 to-orange-500';
      case 'partly-cloudy':
        return 'from-blue-400 to-blue-600';
      case 'cloudy':
        return 'from-gray-400 to-gray-600';
      case 'rainy':
        return 'from-blue-600 to-indigo-700';
      case 'snowy':
        return 'from-blue-200 to-blue-400';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with gradient background */}
      <div className={`bg-gradient-to-r ${getBackgroundGradient(weather.condition)} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Weather</h3>
            <p className="text-sm opacity-90">{weather.location}</p>
          </div>
          {getWeatherIcon(weather.condition, 'w-12 h-12')}
        </div>
        
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">{weather.temperature}°</span>
          <span className="text-xl ml-2 opacity-90">F</span>
        </div>
        <p className="text-sm opacity-90 mt-1">{weather.description}</p>
      </div>

      {/* Weather details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="text-sm font-medium">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Wind</p>
              <p className="text-sm font-medium">{weather.windSpeed} mph</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Visibility</p>
              <p className="text-sm font-medium">{weather.visibility} mi</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">UV Index</p>
              <p className="text-sm font-medium">{weather.uvIndex}</p>
            </div>
          </div>
        </div>

        {/* Hourly forecast */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Hourly Forecast</h4>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {weather.hourlyForecast.map((hour, index) => (
              <div key={index} className="flex-shrink-0 text-center p-2 bg-gray-50 rounded-lg min-w-[60px]">
                <p className="text-xs text-gray-500 mb-1">{hour.time}</p>
                <div className="flex justify-center mb-1">
                  {getWeatherIcon(hour.icon, 'w-5 h-5')}
                </div>
                <p className="text-sm font-medium">{hour.temp}°</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly forecast */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">5-Day Forecast</h4>
          <div className="space-y-2">
            {weather.weeklyForecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <div className="flex items-center space-x-3 flex-1">
                  {getWeatherIcon(day.icon, 'w-5 h-5')}
                  <span className="text-sm font-medium w-16">{day.day}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{day.high}°</span>
                  <span className="text-sm text-gray-500">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;