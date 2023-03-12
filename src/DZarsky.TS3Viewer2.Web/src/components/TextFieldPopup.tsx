import React from "react"
import { FiX } from "react-icons/fi"
import { Input } from "./forms/Input"
import { SubmitButton } from "./forms/SubmitButton"

type TextFieldPopupProps = {
    title?: string | undefined
    description?: string | undefined
    action: string
    isVisible: boolean
    label: string
    setVisible: (value: boolean) => void
    onUpdate: (value: string) => void
}

export const TextFieldPopup = (props: TextFieldPopupProps) => {
    const [fieldValue, setFieldValue] = React.useState<string>('')

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
                            <Input id="field" type="text" onChange={(event) => setFieldValue(event.target.value)} />
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
