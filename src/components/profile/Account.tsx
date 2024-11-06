import React, { useEffect, useState } from "react";
import { FetchError } from "../../services/Errors";
import { fetchGET, getImage } from "../../services/APIconn";
import { UserType } from "../../services/types";
import DefaultImage from '../../assets/images/user.jpg'

const Account: React.FC = () => {

  const [userInfo, setUserInfo] = useState<UserType>({} as UserType)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const user = await fetchGET('/user')
      setUserInfo(user)
    } catch (error) {
      if (error instanceof FetchError)
        console.log(error.formatErrors())
      else 
        console.log(error)
    }
  }

  return (
    <div className="flex flex-col h-full gap-2">
        <div className="bg-white h-1/2 rounded-lg p-4">
          <h1 className="text-lg font-mont-bd">Account</h1>
          <div className="flex w-full h-full py-2">
            <img src={getImage(userInfo.photo, DefaultImage)} className="h-full"/>
            <div>

            </div>
          </div>
        </div>
        <div className="bg-white h-1/2 rounded-lg p-4">
          <h1 className="text-lg font-mont-bd">Wallet</h1>

        </div>
    </div>
  )
};

export default Account;
