import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import { logoutApi } from "../api";


export const Logout = () => {

  const { setUser } = useContext(UserContext);

  const logout = async () => {
    // Delete the cookies
    // Note, the cookie containing the JWT can only be deleted server-side because it is a http only cookie
    const { response, responseBodyText } = await logoutApi();
    console.log(responseBodyText);

    if (response.status === 200) {
      setUser(null);
    }

    // Clear the localStorage
    localStorage.clear();
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

