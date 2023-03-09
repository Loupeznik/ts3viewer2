import { useEffect, useState } from "react"
import { FiMessageSquare } from "react-icons/fi"
import { ChannelDto, ChannelService } from "../../api"
import { Loader } from "../../components/Loader"
import { TextFieldPopup } from "../../components/TextFieldPopup"
import { getAppToken } from "../../helpers/TokenProvider"
import { EntityMessageProps } from "../../models/EntityMessageProps"

export const ChannelsPage = () => {
    getAppToken()
    const [channels, setChannels] = useState<ChannelDto[]>([])
    const [messageProps, setMessageProps] = useState<EntityMessageProps<ChannelDto>>({ entity: {}, isPopupVisible: false })

    const getChannels = async () => {
        await ChannelService.getApiV1ServerChannels().then((response) => setChannels(response))
    }

    const sendMessage = async (message: string) => {
        if (messageProps.entity.id && message) {
            await ChannelService.postApiV1ServerChannelsMessage(messageProps.entity.id, {
                message: message
            }).then(() => {
                setMessageProps({...messageProps, isPopupVisible: false})
            })
        }
    }

    useEffect(() => {
        getChannels()
    }, [])

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
                                    <FiMessageSquare className="mr-2 hover:text-blue-400 cursor-pointer" title="Send a message to the channel" 
                                        onClick={() => setMessageProps({entity: channel, isPopupVisible: true})} />
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
            {
                messageProps.isPopupVisible &&
                <TextFieldPopup title="Send message to channel" onUpdate={sendMessage} action="Send"
                    isVisible={messageProps.isPopupVisible} label="Message"
                    setVisible={(value: boolean) => setMessageProps({ ...messageProps, isPopupVisible: value })} />
            }
        </div>
    )
}
