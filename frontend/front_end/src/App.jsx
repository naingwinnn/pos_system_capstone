import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React from "react";

function App() {
  const fetchMessage = () => {
    fetch("http://localhost:8000/products") // simple GET
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Laravel ↔ React Test</h1>
      <button onClick={fetchMessage}>Fetch Message</button>
    </div>
  );
}

export default App;

