/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MoveBotDto } from '../models/MoveBotDto';
import type { SongDto } from '../models/SongDto';
import type { VolumeDto } from '../models/VolumeDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AudioBotService {

    /**
     * @returns VolumeDto Success
     * @throws ApiError
     */
    public static getApiV1AudiobotVolume(): CancelablePromise<VolumeDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/audiobot/volume',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns VolumeDto Success
     * @throws ApiError
     */
    public static putApiV1AudiobotVolume(
requestBody?: VolumeDto,
): CancelablePromise<VolumeDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/audiobot/volume',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @returns SongDto Success
     * @throws ApiError
     */
    public static getApiV1AudiobotSong(): CancelablePromise<SongDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/audiobot/song',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns SongDto Success
     * @throws ApiError
     */
    public static postApiV1AudiobotSongPlay(
requestBody?: SongDto,
): CancelablePromise<SongDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/audiobot/song/play',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @returns SongDto Success
     * @throws ApiError
     */
    public static putApiV1AudiobotSongStop(): CancelablePromise<SongDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/audiobot/song/stop',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @returns SongDto Success
     * @throws ApiError
     */
    public static putApiV1AudiobotSongPause(): CancelablePromise<SongDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/audiobot/song/pause',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiV1AudiobotMove(
requestBody?: MoveBotDto,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/audiobot/move',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

}