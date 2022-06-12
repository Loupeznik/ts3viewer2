import React, { useEffect, useState } from 'react';
import { FiCornerDownRight, FiServer } from 'react-icons/fi';
import { ChannelDto, ChannelService, ClientDto, ClientService, ServerInfoDto, ServerService } from '../api';
import { ClientList } from '../components/ClientList';

export const StatusPage = () => {
    const [clients, setClients] = useState<ClientDto[]>([])
    const [channels, setChannels] = useState<ChannelDto[]>([])
    const [server, setServer] = useState<ServerInfoDto>()

    const getClientsList = async () => {
        try {
            const clients = await ClientService.getApiV1ServerClients()
            setClients(clients)
        }
        catch (e) {
            console.error(e)
        }
    }

    const getServerInfo = async () => {
        setServer(await ServerService.getApiV1ServerInfo())
    }

    const getChannelList = async () => {
        setChannels(await ChannelService.getApiV1ServerChannels())
    }

    useEffect(() => {
        getClientsList()
        getServerInfo()
        getChannelList()
    }, [clients])

    function renderClientsList(clients: ClientDto[]) {
        return (
            <ClientList clients={clients} />
        )
    }

    function renderChannelList()
    {
        return(
            <>
                {channels.map(function (channel, index) {
                    return(
                        <>
                        <li className="border-solid py-2 border-b-2 rounded">
                        <li key={index} className="ml-2 font-semibold"><FiCornerDownRight className="mr-1" />{channel.name}</li>
                                <ul className="ml-2">
                                    {renderClientsList(clients.filter(x => x.channelId === channel.id))}
                                </ul>
                        </li>
                        </>
                    )
                })}
            </>
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
                        <div className="m-2 p-2 bg-gray-800 rounded-md w-3/4 text-left">
                            <ul className="m-4">
                                <li className="text-lg font-bold"><FiServer className="mr-1" />{server?.name} {server ? "Running for " + server.uptime : ""}</li>
                                <ul className="ml-4">
                                    {renderChannelList()}
                                </ul>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
