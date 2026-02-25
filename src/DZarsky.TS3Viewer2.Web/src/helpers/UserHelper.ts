import { type UserDto, UserService } from "../api";
import { _localAppTokenStorageKey, isTokenExpired, setTokenExpiration } from "./TokenProvider";

type CurrentUserProps = {
  username: string;
  permissions: string | string[];
  isValid: boolean;
};

const getCurrentUser = (): CurrentUserProps => {
  const jwt = localStorage.getItem(_localAppTokenStorageKey);
  const result: CurrentUserProps = {
    username: "",
    permissions: "",
    isValid: false,
  };

  if (!jwt) {
    return result;
  }

  try {
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      return result;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    const payloadObject = JSON.parse(decoded);

    const [username, permissions, role]: [string, string | string[], string] = [
      payloadObject.sub,
      payloadObject.permissions,
      payloadObject.role,
    ];

    if (role === "App" || isTokenExpired()) {
      return result;
    }

    result.permissions = permissions;
    result.username = username;
    result.isValid = true;
  } catch {
    return result;
  }

  return result;
};

const signIn = async ({ login, secret }: UserDto): Promise<boolean> => {
  const tokenResult = await UserService.postApiV1UsersAuthToken({ login, secret });

  if (tokenResult.token != null) {
    localStorage.setItem(_localAppTokenStorageKey, tokenResult.token);
    setTokenExpiration(tokenResult.expiresIn!);
    return true;
  }

  return false;
};

const checkPermissions = (permissions: string | string[], permissionsToCheck: string[]) => {
  if (Array.isArray(permissions)) {
    return permissionsToCheck.some((permission) => permissions.includes(permission));
  } else {
    return permissionsToCheck.includes(permissions);
  }
};

export { getCurrentUser, signIn, checkPermissions };
export type { CurrentUserProps };
