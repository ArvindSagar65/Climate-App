import React, { useState } from 'react';
import Weather from './components/Weather.jsx';
import sun_icon from './assets/sun.png';
import moon_icon from './assets/moon.png';

const App = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const fetchBackground = async (location) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${location}&client_id=2OKlrd8K3YXK4IptExLjy7nk2UKpjUvjB0KI4DyeRv0`
      );
      const data = await response.json();
      if (data.urls && data.urls.regular) {
        setBackgroundImage(data.urls.regular);
      }
    } catch (error) {
      console.error('Error fetching background image:', error);
    }
  };

  return (
    <div
      className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background 0.5s ease',
      }}
    >
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        <img src={darkMode ? sun_icon : moon_icon} alt="Toggle theme" height="24px" width="24px" />
      </button>

      <Weather fetchBackground={fetchBackground} darkMode={darkMode} />
    </div>
  );
};

export default App;
