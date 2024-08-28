import React, { useState, useCallback } from 'react';
import axios from 'axios';

const SeaWeather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState(null);
  const [isSearch, setIsSearch] = useState(false); // To track if a search has been initiated

  // Function to fetch weather data from the API
  const fetchWeatherData = useCallback((capital) => {
    console.log('Fetching weather data for:', capital); // Log the capital being searched
    axios
      .get(`https://ibas.azurewebsites.net/fetch-only`, {
        params: { capital, apikey: '58c8f6da-98b4-4c4b-bfa7-5b52f09ea139' }
      })
      .then((response) => {
        console.log('API response:', response.data); // Log the entire response for debugging

        if (response.data.valid) {  // Check if the response is valid
          console.log('Valid response received. Processing data.');
          const data = response.data.averages;  // Access the averages object

          setWeatherData({
            temperature: data.temperature || 'N/A',
            humidity: data.humidity || 'N/A',
            pressure: data.pressure || 'N/A',
            windSpeed: data.windSpeed || 'N/A',
            cloudCover: data.cloudCover || 'N/A',
            precipitation: data.precipitation || 'N/A',
          });

          setIsSearch(true); // Indicate that a search has been made
          console.log('Weather data set:', data); // Log the weather data
        } else {
          console.error('Invalid response structure:', response.data);
          setError('Invalid weather data response.');
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        if (error.response) {
          // The server responded with a status code outside the range of 2xx
          console.error('Server response:', error.response.data);
          setError(`Error: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          setError('No response received from the server. Please check your network connection.');
        } else {
          // Something happened in setting up the request
          console.error('Error setting up the request:', error.message);
          setError('Error setting up the request. Please try again.');
        }
      });
  }, []);

  // Event handler for the search button and Enter key
  const handleSearch = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    console.log('Search triggered. Location:', location); // Log the location

    if (location.trim() === '') {
      console.warn('Invalid input: No capital city entered.');
      setError('Please enter a valid capital city.');
      return;
    }

    setError(null); // Clear any previous errors
    console.log('Initiating fetchWeatherData with location:', location);
    fetchWeatherData(location);
  };

  // Event handler for Enter key press in the input field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  };

  return (
    <div id="weaSea" className="seaWea-container">
      <h2> Weather Search </h2>
      <div className="sea-container">
        <input
          type="text"
          id="location-input"
          placeholder="Enter capital city"
          value={location}
          onChange={(e) => {
            console.log('Location input changed:', e.target.value); // Log location changes
            setLocation(e.target.value);
          }}
          onKeyPress={handleKeyPress} // Trigger search on Enter key press
        />
        <button type="button" id="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      {isSearch && (
        <div className="seaWea-grid">
          <div className="seaWea-item">
            <p>Temperature: {weatherData.temperature !== 'N/A' ? `${weatherData.temperature} °C` : 'N/A'}</p>
          </div>
          <div className="seaWea-item">
            <p>Humidity: {weatherData.humidity !== 'N/A' ? `${weatherData.humidity} %` : 'N/A'}</p>
          </div>
          <div className="seaWea-item">
            <p>Pressure: {weatherData.pressure !== 'N/A' ? `${weatherData.pressure} hPa` : 'N/A'}</p>
          </div>
          <div className="seaWea-item">
            <p>Wind Speed: {weatherData.windSpeed !== 'N/A' ? `${weatherData.windSpeed} km/h` : 'N/A'}</p>
          </div>
          <div className="seaWea-item">
            <p>Cloud Cover: {weatherData.cloudCover !== 'N/A' ? `${weatherData.cloudCover} %` : 'N/A'}</p>
          </div>
          <div className="seaWea-item">
            <p>Precipitation: {weatherData.precipitation !== 'N/A' ? `${weatherData.precipitation} mm` : 'N/A'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeaWeather;
