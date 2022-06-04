import React from 'react';

type LabelProps = {
    forElement: string,
    value: string
}

export const Label = ({ forElement, value }: LabelProps) => {
    return (
        <label htmlFor={forElement} className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 mt-2">
            { value }
        </label>
    )
}
