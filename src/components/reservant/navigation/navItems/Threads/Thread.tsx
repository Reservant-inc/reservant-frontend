import React, { useEffect, useState, useRef } from 'react'
import {
  MessageType,
  PaginationType,
  ThreadType,
  UserType
} from '../../../../../services/types'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { fetchGET, fetchPOST, getImage } from '../../../../../services/APIconn'
import { FetchError } from '../../../../../services/Errors'
import { IconButton, Tooltip } from '@mui/material'
import DefaultPhoto from '../../../../../assets/images/user.jpg'
import Cookies from 'js-cookie'
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'

interface ThreadProps {
  thread: ThreadType
  handleThreadMinimize: Function
  handleThreadClose: Function
}

const Thread: React.FC<ThreadProps> = ({
  thread,
  handleThreadClose,
  handleThreadMinimize
}) => {
  const [messageToSend, setMessageToSend] = useState<string>('')
  const [messages, setMessages] = useState<MessageType[]>([])
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const participants = thread.participants

  thread.participants = thread.participants.filter(
    participant =>
      participant.userId !==
      JSON.parse(Cookies.get('userInfo') as string).userId
  )

  const [t] = useTranslation('global')

  const scrollableDivRef = useRef<HTMLDivElement | null>(null)
  const prevScrollHeight = useRef<number>(0)

  const getMessages = async () => {
    try {
      const result: PaginationType = await fetchGET(
        `/threads/${thread.threadId}/messages?page=${page}&perPage=20`
      )
      const newMessages: MessageType[] = result.items as MessageType[]

      if (newMessages.length < 20) {
        setHasMore(false)
      }

      if (page > 0) {
        setMessages(prevMessages => [...prevMessages, ...newMessages])
      } else {
        setMessages(newMessages)
      }
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error:', error)
      }
    }
  }

  useEffect(() => {
    getMessages()
  }, [page])

  useEffect(() => {
    if (scrollableDivRef.current) {
      const scrollableDiv = scrollableDivRef.current

      if (page === 0 || prevScrollHeight.current === 0) {
        scrollableDiv.scrollTop = scrollableDiv.scrollHeight
      } else if (prevScrollHeight.current && page > 0) {
        const newScrollHeight = scrollableDiv.scrollHeight
        scrollableDiv.scrollTop = newScrollHeight - prevScrollHeight.current
      }
    }
  }, [messages, page])

  const handleScroll = () => {
    if (scrollableDivRef.current) {
      const { scrollTop, scrollHeight } = scrollableDivRef.current

      if (scrollTop === 0 && hasMore) {
        prevScrollHeight.current = scrollHeight
        const nextPage = page + 1
        setPage(nextPage)
      }
    }
  }

  const handleSendMessage = async (message: string) => {
    try {
      const newMessage: MessageType = await fetchPOST(
        `/threads/${thread.threadId}/messages`,
        JSON.stringify({ contents: message })
      )

      setMessages(prevMessages => [newMessage, ...prevMessages])

      prevScrollHeight.current = 0
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error:', error)
      }
    } finally {
      setMessageToSend('')
    }
  }

  const renderMessage = (message: MessageType) => {
    let participant: UserType | undefined = participants.find(
      participant => participant.userId === message.authorId
    )

    const user = JSON.parse(Cookies.get('userInfo') as string)

    if (participant === undefined) {
      participant = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user.photo
      }
    }

    return (
      <div
        key={message.messageId}
        className={`flex items-center gap-2 w-full ${
          participant.userId !== user.userId
            ? 'self-start'
            : 'self-end flex-row-reverse'
        }`}
      >
        <Tooltip
          title={`${participant.firstName} ${participant.lastName}`}
          placement="bottom"
          arrow
        >
          <img
            className="h-6 w-6 rounded-full"
            src={getImage(participant.photo, DefaultPhoto)}
          />
        </Tooltip>
        <h1
          className={`text-sm rounded-lg break-words max-w-[70%] p-2 ${
            participant.userId !== user.userId
              ? 'bg-grey-1 dark:bg-grey-5 dark:text-white'
              : 'bg-primary dark:bg-secondary text-white dark:text-black dark:font-mont-bd'
          }`}
        >
          {message.contents}
        </h1>
      </div>
    )
  }

  return (
    <div
      key={thread.threadId}
      className="w-[300px] h-full bg-white dark:bg-black rounded-t-md border-t-[1px] border-x-[1px] border-grey-3  flex flex-col"
    >
      <div className="w-full h-12 flex items-center justify-between px-2 shadow-md z-[1]">
        <div className="flex gap-2 items-center">
          {thread.participants.length > 1 ? (
            <div className="relative w-9 h-9">
              <div className="absolute h-6 w-6 flex items-center justify-center bg-white dark:bg-black z-[0] top-0 right-0 rounded-full">
                <img
                  src={getImage(thread.participants[0].photo, DefaultPhoto)}
                  className="absolute h-5 w-5 rounded-full"
                />
              </div>
              <div className="absolute h-6 w-6 flex items-center justify-center bg-white dark:bg-black z-[1] bottom-0 left-0 rounded-full">
                <img
                  src={getImage(thread.participants[1].photo, DefaultPhoto)}
                  className="absolute h-5 w-5 rounded-full"
                />
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 flex items-center justify-center">
              <div className="h-9 w-9 flex items-center justify-center bg-white dark:bg-black rounded-full">
                <img
                  src={getImage(thread.participants[0].photo, DefaultPhoto)}
                  className="h-8 w-8 rounded-full"
                />
              </div>
            </div>
          )}
          <Tooltip title={thread.title} placement="top" arrow>
            <h1 className="text-md font-mont-bd w-44 truncate text-nowrap dark:text-white">
              {thread.title}
            </h1>
          </Tooltip>
        </div>
        <div className="flex gap-1 items-center">
          <Tooltip title={t('threads.minimize')} placement="top" arrow>
            <IconButton
              className="h-8 w-8"
              onClick={() => handleThreadMinimize(thread)}
            >
              <HorizontalRuleRoundedIcon className="h-5 w-5 dark:text-white" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('general.close')} placement="top" arrow>
            <IconButton
              className="h-8 w-8"
              onClick={() => handleThreadClose(thread)}
            >
              <CloseIcon className="h-5 w-5 dark:text-white" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="h-[calc(100%-3rem)] w-full z-[0] dark:bg-grey-6">
        <div className="flex flex-col h-full w-full">
          <div
            id="scrollableDiv"
            className="h-full w-full overflow-y-auto scroll grid items-end pb-1"
            ref={scrollableDivRef}
            onScroll={handleScroll}
          >
            <div className="h-full w-full flex flex-col-reverse gap-4">
              {messages.map(message => renderMessage(message))}
            </div>
          </div>
          <div className="flex items-center justify-between h-12 w-full p-2 gap-2 relative">
            <div
              className={`border-[1px] border-grey-1 dark:border-grey-6 bg-grey-0 dark:bg-grey-5 rounded-full transition-all duration-300 ${
                messageToSend.length > 0 ? 'w-[calc(100%-48px)]' : 'w-full'
              }`}
            >
              <input
                type="text"
                placeholder={t('threads.message')}
                value={messageToSend}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSendMessage(messageToSend)
                  }
                }}
                onChange={e => setMessageToSend(e.target.value)}
                className="text-sm w-full placeholder:text-grey-2 dark:text-grey-1"
              />
            </div>
            <button
              className={`absolute p-2 hover:bg-grey-0 dark:hover:bg-grey-5 hover:text-primary dark:hover:text-secondary rounded-full h-10 flex items-center justify-center fade-in-opacity right-2 ${
                messageToSend.length > 0 ? 'opacity-100' : 'opacity-0 z-[-1]'
              }`}
              onClick={() => handleSendMessage(messageToSend)}
            >
              <Tooltip title={t('threads.send-message')} placement="left" arrow>
                <SendRoundedIcon className="h-6 w-6 dark:text-white" />
              </Tooltip>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Thread
