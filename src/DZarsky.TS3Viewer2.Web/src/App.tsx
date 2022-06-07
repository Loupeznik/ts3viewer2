import React from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Routes, Route } from "react-router-dom";
import { StatusPage } from "./pages/Status";
import { MainPage } from "./pages/Main"
import { ConnectPage } from './pages/Connect';
import { UploadPage } from './pages/Upload';


function App() {
  return (
      <div className="dark h-screen bg-gray-800">
        <Navbar />
          <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/upload" element={<UploadPage />} />
          </Routes>
      </div>
  );
}

export default App;
