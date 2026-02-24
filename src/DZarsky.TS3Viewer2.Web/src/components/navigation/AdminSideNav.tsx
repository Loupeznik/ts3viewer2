import { File, LogOut, Phone, Server, User, UserCheck, Users } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type CurrentUserProps, checkPermissions } from "../../helpers/UserHelper";

export const AdminSideNav = ({
  username,
  permissions,
  onLogout,
}: {
  username: CurrentUserProps["username"];
  permissions: CurrentUserProps["permissions"];
  onLogout: () => void;
}) => {
  const defaultServerPermissions = ["ServerAdmin", "SuperAdmin"];
  const pathname = useLocation();

  const isActive = (path: string): boolean => {
    return pathname.pathname === "/admin".concat(path);
  };

  return (
    <div className="flex flex-col p-3 bg-gray-900 text-gray-100 rounded max-w-screen">
      <div>
        <div className="flex-1">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            {checkPermissions(permissions, defaultServerPermissions.concat(["AudioBotAdmin"])) && (
              <li>
                <Button
                  variant="ghost"
                  asChild
                  className={`w-full justify-start gap-3 ${isActive("/files") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                >
                  <Link to="/admin/files">
                    <File className="w-5 h-5" />
                    <span className="font-semibold">Files</span>
                  </Link>
                </Button>
              </li>
            )}
            {checkPermissions(permissions, defaultServerPermissions.concat(["ClientAdmin"])) && (
              <li>
                <Button
                  variant="ghost"
                  asChild
                  className={`w-full justify-start gap-3 ${isActive("/clients") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                >
                  <Link to="/admin/clients">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">Clients</span>
                  </Link>
                </Button>
              </li>
            )}
            {checkPermissions(permissions, defaultServerPermissions.concat(["ChannelAdmin"])) && (
              <li>
                <Button
                  variant="ghost"
                  asChild
                  className={`w-full justify-start gap-3 ${isActive("/channels") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                >
                  <Link to="/admin/channels">
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold">Channels</span>
                  </Link>
                </Button>
              </li>
            )}
            {checkPermissions(permissions, defaultServerPermissions) && (
              <li>
                <Button
                  variant="ghost"
                  asChild
                  className={`w-full justify-start gap-3 ${isActive("/server") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                >
                  <Link to="/admin/server">
                    <Server className="w-5 h-5" />
                    <span className="font-semibold">Server</span>
                  </Link>
                </Button>
              </li>
            )}
            {checkPermissions(permissions, ["SuperAdmin", "ApiUserAdmin"]) && (
              <li>
                <Button
                  variant="ghost"
                  asChild
                  className={`w-full justify-start gap-3 ${isActive("/users") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                >
                  <Link to="/admin/users">
                    <UserCheck className="w-5 h-5" />
                    <span className="font-semibold">API users</span>
                  </Link>
                </Button>
              </li>
            )}
          </ul>
        </div>
      </div>
      <Separator className="my-2 bg-gray-700" />
      <div className="flex items-center py-2 mt-4 justify-between rounded-lg bg-gray-800 px-3">
        <div className="flex md:flex-row flex-col md:items-center gap-2 md:gap-3">
          <User className="w-6 h-6 text-gray-300" />
          <h2 className="text-sm md:text-base font-semibold text-ellipsis">{username}</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-red-400 hover:bg-transparent flex flex-col items-center gap-1"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs">Logout</span>
        </Button>
      </div>
    </div>
  );
};
