export const fetchGET = (connString : string) => {
    
}

export const fetchPOST = async (connString : string, body : string) => {
    const response = await fetch(
        `${process.env.REACT_APP_SERVER_IP}${connString}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: body,
        },
      );

      if (!response.ok) {
        const errorData = await response.json()
        console.log(errorData);
        throw new Error("Wrong login data")
      }

      const data = await response.json();

      return data
}