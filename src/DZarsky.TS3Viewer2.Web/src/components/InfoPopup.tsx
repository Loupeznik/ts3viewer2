import { FiInfo, FiX } from "react-icons/fi"

type InfoPopupProps = {
    title: string
    children: JSX.Element
    isVisible: boolean
    setVisible: (visible: boolean) => void
}

export const InfoPopup = (props: InfoPopupProps) => {
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center shadow-lg">
            <div className="flex items-center rounded shadow-md overflow-hidden max-w-xl relative bg-gray-700 text-gray-100">
                <div className="self-stretch flex items-center px-3 flex-shrink-0 bg-gray-600">
                    <FiInfo className="w-8 h-8" />
                </div>
                <div className="p-4 flex-1">
                    <h3 className="text-xl font-bold">{props.title}</h3>
                    {props.children}
                </div>
                <FiX className="absolute top-2 right-2 w-6 h-6 cursor-pointer hover:text-red-500" onClick={() => props.setVisible(!props.isVisible)} />
            </div>
        </div>
    )
}
