import { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { FileDto, FileService, SongDto } from "../../api";
import { getAppToken } from "../../helpers/TokenProvider";

export const FilesPage = () => {
    getAppToken()
    const [files, setFiles] = useState<FileDto[]>([]);

    useEffect(() => {
        getSongList()
    }, [])

    const deleteFile = async (file: FileDto) => {
        if (!file.fullName) {
            return
        }

        await FileService.deleteApiV1Files(file.fullName).then(() => {
            getSongList()
        })
    }

    async function getSongList() {
        const songs = await FileService.getApiV1Files()

        setFiles(songs)
    }

    const renderSongs = files?.map(function (file, index) {
        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap uppercase font-semibold">
                    {file.name}
                </th>
                <td>
                    <FiEdit className="cursor-pointer hover:text-blue-400 text-2xl" />
                    <FiTrash className="cursor-pointer hover:text-red-400 text-2xl" onClick={() => deleteFile(file)} />
                </td>
            </tr>
        )
    });

    return (
        <div className="w-3/4 m-auto">
            <h2 className="text-2xl font-bold m-4">Files administration</h2>
            <div className="bg-gray-600 p-4 my-4 w-full md:w-1/2 mx-auto gap-4 justify-center rounded-lg">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 text-center">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Song name
                                </th>
                                <th>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderSongs}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
