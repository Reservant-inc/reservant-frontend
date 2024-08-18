import React from "react";
import { UserSearchType } from "../../../../services/types";
import { getImage } from "../../../../services/APIconn";
import { FriendStatus } from "../../../../services/enums";
import CheckSharpIcon from '@mui/icons-material/CheckSharp';

interface SearchedUserProps {
  user: UserSearchType
}

const SearchedUser: React.FC<SearchedUserProps> = ({
  user
}) => {

  return (
    <div className="flex justify-between w-full">
        <div className="flex gap-[5px] items-center text-sm">
          <img src={getImage(user.photo)} alt="user photo" className="h-8 w-8 rounded-full"/>
          <h1>{user.firstName}</h1>
          <h1>{user.lastName}</h1>
        </div>
        <div className="flex items-center">
          {
            {
              [FriendStatus.Friend]: (
                <h1 className="text-grey-2 text-sm flex items-center gap-1">friends <CheckSharpIcon className="h-5 w-5"/></h1>
              ),
              [FriendStatus.OutgoingRequest]: <></>,
              [FriendStatus.IncomingRequest]: <></>,
              [FriendStatus.Stranger]: <></>
            }[user.friendStatus]
          }  
        </div>
    </div>
  );
};

export default SearchedUser;
