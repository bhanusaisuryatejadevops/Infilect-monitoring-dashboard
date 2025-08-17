import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    latency: 0,
    memoryUsage: 0,
    requestCount: 0,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      { label: 'CPU Usage (%)', data: [], borderColor: 'rgb(75, 192, 192)', tension: 0.1 },
      { label: 'Latency (ms)', data: [], borderColor: 'rgb(255, 99, 132)', tension: 0.1 },
      { label: 'Memory Usage (%)', data: [], borderColor: 'rgb(54, 162, 235)', tension: 0.1 },
    ],
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://backend:3001/metrics');
        setMetrics(response.data);
        setChartData((prev) => {
          const newLabels = [...prev.labels, new Date().toLocaleTimeString()].slice(-10);
          return {
            labels: newLabels,
            datasets: [
              { ...prev.datasets[0], data: [...prev.datasets[0].data, response.data.cpuUsage].slice(-10) },
              { ...prev.datasets[1], data: [...prev.datasets[1].data, response.data.latency].slice(-10) },
              { ...prev.datasets[2], data: [...prev.datasets[2].data, response.data.memoryUsage].slice(-10) },
            ],
          };
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Monitoring Dashboard</h1>
      <div className="metric-cards">
        <div className="card">
          <h3>CPU Usage</h3>
          <p>{metrics.cpuUsage}%</p>
        </div>
        <div className="card">
          <h3>Latency</h3>
          <p>{metrics.latency}ms</p>
        </div>
        <div className="card">
          <h3>Memory Usage</h3>
          <p>{metrics.memoryUsage}%</p>
        </div>
        <div className="card">
          <h3>Request Count</h3>
          <p>{metrics.requestCount}</p>
        </div>
      </div>
      <div className="chart">
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      </div>
    </div>
  );
};

export default App;