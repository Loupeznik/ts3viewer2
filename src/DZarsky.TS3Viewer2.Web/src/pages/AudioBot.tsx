import React, { useEffect, useState } from 'react';
import { AudioBotService, FileDto, FileService, SongDto, VolumeDto } from '../api';
import { FiPlayCircle, FiPauseCircle, FiStopCircle, FiMinusCircle, FiPlusCircle, FiYoutube } from "react-icons/fi";
import validator from 'validator';
import { getAppToken } from '../helpers/TokenProvider';

export const AudioBotPage = () => {
    getAppToken()
    const refreshInterval = 10000
    const [currentSong, setCurrentSong] = useState<SongDto>()
    const [availableSongs, setAvailableSongs] = useState<FileDto[]>()
    const [currentVolume, setCurrentVolume] = useState<number>()
    const [ytbSong, setYtbSong] = useState<SongDto>()
    const [errorMessage, setErrorMessage] = useState<string>()

    useEffect(() => {
        const getCurrentSong = async () => {
            setCurrentSong(await AudioBotService.getApiV1AudiobotSong())
        }

        const getCurrentVolume = async () => {
            setCurrentVolume((await AudioBotService.getApiV1AudiobotVolume()).volume)
        }

        getSongList()

        const interval = setInterval(() => {
            getCurrentSong()
            getCurrentVolume()
        }, refreshInterval)

        if (!currentSong) {
            getCurrentSong()
        }

        if (!currentVolume) {
            getCurrentVolume()
        }

        return () => clearInterval(interval);
    }, [currentSong, currentVolume])

    async function startPlayback(song: SongDto) {
        setCurrentSong(await AudioBotService.postApiV1AudiobotSongPlay(song))
    }

    async function stopPlayback() {
        setCurrentSong(await AudioBotService.putApiV1AudiobotSongStop())
    }

    async function pausePlayback() {
        setCurrentSong(await AudioBotService.putApiV1AudiobotSongPause())
    }

    async function getSongList() {
        setAvailableSongs(await FileService.getApiV1Files())
    }

    async function increaseVolume() {
        const volume: VolumeDto = {
            volume: currentVolume ? currentVolume + 10 : 50
        }

        setCurrentVolume((await AudioBotService.putApiV1AudiobotVolume(volume)).volume)
    }

    async function decreaseVolume() {
        const volume: VolumeDto = {
            volume: currentVolume ? currentVolume - 10 : 50
        }

        setCurrentVolume((await AudioBotService.putApiV1AudiobotVolume(volume)).volume)
    }

    function renderPlaybackControls() {
        if (currentSong && !currentSong.paused) {
            return (
                <FiPauseCircle onClick={pausePlayback} className="cursor-pointer hover:text-yellow-400" />
            )
        }
        else {
            return (
                <FiPlayCircle onClick={pausePlayback} className="cursor-pointer hover:text-blue-400" />
            )
        }
    }

    const renderSongs = availableSongs?.map(function (file, index) {
        let song: SongDto = {
            link: file.fullName
        }

        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap uppercase font-semibold">
                    {file.name}
                </th>
                <td>
                    <FiPlayCircle onClick={() => startPlayback(song)} className="cursor-pointer hover:text-blue-400 text-2xl" />
                </td>
            </tr>
        )
    });

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        let song: SongDto = {
            link: event.target.value
        }

        setYtbSong(song)
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()

        if (ytbSong) {
            if (validator.isURL(ytbSong.link as string)) {
                if (errorMessage) {
                    setErrorMessage(undefined)
                }
                startPlayback(ytbSong)
            }
            else {
                setErrorMessage(ytbSong.link as string + " is not a valid URL")
            }
        }
    }

    function renderErrorMessage() {
        if (errorMessage) {
            return (
                <div>
                    <div className="p-4 w-full md:w-1/2 mx-auto text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 mt-4" role="alert">
                        <span className="font-bold">{errorMessage}</span>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            <div
                className="p-4 w-full text-center bg-white border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Audiobot</h1>
                <div className="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                    <div
                        className="w-full mt-3 md:w-1/2 bg-gray-800 text-white rounded-lg items-center justify-center px-4 py-2.5 dark:bg-gray-700">
                        <p className="text-xl font-semibold">{currentSong?.title ? "Currently playing " + currentSong.title : "Currently not playing any song"}</p>
                        <div className="bg-gray-600 p-4 mt-8 w-full md:w-1/2 mx-auto grid grid-flow-col rounded-lg text-3xl items-center">
                            <div className="flex flex-row gap-4 justify-center">
                                {renderPlaybackControls()}
                                <FiStopCircle onClick={stopPlayback} className="cursor-pointer hover:text-red-400" />
                            </div>
                            <div className="bg-gray-800 rounded-lg text-xl font-bold p-2">
                                <p title="Current volume">{currentVolume?.toFixed(0)}</p>
                            </div>
                            <div className="flex flex-row gap-4 justify-center">
                                <FiPlusCircle onClick={increaseVolume} className="cursor-pointer hover:text-green-400" title="Increase volume by 10%" />
                                <FiMinusCircle onClick={decreaseVolume} className="cursor-pointer hover:text-red-400" title="Decrease volume by 10%" />
                            </div>
                        </div>
                        <div>
                            {renderErrorMessage()}
                        </div>
                        <div className="bg-gray-600 p-4 mt-12 w-full md:w-1/2 mx-auto rounded-lg text-left">
                            <label htmlFor="play" className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Play music from YouTube</label>
                            <div className="relative">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <FiYoutube />
                                </div>
                                <input type="text" id="play" className="block p-4 pl-10 w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 
                                    focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="https://www.youtube.com/watch?v=wjRWpwOTsUo" required onChange={onChangeInput} />
                                <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 
                                    focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-4 py-2 dark:bg-blue-600 
                                    dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSubmit}>
                                    Play
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-600 p-4 my-4 w-full md:w-1/2 mx-auto gap-4 justify-center rounded-lg">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Song name
                                            </th>
                                            <th>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderSongs}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
