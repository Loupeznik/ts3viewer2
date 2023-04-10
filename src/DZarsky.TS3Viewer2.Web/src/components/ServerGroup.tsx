import { FiX } from "react-icons/fi"
import { ServerGroupDto } from "../api"

type ServerGroupProps = {
    serverGroup: ServerGroupDto,
    clientdDatabaseId: number,
    onDelete: (serverGroupId: number, clientDatabaseId: number) => void
}

export const ServerGroup = (props: ServerGroupProps) => {
    return (
        <div className="relative inline-flex items-center justify-center md:w-6 md:h-6 w-4 h-4 overflow-hidden rounded-full bg-gray-600 select-none">
            <span className="font-bold md:text-md text-xs text-gray-300" title={props.serverGroup.name!}>
                {props.serverGroup.name?.split(" ").map(x => x[0]).join("")}
            </span>
            {
                props.serverGroup.name === "Guest" ? null :
                    <FiX className="absolute md:right-1.5 md:bottom-1.5 md:w-3 md:h-3 w-2 h-2 rounded-full opacity-0 hover:opacity-100 cursor-pointer bg-red-500"
                        onClick={() => props.onDelete(props.serverGroup.id!, props.clientdDatabaseId)} title={`Remove client from group ${props.serverGroup.name}`} />
            }
        </div>
    )
}
