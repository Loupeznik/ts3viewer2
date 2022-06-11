import React, { useEffect, useState } from 'react';
import { AudioBotService, FileDto, FileService, SongDto, VolumeDto } from '../api';
import { FiPlayCircle, FiPauseCircle, FiStopCircle, FiMinusCircle, FiPlusCircle } from "react-icons/fi";

export const AudioBotPage = () => {
    const refreshInterval = 10000
    const [currentSong, setCurrentSong] = useState<SongDto>()
    const [availableSongs, setAvailableSongs] = useState<FileDto[]>()
    const [currentVolume, setCurrentVolume] = useState<number>()

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
        if (currentSong) {
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

    return (
        <div>
            <div
                className="p-4 w-full text-center bg-white border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Audiobot</h1>
                <div className="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                    <div
                        className="w-full mt-3 md:w-1/2 bg-gray-800 text-white rounded-lg items-center justify-center px-4 py-2.5 dark:bg-gray-700">
                        <p className="text-xl font-semibold">{currentSong?.title ? "Currently playing " + currentSong.title : "Currently not playing any song"}</p>
                        <div className="bg-gray-600 p-4 my-8 w-1/2 mx-auto grid grid-flow-col rounded-lg text-3xl items-center">
                            <div className="flex flex-row gap-4 justify-center">
                                {renderPlaybackControls()}
                                <FiStopCircle onClick={stopPlayback} className="cursor-pointer hover:text-red-400" />
                            </div>
                            <div className="bg-gray-800 rounded-lg text-xl font-bold p-2">
                            <p title="Current volume">{currentVolume}</p>
                            </div>
                            <div className="flex flex-row gap-4 justify-center">
                                <FiPlusCircle onClick={increaseVolume} className="cursor-pointer hover:text-green-400" title="Increase volume by 10%" />
                                <FiMinusCircle onClick={decreaseVolume} className="cursor-pointer hover:text-red-400" title="Decrease volume by 10%" />
                            </div>
                        </div>
                        <div className="bg-gray-600 p-4 my-8 w-1/2 mx-auto gap-4 justify-center rounded-lg">
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
