import { Route, Routes } from "react-router";
import { Navbar } from "@/components/navigation/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AdminPage } from "./pages/Admin";
import { AudioBotPage } from "./pages/AudioBot";
import { ChannelsPage } from "./pages/admin/Channels";
import { ClientsPage } from "./pages/admin/Clients";
import { FilesPage } from "./pages/admin/Files";
import { AdminMainPage } from "./pages/admin/Main";
import { ServerPage } from "./pages/admin/Server";
import { UsersPage } from "./pages/admin/Users";
import { ConnectPage } from "./pages/Connect";
import { MainPage } from "./pages/Main";
import { StatusPage } from "./pages/Status";
import { UploadPage } from "./pages/Upload";

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
        <Route path="/admin" element={<AdminPage />}>
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
