import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import logo from "../../assets/logo.svg";
import { NavLink } from "./NavLink";

export const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);
  const pathname = useLocation();

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-foreground">TeamSpeak3 Viewer</span>
        </a>
        <button
          onClick={handleShowNavbar}
          type="button"
          className="inline-flex items-center p-2 ml-3 text-muted-foreground rounded-lg md:hidden hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          aria-controls="mobile-menu"
          aria-expanded={showNavbar}
        >
          <span className="sr-only">Open main menu</span>
          {showNavbar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className={`w-full md:block md:w-auto ${showNavbar ? "" : "hidden"}`} id="mobile-menu">
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-1 md:mt-0 md:text-sm md:font-medium">
            <NavLink url="/" name="Home" isActive={pathname.pathname === "/"} />
            <NavLink url="/status" name="Server status" isActive={pathname.pathname === "/status"} />
            <NavLink url="/bot" name="Audiobot" isActive={pathname.pathname === "/bot"} />
            <NavLink url="/connect" name="Connect" isActive={pathname.pathname === "/connect"} />
            <NavLink url="/upload" name="Song upload" isActive={pathname.pathname === "/upload"} />
            <NavLink url="/admin" name="Server administration" isActive={pathname.pathname === "/admin"} />
          </ul>
        </div>
      </div>
    </nav>
  );
};
