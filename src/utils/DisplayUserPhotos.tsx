import React from 'react'
import { getImage } from '../services/APIconn'
import { ThreadType } from '../services/types'
import DefaultPhoto from '../assets/images/user.jpg'

const renderUserPhotos = (thread: ThreadType) => {
  return thread.participants.length > 1 ? (
    <div className="relative h-10 w-10">
      <div className="absolute right-0 top-0 z-[0] flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-black">
        <img
          src={getImage(thread.participants[0].photo, DefaultPhoto)}
          className="absolute h-7 w-7 rounded-full"
        />
      </div>
      <div className="absolute bottom-0 left-0 z-[1] flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-black">
        <img
          src={getImage(thread.participants[1].photo, DefaultPhoto)}
          className="absolute h-7 w-7 rounded-full"
        />
      </div>
    </div>
  ) : (
    <div className="flex h-10 w-10 items-center justify-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-black">
        <img
          src={getImage(thread.participants[0].photo, DefaultPhoto)}
          className="h-9 w-9 rounded-full"
        />
      </div>
    </div>
  )
}

export default renderUserPhotos
