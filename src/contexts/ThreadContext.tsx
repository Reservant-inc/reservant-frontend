import React, { createContext, ReactNode, useState } from 'react'
import Thread from '../components/reservant/navigation/navItems/Threads/Thread'
import InactiveThread from '../components/reservant/navigation/navItems/Threads/InactiveThread'
import { ThreadType } from '../services/types'
import renderUserPhotos from '../utils/DisplayUserPhotos'
import { fetchDELETE } from '../services/APIconn'
import { FetchError } from '../services/Errors'

interface ThreadContextProps {
  children: ReactNode
}

interface ThreadContextValue {
  handleThreadOpen: (thread: ThreadType) => void
  handleDeleteThread: (threadId: number) => Promise<void>
}

export const ThreadContext = createContext<ThreadContextValue>({
  handleThreadOpen: () => {},
  handleDeleteThread: async () => {}
})

const ThreadContextProvider: React.FC<ThreadContextProps> = ({ children }) => {
  const [activeThreads, setActiveThreads] = useState<ThreadType[]>([])
  const [inactiveThreads, setInactiveThreads] = useState<ThreadType[]>([])

  const handleThreadOpen = (thread: ThreadType) => {
    const isActive = activeThreads.some(
      activeThread => activeThread.threadId === thread.threadId
    )

    if (isActive) return

    const isInactive = inactiveThreads.some(
      inactiveThread => inactiveThread.threadId === thread.threadId
    )

    if (isInactive) {
      handleThreadMaximize(thread)
    } else {
      if (activeThreads.length >= 2) {
        handleThreadMinimize(activeThreads[0])
      }
      setActiveThreads(prevThreads => [...prevThreads, thread])
    }
  }

  const handleThreadClose = (thread: ThreadType) => {
    const isActive = activeThreads.some(
      activeThread => activeThread.threadId === thread.threadId
    )

    if (isActive)
      setActiveThreads(prevThreads =>
        prevThreads.filter(
          activeThread => activeThread.threadId !== thread.threadId
        )
      )
    else
      setInactiveThreads(prevThreads =>
        prevThreads.filter(
          inactiveThread => inactiveThread.threadId !== thread.threadId
        )
      )
  }

  const handleThreadMinimize = (thread: ThreadType) => {
    setActiveThreads(prevThreads =>
      prevThreads.filter(
        activeThread => activeThread.threadId !== thread.threadId
      )
    )

    if (inactiveThreads.length >= 5) {
      handleThreadClose(inactiveThreads[0])
    }

    setInactiveThreads(prevThreads => [...prevThreads, thread])
  }

  const handleThreadMaximize = (thread: ThreadType) => {
    setInactiveThreads(prevThreads =>
      prevThreads.filter(
        inactiveThread => inactiveThread.threadId !== thread.threadId
      )
    )

    if (activeThreads.length >= 2) {
      const earliestActiveThread = activeThreads[0]

      setActiveThreads(prevThreads =>
        prevThreads.filter((_, index) => index !== 0)
      )

      setInactiveThreads(prevThreads => {
        const updatedInactiveThreads = [...prevThreads, earliestActiveThread]

        if (updatedInactiveThreads.length > 5) {
          return updatedInactiveThreads.slice(1)
        }

        return updatedInactiveThreads
      })
    }

    setActiveThreads(prevThreads => [...prevThreads, thread])
  }

  const handleDeleteThread = async (threadId: number) => {
    try {
      await fetchDELETE(`/threads/${threadId}`)
      setActiveThreads(prev =>
        prev.filter(thread => thread.threadId !== threadId)
      )
      setInactiveThreads(prev =>
        prev.filter(thread => thread.threadId !== threadId)
      )
    } catch (error) {
      if (error instanceof FetchError) {
        console.error(error.formatErrors())
      } else {
        console.error('Unexpected error while deleting thread', error)
      }
    }
  }

  const ctxValue = {
    handleThreadOpen,
    handleDeleteThread
  }

  return (
    <ThreadContext.Provider value={ctxValue}>
      {children}
      <div
        className={`absolute bottom-0 right-[0.5rem] max-w-[620px] ${inactiveThreads.length > 0 && 'right-[4rem]'} z-[0] z-[1] flex h-[400px] flex-row-reverse gap-[15px] ${activeThreads.length === 0 ? 'invisible' : activeThreads.length >= 2 ? 'w-[620]' : 'W-[310]'}`}
      >
        {activeThreads.map(activeThread => (
          <Thread
            key={activeThread.threadId}
            thread={activeThread}
            handleThreadClose={handleThreadClose}
            handleThreadMinimize={handleThreadMinimize}
          />
        ))}
      </div>
      <div
        className={`absolute bottom-0 right-[0.5rem] z-[0] z-[1] flex w-14 flex-col-reverse gap-2 py-4 ${inactiveThreads.length === 0 && 'hidden'}`}
      >
        {inactiveThreads.map(inactiveThread => (
          <InactiveThread
            key={inactiveThread.threadId}
            thread={inactiveThread}
            handleThreadMaximize={handleThreadMaximize}
            renderUserPhotos={renderUserPhotos}
            handleThreadClose={handleThreadClose}
          />
        ))}
      </div>
    </ThreadContext.Provider>
  )
}

export default ThreadContextProvider
