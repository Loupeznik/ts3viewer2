import React, {useEffect, useState} from 'react';
import {ServerInfoDto, ServerService} from "../api";

export const MainPage = () => {
    const [server, setServer] = useState({})

    const getServerInfo = async () => {
        try {
            const info = await ServerService.getApiV1ServerInfo()
            setServer(info)
        }
        catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getServerInfo()
    }, [])

    function renderServerInfo(info: ServerInfoDto) {
            return(
                <div className="text-center">
                    <div className="mb-1 text-md font-semibold">Currently connected users</div>
                    <div className="my-2 font-sans text-xl font-bold">{info.clientsOnline}/{info.maxClients}</div>
                </div>
            )
    }

    return (
        <div>
            <div
                className="p-4 w-full text-center bg-white border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Current server status</h1>
                <div className="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                    <div
                       className="w-full mt-3 md:w-1/4 bg-gray-800 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700">
                        {renderServerInfo(server)}
                    </div>
                </div>
            </div>

        </div>
    )
}
