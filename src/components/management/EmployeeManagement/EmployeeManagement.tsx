import Cookies from "js-cookie";
import React, { useEffect } from "react";

interface EmployeeManagementProps {
    activeRestaurantId: number | null;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({activeRestaurantId}) => {

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //           const response = await fetch(`${process.env.REACT_APP_SERVER_IP}/my-restaurants/${activeRestaurantId}/employees`, {
    //             headers: {
    //               Authorization: `Bearer ${Cookies.get("token")}` as string,
    //             },
    //           });

    //           if (!response.ok) {
    //             const error = await response.json()
    //             console.log(error)
    //             throw new Error('Network response was not ok');
    //           }

    //           const data = await response.json();

    //           console.log(data)

    //         } catch (error) {
    //           console.error('Error fetching groups: ', error);
    //         };
    //       };
      
    //       fetchData();
    // }, [])


    return(
        <div className="bg-primary w-[300px] h-[300px]">
          
        </div>
    )
}

export default EmployeeManagement