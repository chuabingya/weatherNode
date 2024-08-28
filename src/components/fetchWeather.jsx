import React, { useEffect } from 'react';
import axios from 'axios';

function FetchWeather() {
  useEffect(() => {
    const apikey = '58c8f6da-98b4-4c4b-bfa7-5b52f09ea139';
    const capital = 'Singapore'; // Replace with the actual capital city
    const fetchInterval = 1 * 60 * 60 * 1000; // 1 hour

    const fetchWeatherData = () => {
      axios
        .get(`https://ibas.azurewebsites.net/fetch-store-weather`, {
          params: { capital, apikey }
        })
        .then(response => {
          console.log('Weather data fetched:', response.data);
          localStorage.setItem('lastFetchTime', Date.now().toString());
        })
        .catch(error => {
          console.error('Error fetching weather data:', error.response || error);
        });
    };

    // Get the last fetch time from localStorage
    const lastFetchTime = parseInt(localStorage.getItem('lastFetchTime'), 10);
    const currentTime = Date.now();

    // Check if it's been more than an hour since the last fetch
    if (!lastFetchTime || currentTime - lastFetchTime >= fetchInterval) {
      fetchWeatherData();
    } else {
      console.log('Weather data was recently fetched. Waiting for the next interval.');
    }

    // Set up the interval to fetch weather data every hour
    const intervalId = setInterval(() => {
      fetchWeatherData();
    }, fetchInterval);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return <div>Weather data fetcher is running in the background.</div>;
}

export default FetchWeather;
