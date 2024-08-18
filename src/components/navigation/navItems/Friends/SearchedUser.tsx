import React from "react";
import { UserSearchType } from "../../../../services/types";
import { getImage } from "../../../../services/APIconn";
import { FriendStatus } from "../../../../services/enums";
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import UndoSharpIcon from '@mui/icons-material/UndoSharp';

interface SearchedUserProps {
  user: UserSearchType
}

const SearchedUser: React.FC<SearchedUserProps> = ({
  user
}) => {

  return (
    <div className="flex justify-between w-full">
        <div className="flex gap-[5px] items-center text-sm w-[60%] overflow-x-hidden">
          <img src={getImage(user.photo)} alt="user photo" className="h-8 w-8 rounded-full"/>
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
                <button className="text-grey-2 rounded-md text-sm flex items-center justify-center gap-2 hover:bg-grey-2 hover:text-white h-12 p-2 w-full">undo request<UndoSharpIcon className="h-5 w-5"/></button>
              ),
              [FriendStatus.IncomingRequest]: (
                <div className="flex h-12 w-full justify-around items-center">
                  <button className="text-red rounded-md text-sm flex items-center justify-center hover:bg-l-red hover:text-white h-10 p-1 w-10"><CloseSharpIcon className="h-5 w-5"/></button>
                  <button className="text-green rounded-md text-sm flex items-center justify-center hover:bg-l-green hover:text-white h-10 p-1 w-10"><CheckSharpIcon className="h-5 w-5"/></button>
                </div>
              ),
              [FriendStatus.Stranger]: (
                <button className="text-primary text-sm rounded-md flex items-center justify-center gap-2 hover:bg-primary-2 hover:text-white h-12 p-2 w-full">send request <UndoSharpIcon className="h-5 w-5"/></button>
              )
            }[user.friendStatus]
          }  
        </div>
    </div>
  );
};

export default SearchedUser;
