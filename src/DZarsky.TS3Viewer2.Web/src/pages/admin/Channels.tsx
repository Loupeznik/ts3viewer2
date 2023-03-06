import { useEffect, useState } from "react"
import { FiMessageSquare } from "react-icons/fi"
import { ChannelDto, ChannelService } from "../../api"
import { Loader } from "../../components/Loader"

export const ChannelsPage = () => {
    const [channels, setChannels] = useState<ChannelDto[]>([])

    const getChannels = async () => {
        setChannels(await ChannelService.getApiV1ServerChannels())
    }

    useEffect(() => {
        getChannels()
    }, [channels])

    const renderChannels = () => {
        return (
            <ul>
                {channels.map((channel) => {
                    return (
                        <li key={channel.id} className="bg-gray-900 p-1 mt-1 rounded font-semibold text-lg">
                            <div className="flex justify-between p-2 align-middle">
                                <div>
                                    {channel.name}
                                </div>
                                <div className="text-xl">
                                    <FiMessageSquare />
                                </div>
                            </div>

                        </li>
                    )
                })}
            </ul>
        )
    }

    return (
        <div className="w-1/2 m-auto">
            <h2 className="text-2xl font-bold m-4">Channel administration</h2>
            {
                channels.length > 0 ?
                    renderChannels() :
                    <div className="m-4">
                        <Loader />
                    </div>
            }
        </div>
    )
}
