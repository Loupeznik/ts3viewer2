import { FiCheckCircle, FiEdit, FiTrash } from "react-icons/fi"
import { UserInfoDto } from "../api"

type UserTableProps = {
    users: UserInfoDto[]
    onEdit: (user: UserInfoDto) => void
    onDelete: (user: UserInfoDto) => void
}

export const UserTable = (props: UserTableProps) => {
    return (
        <div className="container p-2 mx-auto sm:p-4 text-gray-100">
            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full rounded-lg">
                    <thead className="dark:bg-gray-600">
                        <tr>
                            <th className="p-3">Login</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Roles</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.users.map(function (user) {
                            return (
                                <tr className="border-b border-opacity-40 border-gray-200 bg-gray-900" key={user.id}>
                                    <td className="p-3">
                                        <p>{user.login}</p>
                                    </td>
                                    <td className="p-3" >
                                        <p>{user.isActive ? 'Active' : 'Inactive'}</p>
                                    </td>
                                    <td className="p-3">
                                        <p>{user.type}</p>
                                    </td>
                                    <td className="px-3 py-2">
                                        <ul>
                                            {user.roles?.map(function (role) {
                                                return (
                                                    <li className="py-1 text-left" key={role.id?.toString()}>
                                                        <FiCheckCircle className="mr-1" /> {role.permission}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-row text-lg justify-center">
                                            <FiEdit className="mx-1 hover:text-blue-400 cursor-pointer" onClick={() => props.onEdit(user)} />
                                            <FiTrash className="mx-1 hover:text-red-400 cursor-pointer" onClick={() => props.onDelete(user)} />
                                        </div>
                                    </td>
                                </tr>
                            )
                        }) ?? (
                                <tr className="border-b border-opacity-20 dark:border-gray-700 dark:bg-gray-900">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <td key={index} className="p-3">
                                            <p>-</p>
                                        </td>
                                    ))}
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
