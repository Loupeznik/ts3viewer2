import React, { ChangeEventHandler } from 'react';

type InputProps = {
    id: string,
    value?: string,
    isDisabled?: boolean,
    type: string,
    onChange?: ChangeEventHandler<HTMLInputElement>
}

export const Input = ({ id, type, value = "", isDisabled = false, onChange }: InputProps) => {
    if (isDisabled)
    {
        return (
            <input type={ type } id={ id } className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg text-center
            bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
            dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={ value } readOnly disabled />
        )
    }

    return (
        <input type={ type } id={ id } className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg text-center
        bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 
        dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={ value } onChange={onChange}  />
    )
}
