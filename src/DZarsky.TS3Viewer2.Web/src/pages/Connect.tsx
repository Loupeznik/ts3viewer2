import React from 'react';
import { Input } from '../components/forms/Input';
import { Label } from '../components/forms/Label';
import { SubmitButton } from '../components/forms/SubmitButton';

export const ConnectPage = () => {
    return (
        <div>
            <div
                className="p-4 w-full text-center bg-white border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Connect to the server</h1>
                <div className="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                    <div
                       className="w-full mt-3 md:w-1/4 bg-gray-800 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700">
                        <form>
                            <div className="flex flex-col gap-4">
                                <div className="mb-4">
                                    <Label forElement="server" value="Server" />
                                    <Input type="text" id="server" value="127.0.0.1:9987" isDisabled={ true } />
                                    <Label forElement="name" value="Username" />
                                    <Input type="text" id="name" />
                                </div>
                                <SubmitButton value="Connect" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
