import React, { MouseEventHandler } from 'react';

type SubmitButtonProps = {
    value: string,
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export const SubmitButton = ({ value, onClick }: SubmitButtonProps) => {
    return (
        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 
            focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700" onClick={onClick}>
            {value}
        </button>
    )
}
