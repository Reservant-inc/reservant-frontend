import { ListItemButton } from '@mui/material'
import React, { ReactElement } from 'react'
import useWindowDimensions from '../../../../hooks/useWindowResize'
import { useLocation, useNavigate } from 'react-router-dom'

interface TabProps {
  path: string
  title: string
  icon?: ReactElement
  id: string
  full?: boolean
  onClose?: () => void
}

const Tab: React.FC<TabProps> = ({ path, title, icon, id, full, onClose }) => {
  const size = useWindowDimensions()
  const navigate = useNavigate()

  const location = useLocation()

  const isSelected = location.pathname.includes(path)

  const handleClick = () => {
    navigate(path)
    onClose
  }

  return (
    <div className="p-0 ">
      <ListItemButton
        id={id}
        className={` ${isSelected ? 'bg-white dark:bg-black' : 'bg-grey-0 dark:bg-grey-5'} ${full && 'rounded-lg'}  h-full w-full rounded-t-lg px-4 dark:text-grey-1`}
        onClick={handleClick}
      >
        <div className="flex text-nowrap items-center gap-2">
          {icon}
          {(full || size.width > 1500 || !icon) && <h1>{title}</h1>}
        </div>
      </ListItemButton>
    </div>
  )
}

export default Tab
