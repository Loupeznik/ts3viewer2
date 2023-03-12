import { Permission, UserInfoDto } from "../../api";

type PermissionSelectProps = {
    user: UserInfoDto,
    updateRoles: (permission: Permission) => void
}

export const PermissionSelect = (props: PermissionSelectProps) => {
    return (
        <div className="my-2 text-left">
            <label htmlFor="permissions" className="block text-center my-2 text-sm font-semibold text-gray-200">Permissions</label>
            {Object.values(Permission).map((permission) => {
                return (
                    <div>
                        <label htmlFor={permission} className="inline-flex items-center">
                            <input type="checkbox" name={permission} id={permission} className="h-4 w-4 border-gray-300 rounded"
                                checked={props.user.roles?.map(role => role.permission).includes(permission)}
                                onChange={() => props.updateRoles(permission)} />
                            <span className="ml-2 text-sm">{permission}</span>
                        </label>
                    </div>
                )
            })
            }
        </div>
    )
}
