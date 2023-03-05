import React, { useEffect, useState } from 'react';
import { UserDto } from '../api';
import { Login } from '../components/Login';
import { AdminSideNav } from '../components/navigation/AdminSideNav';
import { CurrentUserProps, getCurrentUser, signIn } from '../helpers/UserHelper';

export const AdminPage = () => {
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<CurrentUserProps>({} as CurrentUserProps)

    const checkUser = () => {
        const user = getCurrentUser()
        
        if (!user.isValid) {
            return
        }

        setCurrentUser(user)
        setAuthenticated(true)
    }

    const onLogin = async ({login, secret}: UserDto) => {
        if (!login || !secret) {
            return
        }

        let success = await signIn({login, secret})
        if (!success) {
            return
        }

        checkUser()
    }

    if (!authenticated) {
        checkUser()

        return (
            <>
                <Login onLogin={onLogin} />
            </>
        )
    }

    return (
        <div>
            <div
                className="p-4 w-full text-center bg-white border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Server administration</h1>
                <AdminSideNav username={currentUser.username} permissions={currentUser.permissions}  />
            </div>
        </div>
    )
}
