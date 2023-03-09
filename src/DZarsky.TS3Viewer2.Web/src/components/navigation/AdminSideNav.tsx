import { FiFile, FiLogOut, FiPhoneCall, FiServer, FiUser, FiUserCheck, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { checkPermissions, CurrentUserProps } from '../../helpers/UserHelper';

export const AdminSideNav = ({ username, permissions, onLogout }: {
    username: CurrentUserProps['username'],
    permissions: CurrentUserProps['permissions']
    onLogout: () => void
}) => {
    const defaultServerPermissions = ['ServerAdmin', 'SuperAdmin']

    return (
        <div className="flex flex-col p-3 dark:bg-gray-900 dark:text-gray-100 rounded">
            <div className="w-80">
                <div className="flex-1">
                    <ul className="pt-2 pb-4 space-y-1 text-sm">
                        {
                            checkPermissions(permissions, defaultServerPermissions.concat(['AudioBotAdmin'])) &&
                            <li className="rounded-lg hover:bg-gray-700">
                                <Link to="/admin/files" className="flex items-center p-2 space-x-3 rounded-md">
                                    <FiFile className="w-5 h-5" />
                                    <span className="font-semibold">Files</span>
                                </Link>
                            </li>
                        }
                        {
                            checkPermissions(permissions, defaultServerPermissions.concat(['ClientAdmin'])) &&
                            <li className="rounded-lg hover:bg-gray-700">
                                <Link to="/admin/clients" className="flex items-center p-2 space-x-3 rounded-md">
                                    <FiUsers className="w-5 h-5" />
                                    <span className="font-semibold">Clients</span>
                                </Link>
                            </li>
                        }
                        {
                            checkPermissions(permissions, defaultServerPermissions.concat(['ChannelAdmin'])) &&
                            <li className="rounded-lg hover:bg-gray-700">
                                <Link to="/admin/channels" className="flex items-center p-2 space-x-3 rounded-md">
                                    <FiPhoneCall className="w-5 h-5" />
                                    <span className="font-semibold">Channels</span>
                                </Link>
                            </li>
                        }
                        {
                            checkPermissions(permissions, defaultServerPermissions) &&
                            <li className="rounded-lg hover:bg-gray-700">
                                <Link to="/admin/server" className="flex items-center p-2 space-x-3 rounded-md">
                                    <FiServer className="w-5 h-5" />
                                    <span className="font-semibold">Server</span>
                                </Link>
                            </li>
                        }
                        {
                            checkPermissions(permissions, ['SuperAdmin', 'ApiUserAdmin']) &&
                            <li className="rounded-lg hover:bg-gray-700">
                                <Link to="/admin/users" className="flex items-center p-2 space-x-3 rounded-md">
                                    <FiUserCheck className="w-5 h-5" />
                                    <span className="font-semibold">API users</span>
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
            <div className="flex items-center p-2 mt-12  justify-between rounded-lg shadow-md dark:bg-gray-700">
                <div className="flex flex-row space-x-2">
                    <FiUser className="w-8 h-8" />
                    <div>
                        <h2 className="text-lg font-semibold">{username}</h2>
                    </div>
                </div>
                <div className="hover:text-red-400 cursor-pointer mx-2">
                    <FiLogOut className="w-8 h-8" onClick={onLogout} /> Logout
                </div>
            </div>
        </div>
    )
}
