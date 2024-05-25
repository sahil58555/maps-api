// src/App.js
import React from 'react';
import MapWithMultipleStops from './MapWithMultipleStops';
import './App.css';

const stops = [
  { lng: 79.4192, lat: 28.4478 }, // Bareilly, India
  { lng: 72.8777, lat: 19.076 }, // Mumbai, India
  { lng: 77.5946, lat: 12.9716 }, // Bangalore, India
  { lng: 80.2707, lat: 13.0827 } // Chennai, India
];

function App() {
  return (
    <div className="App">
      <MapWithMultipleStops stops={stops} />
    </div>
  );
}

export default App;
