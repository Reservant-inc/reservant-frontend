import React from 'react'

interface ProfileTabsProps {
  activeTab: 'created' | 'interested' | 'participated'
  onTabChange: (tab: 'created' | 'interested' | 'participated') => void
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => onTabChange('created')}
        className={`${activeTab === 'created' ? 'bg-primary text-white' : 'bg-white text-primary'} text-sm px-2 border-[1px] rounded-lg p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        Utworzone
      </button>
      <button
        onClick={() => onTabChange('interested')}
        className={`${activeTab === 'interested' ? 'bg-primary text-white' : 'bg-white text-primary'} text-sm px-2 border-[1px] rounded-lg p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        Zainteresowane
      </button>
      <button
        onClick={() => onTabChange('participated')}
        className={`${activeTab === 'participated' ? 'bg-primary text-white' : 'bg-white text-primary'} text-sm px-2 border-[1px] rounded-lg p-1 border-primary transition hover:bg-primary hover:text-white dark:border-secondary dark:text-secondary dark:hover:bg-secondary dark:hover:text-black`}
      >
        Uczestniczysz
      </button>
    </div>
  )
}

export default ProfileTabs
