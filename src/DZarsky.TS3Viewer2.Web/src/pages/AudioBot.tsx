import React, { useEffect, useState } from 'react';
import { AudioBotService, SongDto } from '../api';
import { FiPlayCircle, FiPauseCircle, FiStopCircle } from "react-icons/fi";

export const AudioBotPage = () => {
    const [currentSong, setCurrentSong] = useState<SongDto>()

    useEffect(() => {
        const getCurrentSong = async () => {
            setCurrentSong(await AudioBotService.getApiV1AudiobotSong())
        }
        
        if (!currentSong) {
            getCurrentSong()
        }
    }, [currentSong])

    async function startPlayback(song: SongDto) {
        setCurrentSong(await AudioBotService.postApiV1AudiobotSongPlay(song))
    }

    async function stopPlayback() {
        setCurrentSong(await AudioBotService.putApiV1AudiobotSongStop())
    }

    async function pausePlayback() {
        setCurrentSong(await AudioBotService.putApiV1AudiobotSongPause())
    }

    function renderPlaybackControls()
    {
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

    return (
        <div>
            <div
                className="p-4 w-full text-center bg-white border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Audiobot</h1>
                <div className="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                <div
                    className="w-full mt-3 md:w-1/2 bg-gray-800 text-white rounded-lg items-center justify-center px-4 py-2.5 dark:bg-gray-700">
                        <p className="text-xl font-semibold">{currentSong?.title ? "Currently playing " + currentSong.title : "Currently not playing any song"}</p>
                        <div className="bg-gray-600 p-4 my-8 w-1/2 flex flex-row mx-auto gap-4 justify-center rounded-lg text-3xl">
                            {renderPlaybackControls()}
                            <FiStopCircle onClick={stopPlayback} className="cursor-pointer hover:text-red-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
