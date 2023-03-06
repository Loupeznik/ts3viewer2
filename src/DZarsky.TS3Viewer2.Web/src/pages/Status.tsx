import React, { useEffect, useState } from 'react';
import { FiCornerDownRight, FiServer } from 'react-icons/fi';
import { ChannelDto, ChannelService, ClientDto, ClientService, ServerInfoDto, ServerService } from '../api';
import { ClientList } from '../components/ClientList';
import { Loader } from '../components/loader';
import { getAppToken } from '../helpers/TokenProvider';

export const StatusPage = () => {
    getAppToken()
    const refreshInterval = 5000
    const [clients, setClients] = useState<ClientDto[]>([])
    const [channels, setChannels] = useState<ChannelDto[]>([])
    const [server, setServer] = useState<ServerInfoDto>()

    const getClientsList = async () => {
        setClients(await ClientService.getApiV1ServerClients(true))
    }

    const getServerInfo = async () => {
        setServer(await ServerService.getApiV1ServerInfo())
    }

    const getChannelList = async () => {
        setChannels(await ChannelService.getApiV1ServerChannels())
    }

    const getAll = () => {
        getServerInfo().then(async () => {
            await getChannelList().then(() => {
                getClientsList()
            })
        })
    }

    if (!server) {
        getAll()
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getAll()
        }, refreshInterval)

        return () => clearInterval(interval);
    }, [clients])

    function renderChannelList() {
        return (
            <>
                {channels.map(function (channel, index) {
                    return (
                        <>
                            <li key={"header-" + index} className="border-solid py-2 border-b-2 rounded">
                                <ul>
                                    <li key={channel.name} className="ml-2 font-semibold">
                                        <FiCornerDownRight className="mr-1" />{channel.name}
                                    </li>
                                    <ul className="ml-2">
                                        <ClientList clients={clients.filter(x => x.channelId === channel.id)} />
                                    </ul>
                                </ul>
                            </li>
                        </>
                    )
                })}
            </>
        )
    }

    const renderClients = () => {
        return (
            <div className="m-2 p-2 bg-gray-800 rounded-md w-3/4 text-left">
                <ul className="m-4">
                    <li key={server?.name} className="text-lg font-bold"><FiServer className="mr-1" />{server?.name}</li>
                    <ul className="ml-4">
                        {renderChannelList()}
                    </ul>
                </ul>
            </div>
        )
    }

    return (
        <div>
            <div
                className="p-4 w-full text-center bg-white border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Detailed status page</h1>
                <div className="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                    <div
                        className="w-full mt-3 md:w-1/4 bg-gray-800 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700">
                        {(server && channels) ? renderClients() : <Loader />}
                    </div>
                </div>
            </div>
        </div>
    )
}
