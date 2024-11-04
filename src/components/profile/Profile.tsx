import React, { useEffect, useState } from "react";
import { FetchError } from "../../services/Errors";
import { fetchGET, getImage } from "../../services/APIconn";
import { UserType } from "../../services/types";
import DefaultImage from "../../assets/images/user.jpg";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType>();

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  });

  const fetchUserData = async () => {
    try {
      const userdata = await fetchGET("/user");

      setUser(userdata);
    } catch (error) {
      if (error instanceof FetchError) {
        console.log(error.formatErrors());
      } else {
        console.log("Unexpected error");
      }
    }
  };

  return (
    <div className="z-[0] flex h-full w-full items-center justify-center gap-3 bg-grey-0 p-4">
      <div className="flex w-[200px] flex-col gap-2 self-start rounded-lg bg-white p-3">
        <div className="mb-5 flex items-center gap-4">
          {user && (
            <>
              <img
                src={getImage(user.photo, DefaultImage)}
                className="h-12 w-12 rounded-full"
              />
              <h1 className="font-mont-bd text-xl">
                {user.firstName} {user.lastName}
              </h1>
            </>
          )}
        </div>
        <Button
          className="w-full text-black"
          onClick={() => navigate("account")}
        >
          <h1>Account</h1>
        </Button>
        <Button
          className="w-full text-black"
          onClick={() => navigate("account")}
        >
          <h1>Wallet</h1>
        </Button>
        <Button
          className="w-full text-black"
          onClick={() => navigate("reservation-history")}
        >
          <h1>Reservations</h1>
        </Button>
        <Button
          className="w-full text-black"
          onClick={() => navigate("event-history")}
        >
          <h1>Events</h1>
        </Button>
      </div>
      <div className="h-full w-[1000px] rounded-lg bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
