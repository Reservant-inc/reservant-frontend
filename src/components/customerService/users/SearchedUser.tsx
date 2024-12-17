import React from 'react'
import DefaultPhoto from '../../../assets/images/user.jpg'
import { UserSearchType } from '../../../services/types'
import { getImage } from '../../../services/APIconn'
import { useNavigate } from 'react-router-dom'

interface SearchedFriendProps {
  user: UserSearchType
}

const SearchedFriend: React.FC<SearchedFriendProps> = ({ user }) => {
  const navigate = useNavigate()

  return (
    <button
      className="flex w-[60%] items-center gap-[5px] overflow-x-hidden text-sm p-2"
      onClick={() => navigate(`users/${user.userId}`)}
    >
      <img
        src={getImage(user.photo, DefaultPhoto)}
        alt="user photo"
        className="h-8 w-8 rounded-full"
      />
      <h1 className="dark:text-white">{user.firstName}</h1>
      <h1 className="dark:text-white">{user.lastName}</h1>
    </button>
  )
}

export default SearchedFriend
