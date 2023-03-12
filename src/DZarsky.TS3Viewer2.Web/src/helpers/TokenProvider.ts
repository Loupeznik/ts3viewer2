import { OpenAPI } from '../api';
import { UserService, UserDto } from '../api';

const _localAppTokenStorageKey : string = 'api_app_token'
const _localAppTokenExpirationStorageKey : string = 'app_token_expiration'

const getAppToken = async () => {
    const localToken = localStorage.getItem(_localAppTokenStorageKey)
    let token

    if (localToken === null || isTokenExpired())
    {
        const credentials : UserDto = {
            login: import.meta.env.VITE_APP_LOGIN as string,
            secret: import.meta.env.VITE_APP_SECRET as string
        }

        const tokenResult = await UserService.postApiV1UsersAuthToken(credentials)

        if (tokenResult.token != null)
        {
            localStorage.setItem(_localAppTokenStorageKey, tokenResult.token)
            setTokenExpiration(tokenResult.expiresIn!)

            token = tokenResult.token
        }
    } else {
        token = localToken
    }

    OpenAPI.TOKEN = token
}

const isTokenExpired = () : boolean => {
    const localTokenExpiration = localStorage.getItem(_localAppTokenExpirationStorageKey)
    return localTokenExpiration === null ? false : Date.now() > Date.parse(localTokenExpiration)
}

const setTokenExpiration = (expiresIn: number) => {
    let currentDate = new Date()
    currentDate.setHours(currentDate.getHours() + expiresIn)

    localStorage.setItem(_localAppTokenExpirationStorageKey, currentDate.toUTCString())
}

const revokeToken = () => {
    localStorage.removeItem(_localAppTokenStorageKey)
    localStorage.removeItem(_localAppTokenExpirationStorageKey)
}

export { getAppToken, isTokenExpired, setTokenExpiration, revokeToken }
