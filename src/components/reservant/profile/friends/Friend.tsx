import React, { useState } from 'react'
import { fetchDELETE, fetchPOST, getImage } from '../../../../services/APIconn'
import DefaultImage from '../../../../assets/images/user.jpg'
import { FriendListType } from '../../../../services/enums'
import { useTranslation } from 'react-i18next'
import FriendDialog from './FriendDialog'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import MessageIcon from '@mui/icons-material/Message'
import UndoIcon from '@mui/icons-material/Undo'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'

interface FriendProps {
  friend: {
    dateSent: string
    dateRead: string | null
    dateAccepted: string | null
    otherUser: {
      userId: string
      firstName: string
      lastName: string
      photo: string
    }
  }
  listType: FriendListType
  refreshFriends: () => void
}

const Friend: React.FC<FriendProps> = ({
  friend,
  listType,
  refreshFriends
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const handleOpenDialog = () => setIsDialogOpen(true)
  const handleCloseDialog = () => setIsDialogOpen(false)

  const [t] = useTranslation('global')

  const handleDeleteFriend = async () => {
    try {
      setLoading(true)
      await fetchDELETE(`/friends/${friend.otherUser.userId}`)
      refreshFriends()
      handleCloseDialog()
    } catch (error) {
      console.error('Error deleting friend:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRequest = async () => {
    try {
      setLoading(true)
      await fetchDELETE(`/friends/${friend.otherUser.userId}`)
      refreshFriends()
    } catch (error) {
      console.error('Error canceling friend request:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async () => {
    try {
      setLoading(true)
      await fetchPOST(`/friends/${friend.otherUser.userId}/accept-request`)
      refreshFriends()
    } catch (error) {
      console.error('Error accepting friend request:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRejectRequest = async () => {
    try {
      setLoading(true)
      await fetchDELETE(`/friends/${friend.otherUser.userId}`)
      refreshFriends()
    } catch (error) {
      console.error('Error rejecting friend request:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <li className="flex flex-col gap-2 p-2 rounded-lg min-h-fit dark:text-grey-2 dark:bg-black">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={getImage(friend.otherUser.photo, DefaultImage)}
            alt={`${friend.otherUser.firstName} ${friend.otherUser.lastName}`}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <span className="text-xl font-medium dark:text-white">
              {friend.otherUser.firstName} {friend.otherUser.lastName}
            </span>
            {friend.dateAccepted && listType === FriendListType.List && (
              <p className="text-sm text-grey-2">
                {t('profile.friends.friend-added')}
                {new Date(friend.dateAccepted).toLocaleDateString()}
              </p>
            )}
            {listType === FriendListType.Outgoing && (
              <p className="text-sm text-grey-2">
                {t('profile.friends.request-sent')}
                {new Date(friend.dateSent).toLocaleDateString()}
              </p>
            )}
            {listType === FriendListType.Incoming && (
              <p className="text-sm text-grey-2">
                {t('profile.friends.request-sent')}
                {new Date(friend.dateSent).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {listType === FriendListType.List && (
            <>
              <button
                id={`${friend.otherUser.firstName}${friend.otherUser.lastName}RemoveFriend`}
                onClick={handleOpenDialog}
                className="flex gap-2 items-center text-error dark:bg-black hover:text-white border-[1px] text-sm px-2 py-1 rounded-lg bg-white border-eror text-error transition hover:scale-105 hover:bg-error hover:text-white"
                disabled={loading}
              >
                <PersonRemoveIcon className="text-sm" />
                {t('profile.friends.remove-friend-button')}
              </button>
              <button
                id={`${friend.otherUser.firstName}${friend.otherUser.lastName}MessageFriend`}
                className="flex gap-2 items-center text-primary dark:bg-black hover:text-white border-[1px] text-sm px-2 py-1 rounded-lg bg-white border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white"
              >
                <MessageIcon className="text-sm" />
                {t('profile.friends.message-friend-button')}
              </button>
            </>
          )}
          {listType === FriendListType.Outgoing && (
            <button
              id={`${friend.otherUser.firstName}${friend.otherUser.lastName}RemoveOutgoingRequest`}
              onClick={handleCancelRequest}
              className="flex items-center gap-2 bg-white border-[1px] text-sm px-2 py-1 rounded-lg bg-grey-0 border-primary text-primary transition hover:scale-105 hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black dark:border-secondary dark:text-secondary dark:bg-black"
              disabled={loading}
            >
              <UndoIcon className="text-sm" />
              {t('profile.friends.revoke-outgoing-request')}
            </button>
          )}
          {listType === FriendListType.Incoming && (
            <>
              <button
                id={`${friend.otherUser.firstName}${friend.otherUser.lastName}AcceptIncomingRequest`}
                onClick={handleAcceptRequest}
                className="flex items-center gap-2 border-[1px] text-sm px-2 py-1 rounded-lg border-green text-green transition hover:scale-105 hover:bg-green hover:text-white"
                disabled={loading}
              >
                <CheckIcon className="text-sm" />
                {t('profile.friends.accept-incoming-request')}
              </button>
              <button
                id={`${friend.otherUser.firstName}${friend.otherUser.lastName}DeclineIncomingRequest`}
                onClick={handleRejectRequest}
                className="border-[1px] text-sm px-2 py-1 rounded-lg border-error text-error transition hover:scale-105 hover:bg-error hover:text-white"
                disabled={loading}
              >
                <ClearIcon className="text-sm" />
                {t('profile.friends.decline-incoming-request')}
              </button>
            </>
          )}
        </div>
      </div>
      <FriendDialog
        isOpen={isDialogOpen}
        friendName={`${friend.otherUser.firstName} ${friend.otherUser.lastName}`}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteFriend}
      />
    </li>
  )
}

export default Friend
