import React from "react"
import { FiX } from "react-icons/fi"
import { Permission, UserInfoDto } from "../../api"
import { Input } from "./Input"
import { SubmitButton } from "./SubmitButton"

type UpdateUserFormProps = {
    user: UserInfoDto,
    onSubmit: (user: UserInfoDto) => void
    isVisible: boolean
    setVisible: (value: boolean) => void
}

export const UpdateUserForm = (props: UpdateUserFormProps) => {
    const [user, setUser] = React.useState<UserInfoDto>(props.user)

    const onFormSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()

        props.onSubmit(user)
        props.setVisible(!props.isVisible)
    }

    const updateRoles = (permission: Permission) => {
        if (user.roles?.map(role => role.permission).includes(permission)) {
            setUser({ ...user, roles: user.roles?.filter(role => role.permission !== permission) })
        } else {
            user.roles?.push({ permission: permission })
            setUser({ ...user, roles: user.roles })
        }
    }

    return (
        props.isVisible ?
            <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center shadow-lg">
                <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-600 dark:text-gray-100">
                    <span className="flex justify-end" onClick={() => props.setVisible(!props.isVisible)}>
                        <FiX className="text-xl cursor-pointer hover:text-red-500" />
                    </span>
                    <h2 className="text-xl font-semibold leading-tight tracking-wide">Update user</h2>
                    <form onSubmit={onFormSubmit}>
                        <div>
                            <label htmlFor="login" className="block my-2 text-sm font-semibold text-gray-200">Login</label>
                            <Input id="login" type="text" value={user.login!} isDisabled />
                        </div>
                        <div className="my-2 text-left">
                            <label htmlFor="permissions" className="block text-center my-2 text-sm font-semibold text-gray-200">Permissions</label>
                            {Object.values(Permission).map((permission) => {
                                return (
                                    <div>
                                        <label htmlFor={permission} className="inline-flex items-center">
                                            <input type="checkbox" name={permission} id={permission} className="h-4 w-4 border-gray-300 rounded"
                                                checked={user.roles?.map(role => role.permission).includes(permission)}
                                                onChange={() => updateRoles(permission)} />
                                            <span className="ml-2 text-sm">{permission}</span>
                                        </label>
                                    </div>
                                )
                            })
                            }
                        </div>
                        <label htmlFor="isActive" className="block my-2 text-sm font-semibold text-gray-200">Additional properties</label>
                            <input type="checkbox" name="isActive" id="isActive" className="h-4 w-4 border-gray-300 rounded"
                                checked={user.isActive} onChange={() => setUser({ ...user, isActive: !user.isActive })} />
                            <span className="ml-2 text-sm">Is active</span>
                        
                        <div className="flex flex-col gap-6 mt-6 sm:flex-row justify-end">
                            <SubmitButton value="Update" />
                        </div>
                    </form>
                </div>
            </div>
            : null
    )
}
