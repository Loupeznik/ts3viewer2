import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { ApiError, ProblemDetails, UserInfoDto, UserService } from "../../api"
import { FormType, UserForm } from "../../components/forms/UserForm"
import { Loader } from "../../components/Loader"
import { UserTable } from "../../components/UserTable"
import { EntityMessageProps } from "../../models/EntityMessageProps"

export const UsersPage = () => {
    const [users, setUsers] = useState<UserInfoDto[]>()
    const [updateUserProps, setUpdateUserProps] = useState<EntityMessageProps<UserInfoDto>>({ entity: {}, isPopupVisible: false })

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

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="w-3/4 m-auto">
            <Toaster />
            <h2 className="text-2xl font-bold m-4">User administration</h2>
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
        </div>
    )
}
