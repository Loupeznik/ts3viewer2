import { useEffect, useState } from "react"
import { FiCircle, FiMessageSquare } from "react-icons/fi"
import { ServerInfoDto, ServerService } from "../../api"
import { getAppToken } from "../../helpers/TokenProvider"

export const ServerPage = () => {
    getAppToken()
    const [server, setServer] = useState<ServerInfoDto>()
    const [uptime, setUptime] = useState<string>()

    const getServerInfo = async () => {
        setServer(await ServerService.getApiV1ServerInfo())
    }

    const sendGlobalMessage = async () => {
        await ServerService.postApiV1ServerMessagesGlobal({
            message: "Sample message"
        })
    }

    useEffect(() => {
        getServerInfo().then(() => {
            if (server?.uptime) {
                setUptime(server.uptime)
            }
        })
    }, [])

    useEffect(() => {
        if (uptime) {
            const interval = setInterval(function () {
                const timeParts = uptime.split(":")
                let hours = parseInt(timeParts[0])
                let minutes = parseInt(timeParts[1])
                let seconds = parseInt(timeParts[2])

                seconds++

                if (seconds > 59) {
                    seconds = 0
                    minutes++
                }

                if (minutes > 59) {
                    minutes = 0
                    hours++
                }

                setUptime(("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2))
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [uptime])

    return (
        <div className="w-1/2 m-auto">
            <h2 className="text-2xl font-bold m-4">Server administration</h2>
            <div className="bg-gray-600 p-4 my-4 w-full md:w-1/2 mx-auto gap-4 justify-center rounded-lg">
                <div className="flex flex-col items-center p-8 mx-auto rounded-md sm:px-12 dark:bg-gray-900 dark:text-gray-100">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{server?.name}</h2>
                        <p className="text-gray-400">Up {uptime}</p>
                    </div>
                    <FiCircle className={server?.status == 'online' ? "w-32 h-32 p-6 text-green-400" : "w-32 h-32 p-6 text-red-400"} />
                    <div className="mb-2 text-3xl font-semibold">
                        {server?.clientsOnline} / {server?.maxClients}
                        <span className="text-sm ml-2">({server?.queriesOnline} query users)</span>
                    </div>
                    <div className="w-3/4">
                        <p className="text-gray-100 font-semibold">Available actions</p>
                        <div className="flex flex-row justify-between my-2 text-2xl">
                            <FiMessageSquare className="cursor-pointer hover:text-blue-400" title="Send global message" onClick={() => sendGlobalMessage()} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
