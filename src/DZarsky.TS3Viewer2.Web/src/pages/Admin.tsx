import { useState } from "react";
import { Outlet } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import type { UserDto } from "../api";
import { Login } from "../components/Login";
import { AdminSideNav } from "../components/navigation/AdminSideNav";
import { getServerGroups } from "../helpers/ServerHelpers";
import { getAppToken, revokeToken } from "../helpers/TokenProvider";
import type { CurrentUserProps } from "../helpers/UserHelper";
import { getCurrentUser, signIn } from "../helpers/UserHelper";

export const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUserProps>({} as CurrentUserProps);

  const checkUser = () => {
    const user = getCurrentUser();

    if (!user.isValid) {
      return;
    }

    setCurrentUser(user);
    setAuthenticated(true);
  };

  const onLogin = async ({ login, secret }: UserDto) => {
    if (!login || !secret) {
      return;
    }

    const success = await signIn({ login, secret });
    if (!success) {
      return;
    }

    checkUser();
  };

  if (!authenticated) {
    checkUser();

    return <Login onLogin={onLogin} />;
  }

  if (authenticated) {
    getAppToken();
    getServerGroups();
  }

  const onLogout = () => {
    revokeToken();
    setAuthenticated(false);
  };

  return (
    <div data-testid="admin-layout" className="p-4 w-full sm:p-8 bg-background">
      <h1 className="mb-2 text-3xl font-bold text-center text-foreground">Administration</h1>
      <Card className="mt-3">
        <CardContent className="flex md:flex-row flex-col px-4 py-2.5 text-foreground">
          <AdminSideNav username={currentUser.username} permissions={currentUser.permissions} onLogout={onLogout} />
          <div className="mx-auto w-full md:w-screen">
            <Outlet />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
