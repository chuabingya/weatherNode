import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeatherHistory = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState(null);
  const [activeFields, setActiveFields] = useState({
    temperature: true,
    humidity: true,
    pressure: true,
    windSpeed: true,
    cloudCover: true,
    precipitation: true,
  }); // New state to track which fields are active

  // Default limit to 15 data points
  const [dataLimit, setDataLimit] = useState(10);

  const fetchHistoricalData = useCallback(() => {
    axios
      .get(`https://ibas.azurewebsites.net/get-historical-data`, {
        params: { apikey: '58c8f6da-98b4-4c4b-bfa7-5b52f09ea139' }
      })
      .then((response) => {
        console.log('API response:', response.data);
        
        if (response.data.historical_data) {
          const formattedData = response.data.historical_data.map((item) => ({
            timestamp: new Date(item.timestamp).toLocaleString(),
            temperature: item.decrypted_data.temperature,
            humidity: item.decrypted_data.humidity,
            pressure: item.decrypted_data.pressure,
            windSpeed: item.decrypted_data.windSpeed,
            cloudCover: item.decrypted_data.cloudCover,
            precipitation: item.decrypted_data.precipitation,
          }));
          setHistoricalData(formattedData);
        } else {
          setError('No historical data available.');
        }
      })
      .catch((error) => {
        console.error('Error fetching historical data:', error);
        setError('Failed to fetch historical data. Please try again later.');
      });
  }, []);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  // Function to toggle field visibility
  const toggleField = (field) => {
    setActiveFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Limit to the last 10-15 data points
  const limitD = historicalData.slice(-dataLimit);

  return (
    <div id="weaHis" className="weaHis-container">
      <h2>Weather History</h2>
      {error && <div className="error">{error}</div>}

      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={limitD}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickCount={5} />
          <YAxis />
          <Tooltip />
          <Legend />
          {activeFields.temperature && <Line type="monotone" dataKey="temperature" stroke="#8884d8" />}
          {activeFields.humidity && <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />}
          {activeFields.pressure && <Line type="monotone" dataKey="pressure" stroke="#ffc658" />}
          {activeFields.windSpeed && <Line type="monotone" dataKey="windSpeed" stroke="#ff7300" />}
          {activeFields.cloudCover && <Line type="monotone" dataKey="cloudCover" stroke="#00C49F" />}
          {activeFields.precipitation && <Line type="monotone" dataKey="precipitation" stroke="#A9A9A9" />}
        </LineChart>
      </ResponsiveContainer>

      {/* Buttons to toggle field visibility */}
      <div className="field-buttons">
        <button onClick={() => toggleField('temperature')}>
          {activeFields.temperature ? 'Hide' : 'Show'} Temperature
        </button>
        <button onClick={() => toggleField('humidity')}>
          {activeFields.humidity ? 'Hide' : 'Show'} Humidity
        </button>
        <button onClick={() => toggleField('pressure')}>
          {activeFields.pressure ? 'Hide' : 'Show'} Pressure
        </button>
        <button onClick={() => toggleField('windSpeed')}>
          {activeFields.windSpeed ? 'Hide' : 'Show'} Wind Speed
        </button>
        <button onClick={() => toggleField('cloudCover')}>
          {activeFields.cloudCover ? 'Hide' : 'Show'} Cloud Cover
        </button>
        <button onClick={() => toggleField('precipitation')}>
          {activeFields.precipitation ? 'Hide' : 'Show'} Precipitation
        </button>
      </div>

      {/* Dropdown to select data limit */}
      <div className="data-limit-selector">
        <label htmlFor="dataLimit">Select number of data points:</label>
        <select 
          id="dataLimit" 
          value={dataLimit} 
          onChange={(e) => setDataLimit(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
        </select>
      </div>
    </div>
  );
};

export default WeatherHistory;
