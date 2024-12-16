import React from "react";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("You have logged out.");
      navigate("/"); // Redirect to the login page after logging out
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
