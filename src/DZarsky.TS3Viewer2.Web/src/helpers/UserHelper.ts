import { OpenAPI, UserDto, UserService } from '../api';
import { isTokenExpired, setTokenExpiration } from './TokenProvider';

type CurrentUserProps = {
    username: string,
    permissions: string | string[],
    isValid: boolean
}

const _localAppTokenStorageKey : string = 'api_app_token'

const getCurrentUser = (): CurrentUserProps => {
    const jwt = localStorage.getItem(_localAppTokenStorageKey)
    let result : CurrentUserProps = {
        username: '',
        permissions: '',
        isValid: false
    }

    if (!jwt) {
        return result
    }

    const decoded = atob(jwt.split('.')[1])
    const payloadObject = JSON.parse(decoded);

    const [username, permissions, role] : [string, string | string[], string] = [payloadObject.sub, payloadObject.permissions, payloadObject.role]

    if (role === 'App' || isTokenExpired()) {
        return result
    }

    result.permissions = permissions
    result.username = username
    result.isValid = true

    return result
}

const signIn = async ({ login, secret } : UserDto) : Promise<boolean> => {
    const tokenResult = await UserService.postApiV1UsersAuthToken({ login, secret })

    if (tokenResult.token != null)
    {
        localStorage.setItem(_localAppTokenStorageKey, tokenResult.token)
        setTokenExpiration(tokenResult.expiresIn!)

        OpenAPI.TOKEN = tokenResult.token

        return true
    }

    return false
}

const checkPermissions = (permissions: string | string[], permissionsToCheck: string[]) => {
    if (Array.isArray(permissions)) {
      return permissionsToCheck.some(permission => permissions.includes(permission))
    }
    else {
        return permissionsToCheck.includes(permissions)
    }
  }

export { getCurrentUser, signIn, checkPermissions }
export type { CurrentUserProps }
