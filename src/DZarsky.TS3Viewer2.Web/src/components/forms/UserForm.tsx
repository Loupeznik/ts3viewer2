import React from "react"
import { FiInfo, FiX } from "react-icons/fi"
import { Permission, UserDto, UserInfoDto } from "../../api"
import { InfoPopup } from "../InfoPopup"
import { Input } from "./Input"
import { PermissionSelect } from "./PermissionSelect"
import { SubmitButton } from "./SubmitButton"

export enum FormType {
    Update,
    Register
}

type UserFormProps = {
    user: UserInfoDto,
    onSubmit: (user: UserInfoDto | UserDto) => void
    isVisible: boolean
    setVisible: (value: boolean) => void
    isFromAdmin: boolean
    type: FormType
}

export const UserForm = (props: UserFormProps) => {
    const [user, setUser] = React.useState<UserInfoDto>(props.user)
    const [userToCreate, setUserToCreate] = React.useState<UserDto>({})
    const [isHelpPopupVisible, setIsHelpPopupVisible] = React.useState<boolean>(false)

    const onFormSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()

        if (props.type === FormType.Register) {
            props.onSubmit(userToCreate)
        } else {
            props.onSubmit(user)
        }

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

    const renderUpdateForm = () => {
        return (
            <>
                <h2 className="text-xl font-semibold leading-tight tracking-wide">Update user</h2>
                <form onSubmit={onFormSubmit}>
                    <div>
                        <label htmlFor="login" className="block my-2 text-sm font-semibold text-gray-200">Login</label>
                        <Input id="login" type="text" value={user.login!} isDisabled />
                    </div>
                    <PermissionSelect user={user} updateRoles={updateRoles} />
                    <label htmlFor="isActive" className="block my-2 text-sm font-semibold text-gray-200">Additional properties</label>
                    <input type="checkbox" name="isActive" id="isActive" className="h-4 w-4 border-gray-300 rounded"
                        checked={user.isActive} onChange={() => setUser({ ...user, isActive: !user.isActive })} />
                    <span className="ml-2 text-sm">Is active</span>
                    <div className="flex flex-col gap-6 mt-6 sm:flex-row justify-end">
                        <SubmitButton value="Update" />
                    </div>
                </form>
            </>

        )
    }

    const renderRegisterForm = () => {
        return (
            <>
                <h2 className="text-xl font-semibold leading-tight tracking-wide">Create user</h2>
                <form onSubmit={onFormSubmit}>
                    <div>
                        <label htmlFor="login" className="block my-2 text-sm font-semibold text-gray-200">
                            Login {props.isFromAdmin ? '' : '(your TeamSpeakID)'}
                        </label>
                        <Input id="login" type="text" onChange={(event) => setUserToCreate({ ...userToCreate, login: event.target.value })} />
                    </div>
                    <div>
                        <label htmlFor="password" className="block my-2 text-sm font-semibold text-gray-200">Password</label>
                        <Input id="password" type="password" onChange={(event) => setUserToCreate({ ...userToCreate, secret: event.target.value })} />
                    </div>
                    {props.isFromAdmin && <PermissionSelect user={user} updateRoles={updateRoles} />}
                    <div className="flex flex-col gap-6 mt-6 sm:flex-row justify-end">
                        <SubmitButton value="Register" />
                    </div>
                </form>
            </>
        )
    }

    return (
        props.isVisible ?
            <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center shadow-lg">
                <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-gray-600 text-gray-100">
                    <div className={`flex flex-row ${props.isFromAdmin ? 'justify-end' : 'justify-between'}`}>
                        {!props.isFromAdmin &&
                            <span className="flex" onClick={() => setIsHelpPopupVisible(!isHelpPopupVisible)}>
                                <FiInfo className="text-xl cursor-pointer hover:text-blue-500" />
                            </span>
                        }
                        <span className="flex" onClick={() => props.setVisible(!props.isVisible)}>
                            <FiX className="text-xl cursor-pointer hover:text-red-500" />
                        </span>
                    </div>
                    {props.type === FormType.Update ? renderUpdateForm() : renderRegisterForm()}
                </div>
                {isHelpPopupVisible && <InfoPopup title="Register"
                    isVisible={isHelpPopupVisible} setVisible={setIsHelpPopupVisible} >
                    <p className="text-sm mt-2 text-left">
                        Enter your TeamSpeakID as login and choose your password.
                        Your TeamSpeakID can be found under <i>Identities</i> and <i>Unique ID</i> in your TeamSpeak client.
                    </p>
                </InfoPopup>}
            </div>
            : null
    )
}
