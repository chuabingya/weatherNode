import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import an icon for the marker (use a URL or import a local image)
const humanIcon = new L.Icon({
  iconUrl: 'img/location.png',
  iconSize: [35, 45], // size of the icon
  iconAnchor: [17, 45], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // size of the shadow
});

const Weather = () => {
  const [capital] = useState('Singapore'); // Hard-coded capital for weather API
  const [weatherData, setWeatherData] = useState({});
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [error, setError] = useState(null);
  const [localTime, setLocalTime] = useState('');
  const [lat, setLat] = useState(null); // State to store latitude
  const [lon, setLon] = useState(null); // State to store longitude

  // Function to initialize the map with geolocation
  const initializeMap = useCallback((lat, lon) => {
    const newMap = L.map('map').setView([lat, lon], 16); // Set zoom level to 15 for a closer view
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(newMap);
    const newMarker = L.marker([lat, lon], { icon: humanIcon }).addTo(newMap); // Use custom icon
    setMap(newMap);
    setMarker(newMarker);
  }, []);

  // Function to fetch weather data from the API
  const fetchWeatherData = useCallback(() => {
    axios
      .get(`https://ibas.azurewebsites.net/fetch-only`, {
        params: { capital, apikey: '58c8f6da-98b4-4c4b-bfa7-5b52f09ea139' }
      })
      .then((response) => {
        console.log('API response:', response.data); // Log the entire response for debugging
        
        if (response.data.valid) {  // Check if the response is valid
          const data = response.data.averages;  // Access the averages object

          // Update state with the relevant fields from the API response
          setWeatherData({
            temperature: data.temperature || 'N/A',
            humidity: data.humidity || 'N/A',
            pressure: data.pressure || 'N/A',
            windSpeed: data.windSpeed || 'N/A',
            cloudCover: data.cloudCover || 'N/A',
            precipitation: data.precipitation || 'N/A',
          });

          // Update the map marker position if necessary
          if (map && marker) {
            map.setView([lat, lon]);
            marker.setLatLng([lat, lon]).update();
          }
        } else {
          setError('Invalid weather data response.');
        }
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        setError('Failed to fetch weather data. Please try again later.');
      });
  }, [capital, map, marker, lat, lon]);

  useEffect(() => {
    // Get the user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLon(longitude);
      },
      (error) => {
        console.error('Error getting geolocation:', error);
        // Default to Singapore if geolocation fails
        setLat(1.3521);
        setLon(103.8198);
      }
    );
  }, []);

  useEffect(() => {
    if (lat !== null && lon !== null && !map) {
      // Initialize the map only once geolocation data is available
      initializeMap(lat, lon);
    }
  }, [lat, lon, map, initializeMap]);

  useEffect(() => {
    if (map) {
      // Fetch weather data when the map is ready
      fetchWeatherData();

      const updateLocalTime = () => {
        const now = new Date();
        const localTimeString = now.toLocaleTimeString();
        setLocalTime(localTimeString);
      };

      updateLocalTime();
      const intervalId = setInterval(updateLocalTime, 1000);

      return () => clearInterval(intervalId);
    }
  }, [map, fetchWeatherData]);

  return (
    <div id="weather" className="weather-container">
      <h2> Weather </h2>
      <div className="map-container" id="map-container">
        <div id="map" className="map"></div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="weather-grid">
        <div className="weather-item">
          <p>Temperature: {weatherData.temperature !== 'N/A' ? `${weatherData.temperature} °C` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Humidity: {weatherData.humidity !== 'N/A' ? `${weatherData.humidity} %` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Pressure: {weatherData.pressure !== 'N/A' ? `${weatherData.pressure} hPa` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Wind Speed: {weatherData.windSpeed !== 'N/A' ? `${weatherData.windSpeed} km/h` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Cloud Cover: {weatherData.cloudCover !== 'N/A' ? `${weatherData.cloudCover} %` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p>Precipitation: {weatherData.precipitation !== 'N/A' ? `${weatherData.precipitation} mm` : 'N/A'}</p>
        </div>
        <div className="weather-item">
          <p id="local-time">Local Time: {localTime}</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
