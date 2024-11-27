import { ListItemButton } from '@mui/material'
import React, { ReactElement } from 'react'
import useWindowDimensions from '../../../../hooks/useWindowResize'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

interface TabProps {
  path: string
  title: string
  icon?: ReactElement
  id: string
}

const Tab: React.FC<TabProps> = ({ path, title, icon, id }) => {
  const size = useWindowDimensions()
  const navigate = useNavigate()

  const location = useLocation()

  const isSelected = location.pathname.includes(path)

  const handleClick = () => {
    navigate(path)
  }

  return (
    <div className="p-0">
      <ListItemButton
        id={id}
        className={` ${isSelected ? 'bg-white dark:bg-black' : 'bg-grey-0 dark:bg-grey-5'}  h-full w-full rounded-t-lg px-4 dark:text-grey-1`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          {icon}
          {size.width < 2000 && <h1>{title}</h1>}
        </div>
      </ListItemButton>
    </div>
  )
}

export default Tab
