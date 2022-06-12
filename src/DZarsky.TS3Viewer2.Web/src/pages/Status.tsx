import React, { useEffect, useState } from 'react';
import { ClientDto, ClientService } from '../api';
import { ClientList } from '../components/ClientList';

export const StatusPage = () => {
    const [clients, setClients] = useState<ClientDto[]>([])

    const getClientsList = async () => {
        try {
            const clients = await ClientService.getApiV1ServerClients()
            setClients(clients)
        }
        catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getClientsList()
    }, [])

    function renderClientsList(clients: ClientDto[]) {
        return(
            <ClientList clients={clients} />
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
                        {renderClientsList(clients)}
                    </div>
                </div>
            </div>
        </div>
    )
}
