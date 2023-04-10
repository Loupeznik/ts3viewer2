import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UserDto } from '../api';
import { Login } from '../components/Login';
import { AdminSideNav } from '../components/navigation/AdminSideNav';
import { revokeToken } from '../helpers/TokenProvider';
import { CurrentUserProps, getCurrentUser, signIn } from '../helpers/UserHelper';
import { getServerGroups } from '../helpers/ServerHelpers';

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

    const onLogin = async ({ login, secret }: UserDto) => {
        if (!login || !secret) {
            return
        }

        let success = await signIn({ login, secret })
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

    if (authenticated) {
        getServerGroups()
    }

    const onLogout = () => {
        revokeToken()
        setAuthenticated(false)
    }

    return (
        <div>
            <div
                className="p-4 w-full text-center sm:p-8 bg-gray-800">
                <h1 className="mb-2 text-3xl font-bold text-white">Administration</h1>
                <div className="flex md:flex-row flex-col bg-gray-700 px-4 py-2.5 mt-3 text-white rounded-lg">
                    <AdminSideNav username={currentUser.username} permissions={currentUser.permissions} onLogout={onLogout} />
                    <div className="mx-auto w-full md:w-screen">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
