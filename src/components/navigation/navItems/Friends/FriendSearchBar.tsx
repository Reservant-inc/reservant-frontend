import React, { useState, useEffect, useRef } from "react";
import { fetchGET, fetchPOST, fetchDELETE } from "../../../../services/APIconn";
import SearchIcon from "@mui/icons-material/Search";
import OutsideClickHandler from "../../../reusableComponents/OutsideClickHandler";
import {
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { PaginationType, UserSearchType } from "../../../../services/types";
import SearchedUser from "./SearchedUser";
import InfiniteScroll from "react-infinite-scroll-component";

const FriendSearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [users, setUsers] = useState<UserSearchType[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const pressHandler = async () => {
    setIsPressed(!isPressed);
  };

  const fetchUsers = async (name: string, page: number) => {
    try {
      if (page === 0) setIsLoadingUsers(true);

      console.log(page);

      const result: PaginationType = await fetchGET(
        `/users?name=${name}&page=${page}&perPage=5`,
      );
      const newUsers = result.items as UserSearchType[];

      if (newUsers.length === 0) setHasMore(false);

      if (page > 0) {
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      } else {
        setUsers(newUsers);
      }
    } catch (error) {
      console.log("error fetching users", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length >= 1) {
      fetchUsers(searchTerm, page);
    } else {
      setUsers([]);
    }
  }, [searchTerm, page]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setSearchTerm(name);
    setPage(0);
    setHasMore(true);
  };

  return (
    <OutsideClickHandler onOutsideClick={pressHandler} isPressed={isPressed}>
      <div className="flex h-10 w-full items-center rounded-full border-[1px] border-grey-1 bg-grey-0 px-2 font-mont-md">
        <input
          type="text"
          placeholder="Szukaj znajomych"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => {
            if (!isPressed) setIsPressed(!isPressed);
          }}
          className="clean-input h-8 w-[250px] p-2"
        />
        <SearchIcon className="h-[25px] w-[25px] hover:cursor-pointer" />
      </div>
      {isPressed && (
        <div className="absolute right-0 top-0 w-[460px]">
          {users.length > 0 ? (
            <div className="nav-dropdown scroll left-0 flex h-[15rem] w-[450px] items-center overflow-y-hidden">
              <div
                id="scrollableDiv"
                className="scroll h-full w-full overflow-y-auto"
              >
                <div className="custom-transition flex h-14 w-full items-center justify-between px-3 py-4">
                  <h1 className="font-mont-bd text-xl">Results</h1>
                </div>
                <InfiniteScroll
                  dataLength={users.length}
                  next={() => setPage((prevPage) => prevPage + 1)}
                  hasMore={hasMore}
                  loader={<CircularProgress />}
                  scrollableTarget="scrollableDiv"
                  className="hidescroll px-2"
                >
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="w-full rounded-lg px-2 py-1 hover:bg-grey-0"
                    >
                      <SearchedUser user={user} />
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          ) : (
            <>
              {isLoadingUsers ? (
                <div className="nav-dropdown left-0 flex h-[3rem] w-[290px] items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <CircularProgress className="h-8 w-8 text-grey-2" />
                  </div>
                </div>
              ) : (
                searchTerm.length > 0 && (
                  <div className="nav-dropdown left-0 flex h-[3rem] w-[290px] items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <h1 className="text-center text-sm italic text-grey-3">
                        No results
                      </h1>
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
