import React from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Routes, Route } from "react-router-dom";
import {StatusPage} from "./pages/Status";
import {MainPage} from "./pages/Main"


function App() {
  return (
      <div className="dark">
        <Navbar />
          <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/status" element={<StatusPage />} />
          </Routes>
      </div>

  );
}

export default App;
