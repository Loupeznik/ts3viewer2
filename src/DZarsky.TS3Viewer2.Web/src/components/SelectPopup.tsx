import { FiX } from "react-icons/fi"
import { InputPopupProps } from "../models/InputPopupProps"
import { SubmitButton } from "./forms/SubmitButton"
import React from "react"

export const SelectPopup = (props: InputPopupProps<number>) => {
    const [fieldValue, setFieldValue] = React.useState<number>()

    const onSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()

        if (!fieldValue) {
            return
        }

        props.onUpdate(fieldValue)
        props.setVisible(!props.isVisible)
    }

    return (
        props.isVisible ?
            <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center shadow-lg">
                <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md dark:bg-gray-600 dark:text-gray-100">
                    <span className="flex justify-end" onClick={() => props.setVisible(!props.isVisible)}>
                        <FiX className="text-xl cursor-pointer hover:text-red-500" />
                    </span>
                    <h2 className="text-xl font-semibold leading-tight tracking-wide">{props.title}</h2>
                    <p className="flex-1 text-sm dark:text-gray-400">{props.description}</p>
                    <form onSubmit={onSubmit}>
                        <div>
                            <label htmlFor="field" className="block mb-2 text-sm font-semibold text-gray-200">{props.label}</label>
                            <select id="field" className="rounded-md shadow-md dark:bg-gray-600 dark:text-gray-100" onChange={(event) => setFieldValue(parseInt(event.target.value))}>
                                {Array.from(props.options || []).map(([key, value]) => (
                                    <option key={key} value={key}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-6 mt-6 sm:flex-row justify-end">
                            <SubmitButton value={props.action} />
                        </div>
                    </form>
                </div>
            </div>
            : null
    )
}
