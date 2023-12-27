import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// Define a functional component SimpleLineChart that takes data as props
const SimpleLineChart = ({ data }) => {
  // Extract keys from the data (excluding the 'name' key)
  const keys =
    data.length > 0 ? Object.keys(data[0]).filter((key) => key !== 'name') : [];

  return (
    // Render a LineChart component from recharts library
    <LineChart width={800} height={600} data={data}>
      {/* Render a Cartesian grid */}
      <CartesianGrid strokeDasharray="3 3" />
      {/* Render the X-axis */}
      <XAxis dataKey="name" />
      {/* Render the Y-axis */}
      <YAxis />
      {/* Render a tooltip */}
      <Tooltip />
      {/* Render a legend */}
      <Legend />
      {/* Map through keys and render Line components for each data key */}
      {keys.map((key) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key} // Set the dataKey for each Line component
          stroke={getRandomColor()} // Get a random color for each Line
        />
      ))}
    </LineChart>
  );
};

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  // Generate a random color HEX value
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default SimpleLineChart; // Export the SimpleLineChart component
