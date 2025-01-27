import React, { useContext, useEffect, useState, useRef } from 'react'
import OutsideClickHandler from '../../../../reusableComponents/OutsideClickHandler'
import CommentRoundedIcon from '@mui/icons-material/CommentRounded'
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded'
import { fetchGET, fetchPOST } from '../../../../../services/APIconn'
import {
  FriendData,
  PaginationType,
  ThreadType,
  UserType
} from '../../../../../services/types'
import { Button, CircularProgress, List } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ThreadPreview from './ThreadPreview'
import SearchIcon from '@mui/icons-material/Search'
import { FetchError } from '../../../../../services/Errors'
import { useTranslation } from 'react-i18next'
import FriendSelector from '../../../../reusableComponents/FriendSelector'
import renderUserPhotos from '../../../../../utils/DisplayUserPhotos'
import { ThreadContext } from '../../../../../contexts/ThreadContext'
import { ThreadScope } from '../../../../../services/enums'
import PrivateThreadPreview from './PrivateThreadPreview'

const Threads: React.FC = () => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [isLoadingThreads, setIsLoadingThreads] = useState<boolean>(false)
  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false)
  const [threadTitle, setThreadTitle] = useState<string>()
  const [threads, setThreads] = useState<ThreadType[]>([])
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [friendsToAdd, setFriendsToAdd] = useState<UserType[]>([])
  const [option, setOption] = useState<ThreadScope>(ThreadScope.Private)
  const [friends, setFriends] = useState<FriendData[]>([])

  const apiBase = '/user/threads'
  const pageQuery = `page=${page}`

  const apiRoute: Record<ThreadScope, string> = {
    [ThreadScope.Private]: `?type=Private&`,
    [ThreadScope.Normal]: `?type=Normal&`,
    [ThreadScope.Event]: `?type=Event&`,
    [ThreadScope.Report]: `?type=Report&`
  }

  const { handleThreadOpen } = useContext(ThreadContext)

  const [t] = useTranslation('global')

  const scrollableDivRef = useRef<HTMLDivElement>(null)

  const clearStates = () => {
    setThreadTitle('')
    setFriendsToAdd([])
  }

  const pressHandler = () => {
    if (isPressed) {
      setIsCreatingThread(false)
      clearStates()
    }

    setIsPressed(!isPressed)
  }

  const getFriends = async () => {
    try {
      const response: PaginationType = await fetchGET('/friends')
      const data: FriendData[] = response.items as unknown as FriendData[]
      setFriends(data)
    } catch (error) {
      console.error('Error fetching friends:', error)
    }
  }

  const getThreads = async () => {
    try {
      const result: PaginationType = await fetchGET(
        `${apiBase}${apiRoute[option]}${pageQuery}`
      )
      const newThreads = result.items as ThreadType[]

      if (newThreads.length < 10) {
        setHasMore(false)
      } else {
        setPage(prevPage => prevPage + 1)
      }

      if (page > 0) setThreads(prevThreads => [...prevThreads, ...newThreads])
      else setThreads(newThreads)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error:', error)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollableDivRef.current || !hasMore) return

      const { scrollTop, scrollHeight, clientHeight } = scrollableDivRef.current
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setPage(prevPage => prevPage + 1)
      }
    }

    const div = scrollableDivRef.current
    if (div) div.addEventListener('scroll', handleScroll)

    return () => {
      if (div) div.removeEventListener('scroll', handleScroll)
    }
  }, [hasMore])

  useEffect(() => {
    if (option != ThreadScope.Private) {
      getThreads()
    }
  }, [page])

  useEffect(() => {
    setPage(0)

    if (option == ThreadScope.Private) {
      setHasMore(false)
      getFriends()
    } else {
      setHasMore(true)
      getThreads()
    }
  }, [option, isPressed])

  const toggleCreatingThread = () => {
    if (isCreatingThread) {
      clearStates()
    }
    setIsCreatingThread(!isCreatingThread)
  }

  const postThread = async () => {
    try {
      const ids = friendsToAdd.map(friend => {
        return friend.userId
      })

      const isGroupThread = friendsToAdd.length > 1

      const values = isGroupThread
        ? { title: threadTitle, participantIds: ids }
        : { otherUserId: ids[0] }

      const api = isGroupThread ? '/threads' : '/threads/create-private-thread'

      fetchPOST(api, JSON.stringify(values))

      setTimeout(() => {
        getThreads()
      }, 500)
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error:', error)
      }
    } finally {
      toggleCreatingThread()
      getThreads()
    }
  }

  const handleOptionChange = (option: ThreadScope) => {
    setPage(0)
    setThreads([])
    setOption(option)
  }

  const renderPrivateThreadsContent = () => {
    return (
      <List className="h-full w-full p-0">
        <div
          className="h-full overflow-y-auto scroll"
          id="scrollableDiv"
          ref={scrollableDivRef}
        >
          {friends.map(friend => (
            <PrivateThreadPreview
              key={friend.otherUser.userId}
              friend={friend}
              getFriends={() => {
                setHasMore(false)
                getFriends()
              }}
              handleThreadOpen={handleThreadOpen}
              pressHandler={pressHandler}
            />
          ))}
          {!hasMore && (
            <div className="flex w-full justify-center p-2">
              <h1 className="text-grey-2 text-sm">{t('threads.no-more')}</h1>
            </div>
          )}
        </div>
      </List>
    )
  }

  const renderThreadsContent = () => {
    return (
      <List className="h-full w-full p-0">
        <div
          className="h-full overflow-y-auto scroll"
          id="scrollableDiv"
          ref={scrollableDivRef}
        >
          {threads.map(thread => (
            <ThreadPreview
              key={thread.threadId}
              thread={thread}
              renderUserPhotos={renderUserPhotos}
              handleThreadOpen={handleThreadOpen}
              pressHandler={pressHandler}
            />
          ))}
          {hasMore && (
            <div className="flex w-full justify-center">
              <CircularProgress className="text-grey-2" />
            </div>
          )}
          {!hasMore && (
            <div className="flex w-full justify-center p-2">
              <h1 className="text-grey-2 text-sm">{t('threads.no-more')}</h1>
            </div>
          )}
        </div>
      </List>
    )
  }

  const inputClass = 'clean-input py-1 px-0 text-sm italic dark:text-white'

  const renderNewThreadForm = () => (
    <div className="flex w-full flex-col border-y-[2px] border-grey-1 px-3 pt-2 dark:border-grey-5">
      <div className="flex items-center justify-between">
        <h1 className="font-mont-bd text-lg dark:text-grey-1">
          {t('threads.new-thread')}
        </h1>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-grey-1 dark:bg-grey-5"
          disabled={
            (friendsToAdd.length > 1 && threadTitle === undefined) ||
            friendsToAdd.length === 0
          }
          onClick={postThread}
        >
          <CheckIcon className="h-5 w-5 dark:text-grey-1" />
        </button>
      </div>
      {friendsToAdd.length > 1 && (
        <div className="flex items-center gap-2 pb-1 pt-2">
          <h1 className="font-mont-md text-sm dark:text-grey-1">
            {t('threads.title')}:
          </h1>
          <input
            type="text"
            className={inputClass + ' w-full'}
            value={threadTitle}
            onChange={e => setThreadTitle(e.target.value)}
          />
        </div>
      )}
      <FriendSelector
        friendsToAdd={friendsToAdd}
        setFriendsToAdd={setFriendsToAdd}
      />
    </div>
  )

  return (
    <div>
      <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
        <Button
          id="navbarThreadsButton"
          className={`relative flex h-[40px] w-[40px] min-w-[40px] items-center justify-center rounded-full bg-grey-1 text-black dark:bg-grey-5 dark:text-grey-1 ${isPressed && 'text-primary dark:text-secondary'}`}
          onClick={pressHandler}
        >
          <CommentRoundedIcon className="h-[23px] w-[23px]" />
        </Button>
        {isPressed && (
          <div className="nav-dropdown z-[1] flex h-[calc(100vh-4.5rem)] w-[300px] flex-col items-center bg-white dark:bg-black">
            <div className="flex h-[4rem] w-full items-center justify-between px-3 py-2">
              <h1 className="font-mont-bd text-xl text-black dark:text-white">
                {t('threads.threads')}
              </h1>
              <Button
                className={`flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-grey-1 p-1 text-black dark:bg-grey-5 ${isCreatingThread ? 'text-primary dark:text-secondary' : 'text-black dark:text-grey-1'}`}
                onClick={toggleCreatingThread}
              >
                <AddCommentRoundedIcon className="h-5 w-5" />
              </Button>
            </div>
            {isCreatingThread && renderNewThreadForm()}
            <div className="w-full px-3 py-3">
              <div className="flex h-10 w-full items-center justify-between rounded-full border-[1px] border-grey-1 bg-grey-0 px-2 font-mont-md dark:border-grey-6 dark:bg-grey-5">
                <input
                  type="text"
                  placeholder={t('threads.search')}
                  className={inputClass + ' w-full'}
                />
                <SearchIcon className="h-5 w-5 text-grey-4" />
              </div>
            </div>
            <div className="w-full flex items-center justify-between px-3 dark:text-grey-1">
              <h1>{t('threads.type')}:</h1>
              <select
                value={option}
                onChange={e =>
                  handleOptionChange(e.target.value as ThreadScope)
                }
                className="dark:bg-black pr-8 text-left rounded-md"
              >
                <option value={ThreadScope.Private}>
                  {t('threads.friends')}
                </option>
                <option value={ThreadScope.Event}>{t('threads.events')}</option>
                <option value={ThreadScope.Report}>
                  {t('threads.reports')}
                </option>
                <option value={ThreadScope.Normal}>
                  {t('threads.groups')}
                </option>
              </select>
            </div>
            {option === ThreadScope.Private
              ? renderPrivateThreadsContent()
              : renderThreadsContent()}
          </div>
        )}
      </OutsideClickHandler>
    </div>
  )
}

export default Threads
