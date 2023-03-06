import { useEffect, useState } from "react"
import { ClientDto, ClientService, OpenAPI } from "../../api"
import { ClientList } from "../../components/ClientList"
import { Loader } from "../../components/loader"
import { getAppToken } from "../../helpers/TokenProvider"

export const ClientsPage = () => {
    getAppToken()
    const refreshInterval = 5000
    const [clients, setClients] = useState<ClientDto[]>([])

    const getClientsList = async () => {
        setClients(await ClientService.getApiV1ServerClients(true))
    }

    const kickClient = async (client: ClientDto) => {
        await ClientService.getApiV1ServerClientsKick(client.id!).then(() => {
            getClientsList()
        })
    }

    const banClient = async (client: ClientDto) => {
        await ClientService.postApiV1ServerClientsBan(client.id!).then(() => {
            getClientsList()
        })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getClientsList()
        }, refreshInterval)

        return () => clearInterval(interval);
    }, [clients])

    const sortedClients = clients.sort((a, b) => a.nickName!.localeCompare(b.nickName!))

    return (
        <div className="w-1/2 m-auto">
            <h2 className="text-2xl font-bold m-4">Client administration</h2>
            <p className="text-lg">Connected clients</p>
            {
                clients.length > 0 ?
                    <ClientList clients={sortedClients} isAdmin={true} kickAction={kickClient} banAction={banClient} /> :
                    <div className="m-4">
                        <Loader />
                    </div>
            }
        </div>
    )
}
