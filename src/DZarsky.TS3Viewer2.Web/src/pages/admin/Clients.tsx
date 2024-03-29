import { useEffect, useState } from "react"
import { ApiError, ClientDto, ClientService, ClientType, ProblemDetails, ServerGroupDto } from "../../api"
import { ClientList } from "../../components/ClientList"
import { Loader } from "../../components/Loader"
import { TextFieldPopup } from "../../components/TextFieldPopup"
import { getAppToken } from "../../helpers/TokenProvider"
import { EntityMessageProps } from "../../models/EntityMessageProps"
import toast, { Toaster } from "react-hot-toast"
import { SelectPopup } from "../../components/SelectPopup"

export const ClientsPage = () => {
    getAppToken()
    const refreshInterval = 5000
    const _serverGroupsStorageKey: string = 'api_server_groups'

    const [clients, setClients] = useState<ClientDto[]>()
    const [serverGroups, setServerGroups] = useState<ServerGroupDto[]>()
    const [messageProps, setMessageProps] = useState<EntityMessageProps<ClientDto>>({ entity: {}, isPopupVisible: false })
    const [addServerGroupProps, setAddServerGroupProps] = useState<EntityMessageProps<ClientDto>>({ entity: {}, isPopupVisible: false })

    const getClientsList = async () => {
        await ClientService.getApiV1ServerClients(true).then((response) => setClients(response))
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

    const removeClientFromGroup = async (serverGroupId: number, clientDatabaseId: number) => {
        const confirm = window.confirm(`Are you sure?`)

        if (!confirm) {
            return
        }

        await ClientService.deleteApiV1ServerClientsPermissions(clientDatabaseId, {
            serverGroupId: serverGroupId
        }).then(onFulfilled => {
            toast.success("Client removed from group")
            getClientsList()
        }, onRejected => {
            const error = onRejected as ApiError
            const body = JSON.parse(error.body) as ProblemDetails
            toast.error(`Failed to remove user from group: ${body.detail}`)
        })
    }

    const addClientToGroup = async (serverGroupId: number) => {
        await ClientService.postApiV1ServerClientsPermissions(addServerGroupProps.entity.databaseId!, {
            serverGroupId: serverGroupId
        }).then(onFulfilled => {
            toast.success("Client added to group")
            getClientsList()
        }, onRejected => {
            const error = onRejected as ApiError
            const body = JSON.parse(error.body) as ProblemDetails
            toast.error(`Failed to add user to group: ${body.detail}`)
        })
    }

    const getServerGroupsAsMap = () => {
        const map = new Map<number, string>()

        serverGroups?.forEach(x => {
            map.set(x.id!, x.name!)
        })

        return map
    }

    useEffect(() => {
        setServerGroups(JSON.parse(localStorage.getItem(_serverGroupsStorageKey)!))
        getClientsList()

        const interval = setInterval(() => {
            getClientsList()
        }, refreshInterval)

        return () => clearInterval(interval);
    }, [])

    const sortedClients = clients?.sort((a, b) => a.nickName!.localeCompare(b.nickName!))

    return (
        <div className="md:w-1/2 w-full m-auto">
            <Toaster />
            <h2 className="text-2xl font-bold m-4">Client administration</h2>
            <p className="text-lg">Connected clients</p>
            {
                clients ?
                    clients.filter(x => x.type == ClientType.FULL_CLIENT).length > 0 ?
                        <ClientList clients={sortedClients!} isAdmin={true} kickAction={kickClient} banAction={banClient}
                            messageAction={(client) => setMessageProps({ ...messageProps, entity: client, isPopupVisible: true })} serverGroups={serverGroups}
                            deleteServerGroupAction={removeClientFromGroup}
                            addServerGroupAction={(client) => setAddServerGroupProps({ ...addServerGroupProps, entity: client, isPopupVisible: true })} /> :
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
            {
                addServerGroupProps.isPopupVisible &&
                <SelectPopup title="Add server group" description="Add client to server group" onUpdate={addClientToGroup} action="Add"
                    isVisible={addServerGroupProps.isPopupVisible} label="Select group"
                    setVisible={(value: boolean) => setAddServerGroupProps({ ...addServerGroupProps, isPopupVisible: value })}
                    options={getServerGroupsAsMap()} />
            }
        </div>
    )
}
