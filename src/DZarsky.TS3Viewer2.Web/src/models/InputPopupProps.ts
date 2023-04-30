export type InputPopupProps<T> = {
    title?: string | undefined
    description?: string | undefined
    action: string
    isVisible: boolean
    label: string
    options?: Map<number, string> | undefined
    setVisible: (value: boolean) => void
    onUpdate: (value: T) => void
}
