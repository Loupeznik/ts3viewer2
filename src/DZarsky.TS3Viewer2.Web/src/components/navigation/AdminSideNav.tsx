import { FiFile, FiPhoneCall, FiServer, FiUser, FiUserCheck, FiUsers } from 'react-icons/fi';
import { checkPermissions, CurrentUserProps } from '../../helpers/UserHelper';

export const AdminSideNav = ({ username, permissions }: {
    username: CurrentUserProps['username'],
    permissions: CurrentUserProps['permissions']
}) => {
    const defaultServerPermissions = ['ServerAdmin', 'SuperAdmin']

    return (
        <div className="bg-gray-800  flex flex-row">
            <div className="flex flex-col p-3 dark:bg-gray-900 dark:text-gray-100">
                <div className="w-80">
                    <div className="flex-1">
                        <ul className="pt-2 pb-4 space-y-1 text-sm">
                            {
                                checkPermissions(permissions, defaultServerPermissions.concat(['AudioBotAdmin'])) &&
                                <li className="rounded-lg hover:bg-gray-700">
                                    <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                        <FiFile className="w-5 h-5" />
                                        <span className="font-semibold">Files</span>
                                    </a>
                                </li>
                            }
                            {
                                checkPermissions(permissions, defaultServerPermissions.concat(['ClientAdmin'])) &&
                                <li className="rounded-lg hover:bg-gray-700">
                                    <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                        <FiUsers className="w-5 h-5" />
                                        <span className="font-semibold">Clients</span>
                                    </a>
                                </li>
                            }
                            {
                                checkPermissions(permissions, defaultServerPermissions.concat(['ChannelAdmin'])) &&
                                <li className="rounded-lg hover:bg-gray-700">
                                    <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                        <FiPhoneCall className="w-5 h-5" />
                                        <span className="font-semibold">Channels</span>
                                    </a>
                                </li>
                            }
                            {
                                checkPermissions(permissions, defaultServerPermissions) &&
                                <li className="rounded-lg hover:bg-gray-700">
                                    <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                        <FiServer className="w-5 h-5" />
                                        <span className="font-semibold">Server</span>
                                    </a>
                                </li>
                            }
                            {
                                checkPermissions(permissions, ['SuperAdmin', 'ApiUserAdmin']) &&
                                <li className="rounded-lg hover:bg-gray-700">
                                    <a rel="noopener noreferrer" href="#" className="flex items-center p-2 space-x-3 rounded-md">
                                        <FiUserCheck className="w-5 h-5" />
                                        <span className="font-semibold">API users</span>
                                    </a>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="flex items-center p-2 mt-12 space-x-4 justify-center rounded-lg shadow-md dark:bg-gray-700">
                    <FiUser className="w-8 h-8" />
                    <div>
                        <h2 className="text-lg font-semibold">{username}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
