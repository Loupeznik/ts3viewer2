import React from 'react';
import { ClientDto, ClientType } from '../api';

type ClientListProps = {
    clients: ClientDto[],
}

export const ClientList = ({clients}: ClientListProps) => {
    const formattedList = clients.map(function (client) {
        if (client.type === ClientType._1) {
            return null
        }

        return <li>{client.nickName}</li>
    });

    return (
        <div>
            <ul>
                { formattedList }
            </ul>
        </div>
    )
}
