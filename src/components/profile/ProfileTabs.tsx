import React from "react";

interface ProfileTabsProps {
  activeTab: "created" | "interested" | "participated";
  onTabChange: (tab: "created" | "interested" | "participated") => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 bg-grey-1">
      <button
        onClick={() => onTabChange("created")}
        className={`${activeTab === "created" ? "bg-white dark:bg-black text-primary" : "bg-grey-0 dark:bg-grey-5"} rounded-t-lg px-4 py-2 dark:text-grey-1`}
      >
        Utworzone
      </button>
      <button
        onClick={() => onTabChange("interested")}
        className={`${activeTab === "interested" ? "bg-white dark:bg-black text-primary" : "bg-grey-0 dark:bg-grey-5"} rounded-t-lg px-4 dark:text-grey-1`}
      >
        Zainteresowane
      </button>
      <button
        onClick={() => onTabChange("participated")}
        className={`${activeTab === "participated" ? "bg-white dark:bg-black text-primary" : "bg-grey-0 dark:bg-grey-5"} rounded-t-lg px-4 dark:text-grey-1`}
      >
        Uczestniczysz
      </button>
    </div>
  );
};

export default ProfileTabs;
