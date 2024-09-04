import React from 'react'
import { ThreadType } from '../../../../services/types'
import { Tooltip } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";


interface threadProps {
    thread: ThreadType,
    handleThreadMaximize: Function,
    renderUserPhotos: Function
}

const thread: React.FC<threadProps> = ({ thread, handleThreadMaximize, renderUserPhotos}) => {
    return (
        <Tooltip 
        title={`${thread.title}`} 
        placement="left" 
        arrow
        >
            <div key={thread.threadId} className="relative group flex items-center justify-center">
                <button onClick={() => handleThreadMaximize(thread)}>
                    {renderUserPhotos(thread)}
                </button>  
                <button className="absolute right-0 top-0 hidden group-hover:flex bg-black text-white rounded-full w-4 h-4 justify-center items-center p-0">
                    <CloseIcon className="h-3 w-3 p-0"/>
                </button>
            </div>
        </Tooltip>
    )
}

export default thread