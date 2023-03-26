import React from 'react';
import { Link } from 'react-router-dom';

type LinkProps = {
    url: string,
    name: string,
    isActive: boolean
}

export const NavLink = (props: LinkProps) => {
    return (
        <li>
            <Link to={props.url}
                className={`block py-2 pr-4 pl-3 border-b md:border-0 border-gray-100 md:hover:bg-transparent md:p-0
                        hover:bg-gray-700 hover:text-white md:hover:bg-transparent border-gray-700 
                        font-semibold ${props.isActive ? 'font-bolder text-white border-white border-b-2' : 'text-gray-400 '}`}>
                {props.name}
            </Link>
        </li>
    )
}
