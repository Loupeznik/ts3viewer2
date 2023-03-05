import React from "react"
import { UserDto } from "../api"
import { Input } from "./forms/Input"

type LoginProps = {
    onLogin: ({login, secret}: UserDto) => void,
}

export const Login = ({ onLogin }: LoginProps) => {
    const [username, setUsername] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onLogin({ login: username, secret: password });
    }

    return (
        <div className="flex items-center justify-center h-screen">
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
                </div>
            </form>
        </div>
    )
}
