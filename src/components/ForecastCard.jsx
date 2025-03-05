import React from "react";
import "./ForecastCard.css"; // New CSS file for styling

const ForecastCard = ({ forecast }) => {
  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-cards">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <p className="forecast-date">{day.date}</p>
            <img src={day.icon} alt="weather icon" className="forecast-icon" />
            <p className="forecast-temp">{day.temperature}°C</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
