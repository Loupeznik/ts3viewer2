import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { FiPlusCircle } from "react-icons/fi"
import { ApiError, ProblemDetails, UserDto, UserInfoDto, UserService } from "../../api"
import { FormType, UserForm } from "../../components/forms/UserForm"
import { Loader } from "../../components/Loader"
import { UserTable } from "../../components/UserTable"
import { EntityMessageProps } from "../../models/EntityMessageProps"

export const UsersPage = () => {
    const [users, setUsers] = useState<UserInfoDto[]>()
    const [updateUserProps, setUpdateUserProps] = useState<EntityMessageProps<UserInfoDto>>({ entity: {}, isPopupVisible: false })
    const [isAddUserPopupVisible, setIsAddUserPopupVisible] = useState<boolean>(false)

    const getUsers = async () => {
        await UserService.getApiV1Users().then((response) => {
            setUsers(response)
        })
    }

    const deleteUser = async (user: UserInfoDto) => {
        const confirm = window.confirm(`Are you sure you want to delete user ${user.login}?`)

        if (!user.id || !confirm) {
            return
        }

        await UserService.deleteApiV1Users(user.id).then(onFulfilled => {
            toast.success(`User ${user.login} deleted`)
            setUsers(users?.filter((u) => u.id !== user.id))
        }, onRejected => {
            const error = onRejected as ApiError
            const body = JSON.parse(error.body) as ProblemDetails
            toast.error(`Failed to delete user: ${body.detail}`)
        })
    }

    const updateUser = async (user: UserInfoDto) => {
        if (!user.id) {
            return
        }

        await UserService.putApiV1Users(user.id, user).then(() => {
            getUsers()
        })
    }

    const addUser = async (user: UserDto) => {
        if (!user.login || !user.secret || !user.permissions?.length) {
            toast.error('Login, password and permissions are required')
            return
        }

        await UserService.postApiV1Users(user).then(onFulfilled => {
            toast.success(`User ${user.login} created`)
            getUsers()
        }, onRejected => {
            const error = onRejected as ApiError
            const body = JSON.parse(error.body) as ProblemDetails
            toast.error(`Failed to create user: ${body.detail}`)
        })
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="md:w-3/4 w-full m-auto">
            <Toaster />
            <h2 className="text-2xl font-bold m-4">User administration</h2>
            <div className="text-xl md:w-1/4 w-3/4 ml-4 my-1 p-1 bg-gray-800 rounded-lg cursor-pointer hover:bg-blue-500" 
                onClick={() => setIsAddUserPopupVisible(!isAddUserPopupVisible)}>
                <FiPlusCircle className="w-8 h-8" /> Add user
            </div>
            {
                users?.length ?
                    <UserTable users={users} onEdit={(user) => { setUpdateUserProps({ entity: user, isPopupVisible: true }) }}
                        onDelete={(user) => deleteUser(user)} /> :
                    <div className="m-4">
                        <Loader />
                    </div>
            }
            {updateUserProps.isPopupVisible && <UserForm user={updateUserProps.entity}
                setVisible={(value) => setUpdateUserProps({ ...updateUserProps, isPopupVisible: value })} isVisible={updateUserProps.isPopupVisible}
                onSubmit={updateUser} isFromAdmin={true} type={FormType.Update} />}
            {isAddUserPopupVisible && <UserForm user={{}}
                setVisible={setIsAddUserPopupVisible} isVisible={isAddUserPopupVisible}
                onSubmit={addUser} isFromAdmin={true} type={FormType.Register} />}
        </div>
    )
}
