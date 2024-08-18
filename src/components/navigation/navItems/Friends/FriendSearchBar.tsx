import React, { useState, useEffect, useCallback } from "react";
import { fetchGET, fetchPOST, fetchDELETE } from "../../../../services/APIconn";
import SearchIcon from '@mui/icons-material/Search';
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import { CircularProgress, List, ListItem, ListItemButton } from "@mui/material";
import { PaginationType, UserSearchType } from "../../../../services/types";
import SearchedUser from "./SearchedUser";


const FriendSearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<UserSearchType[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  
  const pressHandler = async () => {
    setIsPressed(!isPressed);
  };

  const fetchUsers = async (name: string) => {
    try {
      setIsLoadingUsers(true)

      const result: PaginationType = await fetchGET(`/users?name=${name}`)

      setUsers(result.items as UserSearchType[])

    } catch (error) {
        console.log("error fetching users", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setSearchTerm(name)

    if (name.length >= 1) 
      fetchUsers(name)
    else
      setUsers([])
  };

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <div className="w-full flex px-2 rounded-full h-10 items-center bg-grey-0 border-[1px] border-grey-1 font-mont-md">
        <input
          type="text"
          placeholder="Szukaj znajomych"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => {
            if (!isPressed)
              setIsPressed(!isPressed)
          }}
          className="w-[250px] p-2 clean-input h-8"
          />
        <SearchIcon className="hover:cursor-pointer h-[25px] w-[25px]"/>
      </div>
      {isPressed && (
        <div>
          {users.length > 0 ? (
            <div className="flex items-center nav-dropdown w-[450px] h-[15rem]  overflow-y-auto scroll">
              <List
                className="w-full font-mont-md dark:bg-black p-1"
                component="nav"
              >
                {users.map((user, index) => (
                  <ListItem
                    key={index}
                    className='rounded-lg px-2 py-1 hover:bg-grey-0'
                  >
                    <SearchedUser user={user} />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : (
            <>
              {isLoadingUsers ? (
                <div className="flex items-center justify-center nav-dropdown w-[290px] h-[3rem] right-[10rem]">
                  <div className="flex flex-col items-center gap-2">
                    <CircularProgress className="h-8 w-8 text-grey-2" />
                  </div>
                </div>
              ) : (
                searchTerm.length > 0 && (
                  <div className="flex items-center justify-center nav-dropdown w-[290px] h-[3rem] right-[10rem]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <h1 className="text-sm text-grey-3 italic text-center">No results</h1>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>
      )}
    </OutsideClickHandler>
  );
};

export default FriendSearchBar;
