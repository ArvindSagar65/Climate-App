import React, { useEffect, useState, useRef } from 'react';
import ForecastCard from './ForecastCard.jsx';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import sun_icon from '../assets/sun.png';
import moon_icon from '../assets/moon.png';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [query, setQuery] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const inputRef = useRef(null);

    const allIcons = {
        "01d": clear_icon, "01n": clear_icon,
        "02d": cloud_icon, "02n": cloud_icon,
        "03d": drizzle_icon, "03n": drizzle_icon,
        "04d": cloud_icon, "04n": cloud_icon,
        "09d": rain_icon, "09n": rain_icon,
        "10d": rain_icon, "10n": rain_icon,
        "11d": drizzle_icon, "11n": drizzle_icon,
        "13d": snow_icon, "13n": snow_icon,
        "50d": cloud_icon, "50n": cloud_icon
    };

    const fetchSuggestions = async (input) => {
        if (!input || input.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();
            setSuggestions(data.map(place => ({
                name: place.name, country: place.country,
                lat: place.lat, lon: place.lon
            })));
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        fetchSuggestions(e.target.value);
    };

    const search = async (city) => {
        if (!city) return;
        try {
            let url = typeof city === 'string'
                ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
                : `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();
            if (data.cod !== 200) throw new Error(data.message);

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: allIcons[data.weather[0].icon] || clear_icon
            });

            setSuggestions([]);
            setQuery(data.name);
            fetchForecast(data.coord.lat, data.coord.lon);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const fetchForecast = async (lat, lon) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            const dailyForecasts = data.list.filter(item =>
                item.dt_txt.includes("12:00:00")
            ).slice(0, 5);

            setForecastData(dailyForecasts.map(forecast => ({
                date: new Date(forecast.dt * 1000).toLocaleDateString(),
                temperature: Math.floor(forecast.main.temp),
                icon: allIcons[forecast.weather[0].icon] || clear_icon
            })));
        } catch (error) {
            console.error("Error fetching forecast data:", error);
        }
    };

    useEffect(() => {
        search("London");
    }, []);

    const selectSuggestion = (suggestion) => {
        setQuery(suggestion.name);
        search(suggestion);
    };

    return (
        <div className={`weather ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                <img src={darkMode ? sun_icon : moon_icon} alt="Toggle theme" height="24px" width="24px" />
            </button>
            <div className="search-bar">
                <input
                    ref={inputRef}
                    type='text'
                    placeholder='Search'
                    value={query}
                    onChange={handleInputChange}
                />
                <img src={search_icon} alt="Search" onClick={() => search(query)} />
            </div>
            {suggestions.length > 0 && (
                <div className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="suggestion-item" onClick={() => selectSuggestion(suggestion)}>
                            {suggestion.name}, {suggestion.country}
                        </div>
                    ))}
                </div>
            )}
            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather icon" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity icon" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="Wind icon" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind speed</span>
                            </div>
                        </div>
                    </div>
                    {/* Forecast Component */}
                    <ForecastCard forecast={forecastData} />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Weather;
