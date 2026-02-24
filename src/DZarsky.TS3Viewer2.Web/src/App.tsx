import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/navigation/Navbar';
import { Routes, Route } from "react-router";
import { StatusPage } from "./pages/Status";
import { MainPage } from "./pages/Main"
import { ConnectPage } from './pages/Connect';
import { UploadPage } from './pages/Upload';
import { AudioBotPage } from './pages/AudioBot';
import { AdminPage } from './pages/Admin';
import { ChannelsPage } from './pages/admin/Channels';
import { ClientsPage } from './pages/admin/Clients';
import { FilesPage } from './pages/admin/Files';
import { ServerPage } from './pages/admin/Server';
import { UsersPage } from './pages/admin/Users';
import { AdminMainPage } from './pages/admin/Main';

function App() {
  return (
    <div className="h-screen bg-background">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/bot" element={<AudioBotPage />} />
        <Route path="/admin" element={<AdminPage />} >
          <Route path="/admin/channels" element={<ChannelsPage />} />
          <Route path="/admin/clients" element={<ClientsPage />} />
          <Route path="/admin/files" element={<FilesPage />} />
          <Route path="/admin/server" element={<ServerPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin" element={<AdminMainPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
