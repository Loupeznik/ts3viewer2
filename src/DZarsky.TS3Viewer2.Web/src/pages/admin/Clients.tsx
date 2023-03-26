import { useEffect, useState } from "react"
import { ClientDto, ClientService, ClientType } from "../../api"
import { ClientList } from "../../components/ClientList"
import { Loader } from "../../components/Loader"
import { TextFieldPopup } from "../../components/TextFieldPopup"
import { getAppToken } from "../../helpers/TokenProvider"
import { EntityMessageProps } from "../../models/EntityMessageProps"

export const ClientsPage = () => {
    getAppToken()
    const refreshInterval = 5000
    const [clients, setClients] = useState<ClientDto[]>()
    const [messageProps, setMessageProps] = useState<EntityMessageProps<ClientDto>>({ entity: {}, isPopupVisible: false })

    const getClientsList = async () => {
        await ClientService.getApiV1ServerClients(false).then((response) => setClients(response))
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

    const sendMessage = async (message: string) => {
        if (messageProps.entity.id && message) {
            await ClientService.postApiV1ServerClientsPoke(messageProps.entity.id, {
                message: message
            }).then(() => {
                setMessageProps({ ...messageProps, isPopupVisible: false })
            })
        }
    }

    useEffect(() => {
        getClientsList()

        const interval = setInterval(() => {
            getClientsList()
        }, refreshInterval)

        return () => clearInterval(interval);
    }, [])

    const sortedClients = clients?.sort((a, b) => a.nickName!.localeCompare(b.nickName!))

    return (
        <div className="md:w-1/2 w-full m-auto">
            <h2 className="text-2xl font-bold m-4">Client administration</h2>
            <p className="text-lg">Connected clients</p>
            {
                clients ?
                    clients.filter(x => x.type == ClientType.FULL_CLIENT).length > 0 ?
                        <ClientList clients={sortedClients!} isAdmin={true} kickAction={kickClient} banAction={banClient}
                            messageAction={(client) => setMessageProps({ ...messageProps, entity: client, isPopupVisible: true })} /> :
                        <div className="m-4">
                            <p>No clients connected</p>
                        </div> :
                    <div className="m-4">
                        <Loader />
                    </div>
            }
            {
                messageProps.isPopupVisible &&
                <TextFieldPopup title="Poke client" description="Send a message via a Poke" onUpdate={sendMessage} action="Send"
                    isVisible={messageProps.isPopupVisible} label="Message"
                    setVisible={(value: boolean) => setMessageProps({ ...messageProps, isPopupVisible: value })} />
            }
        </div>
    )
}
