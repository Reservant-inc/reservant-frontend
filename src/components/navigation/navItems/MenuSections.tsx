import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from "react-i18next";

interface SectionProps {}

const Sections: React.FC<SectionProps> = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate(); 
  const location = useLocation();
  
  const user =JSON.parse(Cookies.get("userInfo") as string);

  const userRoles = user.roles;

  const isClickedRestaurants =
    location.pathname ===
    `/${user.login}/restaurants`;
  const isClickedHome = location.pathname === "/home";

  return (
    <div className="flex h-full items-center gap-3">
      <div className="relative h-14">
<<<<<<< HEAD
        <button
          id="NavbarHomeSectionButton"
          className={
            "relative mt-1 flex h-12 w-28 flex-col items-center justify-between rounded-xl fill-grey-2" +
            (isClickedHome
              ? " hover:bg-transpartent fill-primary dark:fill-secondary dark:hover:bg-none"
              : " hover:bg-grey-1 dark:hover:bg-grey-5")
          }
          onClick={() => navigate("/home")}
        >
          <svg
            className="absolute top-1/2 h-6 -translate-y-1/2 transform"
            viewBox="0 -0.5 21 21"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
=======
        <Tooltip title={t("navbar.home")} arrow>
          <button
            id="NavbarHomeSectionButton"
            className={
              "relative mt-1 flex h-12 w-28 flex-col items-center justify-between rounded-xl fill-grey-2" +
              (isClickedHome
                ? " hover:bg-transpartent fill-primary dark:fill-secondary dark:hover:bg-none"
                : " hover:bg-grey-1 dark:hover:bg-grey-4")
            }
            onClick={() => navigate("/home")}
>>>>>>> 33818509380a6cb4432c360eea2c123a6513df8e
          >
            <svg
              className="absolute top-1/2 h-6 -translate-y-1/2 transform"
              viewBox="0 -0.5 21 21"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="Dribbble-Light-Preview"
                transform="translate(-419.000000, -720.000000)"
              >
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path
                    d="M379.79996,578 L376.649968,578 L376.649968,574 L370.349983,574 L370.349983,578 L367.19999,578 L367.19999,568.813 L373.489475,562.823 L379.79996,568.832 L379.79996,578 Z M381.899955,568.004 L381.899955,568 L381.899955,568 L373.502075,560 L363,569.992 L364.481546,571.406 L365.099995,570.813 L365.099995,580 L372.449978,580 L372.449978,576 L374.549973,576 L374.549973,580 L381.899955,580 L381.899955,579.997 L381.899955,570.832 L382.514204,571.416 L384.001,570.002 L381.899955,568.004 Z"
                    id="home-[#1391]"
                  />
                </g>
              </g>
            </svg>
          </button>
        </Tooltip>
        {isClickedHome && (
          <span className="absolute bottom-0 h-[3px] w-full scale-y-100 transform bg-primary transition dark:bg-secondary" />
        )}
      </div>
<<<<<<< HEAD
      {userRoles.includes("RestaurantOwner") && (
        <div className="relative h-14">
          <button
            id="NavbarRestaurantsSectionButton"
            className={
              "relative mt-1 flex h-12 w-28 flex-col items-center justify-between rounded-xl fill-grey-2" +
              (isClickedRestaurants
                ? " hover:bg-transpartent fill-primary dark:fill-secondary dark:hover:bg-none"
                : " hover:bg-grey-1 dark:hover:bg-grey-5")
            }
            onClick={() =>
              navigate(
                `/${user.login}/restaurants`,
              )
            }
          >
            <svg
              className="absolute top-1/2 h-6 -translate-y-1/2 transform"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="Dribbble-Light-Preview"
                transform="translate(-60.000000, -3119.000000)"
              >
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path
                    d="M21.7001111,2961 L18.3501111,2961 C18.5861111,2962.614 18.7931111,2964.818 18.4451111,2966.157 C18.6641111,2966.175 18.8931111,2966.19 19.1541111,2966.19 C20.5281111,2966.19 21.5281111,2965.897 21.8761111,2965.7 C22.1011111,2965.017 22.0161111,2963.048 21.7001111,2961 L21.7001111,2961 Z M20.0001111,2968.155 C18.8681111,2968.24 17.5941111,2968.172 16.5451111,2967.819 C14.9411111,2968.299 12.6941111,2968.329 11.1771111,2967.818 C10.3221111,2968.075 9.22311111,2968.225 8.00011111,2968.179 L8.00011111,2977 L13.0001111,2977 L13.0001111,2973 L15.0001111,2973 L15.0001111,2977 L20.0001111,2977 L20.0001111,2968.155 Z M6.14111111,2965.805 C6.40811111,2965.954 7.18211111,2966.19 8.41811111,2966.19 C8.82911111,2966.19 9.20211111,2966.162 9.53911111,2966.12 C9.23011111,2964.756 9.40911111,2962.59 9.61811111,2961 L6.26011111,2961 C5.97111111,2963.105 5.90911111,2965.125 6.14111111,2965.805 L6.14111111,2965.805 Z M11.5111111,2965.805 C12.5281111,2966.372 15.4871111,2966.279 16.5101111,2965.7 C16.7351111,2965.017 16.6501111,2963.048 16.3341111,2961 L11.6301111,2961 C11.3411111,2963.105 11.2791111,2965.125 11.5111111,2965.805 L11.5111111,2965.805 Z M23.3661111,2967.067 C23.0641111,2967.369 22.5801111,2967.609 22.0001111,2967.792 L22.0001111,2979 L6.00011111,2979 L6.00011111,2967.881 C5.37011111,2967.696 4.85611111,2967.428 4.56311111,2967.067 C3.29611111,2965.498 4.56311111,2959 4.56311111,2959 L23.3661111,2959 C23.3661111,2959 24.7921111,2965.641 23.3661111,2967.067 L23.3661111,2967.067 Z M10.0001111,2973 L12.0001111,2973 L12.0001111,2969 L10.0001111,2969 L10.0001111,2973 Z M16.0001111,2973 L18.0001111,2973 L18.0001111,2969 L16.0001111,2969 L16.0001111,2973 Z"
                    id="shop_center-[#1139]"
                  />
                </g>
              </g>
            </svg>
          </button>
=======

      {userRoles.includes("RestaurantOwner") && (
        <div className="relative h-14">
          <Tooltip title={t("navbar.restaurant-menagment")} arrow>
            <button
              id="NavbarRestaurantsSectionButton"
              className={
                "relative mt-1 flex h-12 w-28 flex-col items-center justify-between rounded-xl fill-grey-2" +
                (isClickedRestaurants
                  ? " hover:bg-transpartent fill-primary dark:fill-secondary dark:hover:bg-none"
                  : " hover:bg-grey-1 dark:hover:bg-grey-4")
              }
              onClick={() =>
                navigate(
                  `/${JSON.parse(Cookies.get("userInfo") as string).login}/restaurants`
                )
              }
            >
              <svg
                className="absolute top-1/2 h-6 -translate-y-1/2 transform"
                viewBox="0 0 20 20"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-60.000000, -3119.000000)"
                >
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                      d="M21.7001111,2961 L18.3501111,2961 C18.5861111,2962.614 18.7931111,2964.818 18.4451111,2966.157 C18.6641111,2966.175 18.8931111,2966.19 19.1541111,2966.19 C20.5281111,2966.19 21.5281111,2965.897 21.8761111,2965.7 C22.1011111,2965.017 22.0161111,2963.048 21.7001111,2961 L21.7001111,2961 Z M20.0001111,2968.155 C18.8681111,2968.24 17.5941111,2968.172 16.5451111,2967.819 C14.9411111,2968.299 12.6941111,2968.329 11.1771111,2967.818 C10.3221111,2968.075 9.22311111,2968.225 8.00011111,2968.179 L8.00011111,2977 L13.0001111,2977 L13.0001111,2973 L15.0001111,2973 L15.0001111,2977 L20.0001111,2977 L20.0001111,2968.155 Z M6.14111111,2965.805 C6.40811111,2965.954 7.18211111,2966.19 8.41811111,2966.19 C8.82911111,2966.19 9.20211111,2966.162 9.53911111,2966.12 C9.23011111,2964.756 9.40911111,2962.59 9.61811111,2961 L6.26011111,2961 C5.97111111,2963.105 5.90911111,2965.125 6.14111111,2965.805 L6.14111111,2965.805 Z M11.5111111,2965.805 C12.5281111,2966.372 15.4871111,2966.279 16.5101111,2965.7 C16.7351111,2965.017 16.6501111,2963.048 16.3341111,2961 L11.6301111,2961 C11.3411111,2963.105 11.2791111,2965.125 11.5111111,2965.805 L11.5111111,2965.805 Z M23.3661111,2967.067 C23.0641111,2967.369 22.5801111,2967.609 22.0001111,2967.792 L22.0001111,2979 L6.00011111,2979 L6.00011111,2967.881 C5.37011111,2967.696 4.85611111,2967.428 4.56311111,2967.067 C3.29611111,2965.498 4.56311111,2959 4.56311111,2959 L23.3661111,2959 C23.3661111,2959 24.7921111,2965.641 23.3661111,2967.067 L23.3661111,2967.067 Z M10.0001111,2973 L12.0001111,2973 L12.0001111,2969 L10.0001111,2969 L10.0001111,2973 Z M16.0001111,2973 L18.0001111,2973 L18.0001111,2969 L16.0001111,2969 L16.0001111,2973 Z"
                      id="shop_center-[#1139]"
                    />
                  </g>
                </g>
              </svg>
            </button>
          </Tooltip>
>>>>>>> 33818509380a6cb4432c360eea2c123a6513df8e
          {isClickedRestaurants && (
            <span className="absolute bottom-0 h-[3px] w-full scale-y-100 transform bg-primary transition dark:bg-secondary" />
          )}
        </div>
      )}
    </div>
  );
};

export default Sections;
