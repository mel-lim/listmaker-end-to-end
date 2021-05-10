import React, { useContext } from "react";
import { UserContext, GuestUserContext } from "../UserContext";
import { logoutApi } from "../api";


export const Logout = () => {

  const { setUser } = useContext(UserContext);
  const { setIsGuestUser } = useContext(GuestUserContext);

  const logout = async () => {
    try {
      // Call the api to get server to delete the cookies
      // Note, the cookie containing the JWT can only be deleted server-side because it is a http only cookie
      const { response, responseBodyText } = await logoutApi();
      console.log(responseBodyText);

      if (response.status === 200) {
        setUser(null);
        setIsGuestUser(false);
      }

      // Clear the localStorage
      localStorage.clear();
    } catch {
      console.error("Error in logout function. Cannot connect to server");
    }
  }

  const handleClick = event => {
    event.preventDefault();
    logout();
  }

  return (
    <div className="user-credentials logout">
      <h3>Confirm log out</h3>
      <input type="button"
        className="pillbox-button"
        value="Log Out"
        onClick={handleClick} />
    </div>
  );
}

