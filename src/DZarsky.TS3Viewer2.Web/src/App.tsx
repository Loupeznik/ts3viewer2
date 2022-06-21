import React from 'react';
import { Navbar } from './components/navigation/Navbar';
import { Routes, Route } from "react-router-dom";
import { StatusPage } from "./pages/Status";
import { MainPage } from "./pages/Main"
import { ConnectPage } from './pages/Connect';
import { UploadPage } from './pages/Upload';
import { AudioBotPage } from './pages/AudioBot';
import { FiGithub } from 'react-icons/fi';


function App() {
  return (
    <div className="dark h-screen bg-gray-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/bot" element={<AudioBotPage />} />
      </Routes>
      <footer className="p-4 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 fixed inset-x-0 bottom-0">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
          Notice: Development still in progress, currently running the alpha/development version
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Dominik Zarsky
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          This project is GPL-3.0 licensed
        </span>
        <ul className="flex flex-wrap items-center mt-3 mr-4 text-lg text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a href="https://github.com/Loupeznik/ts3viewer2" target="_blank" rel="noreferrer"><FiGithub /></a>
          </li>
        </ul>
      </footer>
    </div>
  );
}

export default App;
