import React, { useContext, useEffect, useState } from 'react'
import OutsideClickHandler from '../../../../reusableComponents/OutsideClickHandler'
import CommentRoundedIcon from '@mui/icons-material/CommentRounded'
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded'
import {
  fetchDELETE,
  fetchGET,
  fetchPOST,
  getImage
} from '../../../../../services/APIconn'
import {
  PaginationType,
  ThreadType,
  UserType
} from '../../../../../services/types'
import { Button, CircularProgress, List, ListItemButton } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import ThreadPreview from './ThreadPreview'
import SearchIcon from '@mui/icons-material/Search'
import { FetchError } from '../../../../../services/Errors'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useTranslation } from 'react-i18next'
import FriendSelector from '../../../../reusableComponents/FriendSelector'
import renderUserPhotos from '../../../../../utils/DisplayUserPhotos'
import { ThreadContext } from '../../../../../contexts/ThreadContext'

const Threads: React.FC = () => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const [isLoadingThreads, setIsLoadingThreads] = useState<boolean>(false)
  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false)
  const [threadTitle, setThreadTitle] = useState<string>('')
  const [threads, setThreads] = useState<ThreadType[]>([])
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [friendsToAdd, setFriendsToAdd] = useState<UserType[]>([])
  const [filter, setFilter] = useState<string>('')

  const { handleThreadOpen } = useContext(ThreadContext)

  const [t] = useTranslation('global')

  const clearStates = () => {
    setThreadTitle('')
    setFriendsToAdd([])
  }

  const pressHandler = () => {
    if (isPressed) {
      setIsCreatingThread(false)
      clearStates()
    } else {
      setHasMore(true)
      setPage(0)
    }

    setIsPressed(!isPressed)
  }

  const getThreads = async () => {
    try {
      if (page === 0) setIsLoadingThreads(true)

      const result: PaginationType = await fetchGET(
        `/user/threads?page=${page}`
      )
      const newThreads = result.items as ThreadType[]

      if (newThreads.length < 10) setHasMore(false)

      if (page > 0) setThreads(prevThreads => [...prevThreads, ...newThreads])
      else setThreads(newThreads)
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error:', error)
      }
    } finally {
      setIsLoadingThreads(false)
    }
  }

  useEffect(() => {
    getThreads()
  }, [page])

  useEffect(() => {
    getThreads()
  }, [])

  const toggleCreatingThread = () => {
    if (isCreatingThread) {
      clearStates()
    }
    setIsCreatingThread(!isCreatingThread)
  }

  const deleteThread = async (threadId: number) => {
    try {
      await fetchDELETE(`/threads/${threadId}`)
      setThreads(prev => {
        return prev.filter(thread => thread.threadId !== threadId)
      })
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error while deleting thread', error)
      }
    }
  }

  const postThread = async () => {
    try {
      const ids = friendsToAdd.map(friend => {
        return friend.userId
      })

      const values = {
        title: threadTitle,
        participantIds: ids
      }

      fetchPOST('/threads', JSON.stringify(values))
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors())
      } else {
        console.log('Unexpected error:', error)
      }
    } finally {
      toggleCreatingThread()
      getThreads()
    }
  }

  const renderThreadsContent = () => {
    if (isLoadingThreads) {
      return (
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-lg italic text-grey-6 dark:text-grey-2">
            {t('threads.loading')}
          </h1>
          <CircularProgress className="h-8 w-8 text-grey-2" />
        </div>
      )
    }

    if (!threads.length) {
      return (
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="text-center text-lg italic text-grey-6 dark:text-grey-2">
            {t('threads.no-threads')}
          </h1>
        </div>
      )
    }

    return (
      <List className="h-full w-full p-0">
        <InfiniteScroll
          dataLength={threads.length}
          next={() => setPage(prevPage => prevPage + 1)}
          hasMore={hasMore}
          loader={
            <div className="flex w-full jusitfy-center">
              <CircularProgress className="text-grey-2" />
            </div>
          }
          endMessage={
            <div className="flex w-full justify-center p-2">
              <h1 className="text-grey-2 text-sm">
                {t('profile.transaction-history.no-more')}
              </h1>
            </div>
          }
          scrollableTarget="scrollableDiv"
          className="hidescroll h-full"
        >
          {threads
            .filter(t => t.type.includes(filter))
            .map(thread => (
              <ThreadPreview
                key={thread.threadId}
                thread={thread}
                renderUserPhotos={renderUserPhotos}
                handleThreadOpen={handleThreadOpen}
                pressHandler={pressHandler}
                deleteThread={deleteThread}
              />
            ))}
        </InfiniteScroll>
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
          onClick={postThread}
        >
          <CheckIcon className="h-5 w-5 dark:text-grey-1" />
        </button>
      </div>
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
            <div className="flex h-14 w-full items-center justify-between px-3 py-2">
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
                  className="clean-input h-8 w-[230px] p-2 dark:text-white dark:placeholder:text-grey-2"
                />
                <SearchIcon className="h-[25px] w-[25px] hover:cursor-pointer dark:text-grey-2" />
              </div>
            </div>
            <div className="w-full flex items-center justify-between px-3 dark:text-grey-1">
              <h1>{t('threads.type')}:</h1>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="dark:bg-black pr-8 text-left rounded-md"
              >
                <option value={''}>{t('threads.all')}</option>
                <option value="Normal">{t('threads.friends')}</option>
                <option value="Event">{t('threads.events')}</option>
                <option value="Report">{t('threads.reports')}</option>
              </select>
            </div>
            <div
              id="scrollableDiv"
              className="scroll flex h-full w-full items-center justify-center overflow-y-auto px-2"
            >
              {renderThreadsContent()}
            </div>
          </div>
        )}
      </OutsideClickHandler>
    </div>
  )
}

export default Threads
