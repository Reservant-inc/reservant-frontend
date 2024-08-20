import React, { useState } from "react";
import { UserSearchType } from "../../../../services/types";
import { fetchDELETE, fetchPOST, getImage } from "../../../../services/APIconn";
import { FriendStatus } from "../../../../services/enums";
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import UndoSharpIcon from '@mui/icons-material/UndoSharp';
import SendSharpIcon from '@mui/icons-material/SendSharp';
import { FetchError } from "../../../../services/Errors";
import DefaultPhoto from "../../../../assets/images/user.jpg"

interface SearchedUserProps {
  user: UserSearchType
}

const SearchedUser: React.FC<SearchedUserProps> = ({
  user
}) => {
  const [refresh, forceRefresh] = useState<boolean>(true)

  const sendRequest = () => {
    try {
      fetchPOST(`/friends/${user.userId}/send-request`)
      user.friendStatus = FriendStatus.OutgoingRequest
    } catch (error) {
      console.log("There was trouble sending friend request", error)
    } finally {
      forceRefresh(!refresh)
    }
  }

  const acceptRequest = () => {
    try {
      fetchPOST(`/friends/${user.userId}/accept-request`)
      user.friendStatus = FriendStatus.Friend
    } catch (error) {
      console.log("There was trouble accepting friend request", error)
    } finally {
      forceRefresh(!refresh)
    }
  }

  const deleteRequest = () => {
    try {
      fetchDELETE(`/friends/${user.userId}`)
      user.friendStatus = FriendStatus.Stranger
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.message)
      } else {
        console.log("There was trouble deleting friend request", error)
      }
    } finally {
      forceRefresh(!refresh)
    }
  }

  return (
    <div className="flex justify-between w-full">
        <div className="flex gap-[5px] items-center text-sm w-[60%] overflow-x-hidden">
          <img src={DefaultPhoto} alt="user photo" className="h-8 w-8 rounded-full"/>
          <h1>{user.firstName}</h1>
          <h1>{user.lastName}</h1>
        </div>
        <div className="flex items-center w-[25%] justify-center">
          { 
            {
              [FriendStatus.Friend]: (
                <h1 className="text-grey-2 text-sm flex items-center h-12 gap-1">friends <CheckSharpIcon className="h-5 w-5"/></h1>
              ),
              [FriendStatus.OutgoingRequest]: (
                <button className="text-grey-2 rounded-md text-sm flex items-center justify-center gap-2 hover:text-secondary h-12 p-2 w-full" onClick={deleteRequest}>undo request<UndoSharpIcon className="h-5 w-5"/></button>
              ),
              [FriendStatus.IncomingRequest]: (
                <div className="flex h-12 w-full justify-around items-center">
                  <button className="text-grey-2 rounded-md text-sm flex items-center justify-center hover:text-red h-10 p-1 w-10" onClick={deleteRequest}><CloseSharpIcon className="h-5 w-5"/></button>
                  <button className="text-grey-2 rounded-md text-sm flex items-center justify-center hover:text-green h-10 p-1 w-10" onClick={acceptRequest}><CheckSharpIcon className="h-5 w-5"/></button>
                </div>
              ),
              [FriendStatus.Stranger]: (
                <button className="text-grey-2 text-sm rounded-md flex items-center justify-center gap-2 hover:text-primary h-12 p-2 w-full" onClick={sendRequest}>send request <SendSharpIcon className="h-5 w-5"/></button>
              )
            }[user.friendStatus]
          }  
        </div>
    </div>
  );
};

export default SearchedUser;
