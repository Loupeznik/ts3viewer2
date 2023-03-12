import React from "react"
import toast, { Toaster } from "react-hot-toast"
import { ApiError, ProblemDetails, UserDto, UserService } from "../api"
import { getAppToken } from "../helpers/TokenProvider"
import { Input } from "./forms/Input"
import { FormType, UserForm } from "./forms/UserForm"
import { Loader } from "./Loader"

type LoginProps = {
    onLogin: ({ login, secret }: UserDto) => void,
}

export const Login = ({ onLogin }: LoginProps) => {
    getAppToken()
    const [username, setUsername] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')
    const [isRegisterPopupVisible, setIsRegisterPopupVisible] = React.useState<boolean>(false)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onLogin({ login: username, secret: password });
    }

    const handleRegistration = async (user: UserDto) => {
        if (!user.login || !user.secret) {
            toast.error('Username and password are required')
            return
        }

        setIsLoading(true)

        await UserService.postApiV1Users(user).then(onFulfilled => {
            setIsLoading(false)
            onLogin(user)
        }).catch(onRejected => {
            const error = onRejected as ApiError
            const body = JSON.parse(error.body) as ProblemDetails
            toast.error(`Failed to register: ${body.detail}`)
        })
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Toaster />
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Username</label>
                    <Input id="username" type="text" onChange={(event) => setUsername(event.target.value)} />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Password</label>
                    <Input id="password" type="password" onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">Login</button>
                    <button
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border 
                        border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                        focus-visible:ring-blue-500" onClick={() => setIsRegisterPopupVisible(!isRegisterPopupVisible)}>Register</button>
                </div>
            </form>
            {isRegisterPopupVisible && <UserForm user={{}} onSubmit={(user) => handleRegistration(user as UserDto)}
                isVisible={isRegisterPopupVisible} setVisible={setIsRegisterPopupVisible} isFromAdmin={false}
                type={FormType.Register} />
            }
            {isLoading &&
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                    <Loader />
                </div>
            }
        </div>
    )
}
