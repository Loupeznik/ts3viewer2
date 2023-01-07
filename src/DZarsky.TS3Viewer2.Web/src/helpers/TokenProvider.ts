import { OpenAPI } from '../api';
import { UserService, UserDto } from '../api';

const _localAppTokenStorageKey : string = 'api_app_token'
const _localAppTokenExpirationStorageKey : string = 'app_token_expiration'

export const getAppToken = async () => {
    let localToken = localStorage.getItem(_localAppTokenStorageKey)
    let localTokenExpiration = localStorage.getItem(_localAppTokenExpirationStorageKey)
    let token;
    const isLocalTokenExpired = localTokenExpiration === null ? false : Date.now() > Date.parse(localTokenExpiration)

    if (localToken === null || isLocalTokenExpired)
    {
        const credentials : UserDto = {
            login: process.env.REACT_APP_APP_LOGIN as string,
            secret: process.env.REACT_APP_APP_SECRET as string
        }

        const tokenResult = await UserService.postApiV1UsersAuthToken(credentials)

        if (tokenResult.token != null)
        {
            localStorage.setItem(_localAppTokenStorageKey, tokenResult.token)
            let currentDate = new Date()
            currentDate.setHours(currentDate.getHours() + tokenResult.expiresIn!)

            localStorage.setItem(_localAppTokenExpirationStorageKey, currentDate.toUTCString())

            token = tokenResult.token
        }
    } else {
        token = localToken
    }

    OpenAPI.TOKEN = token;
    return token as string;
};
