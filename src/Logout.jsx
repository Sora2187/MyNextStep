import { auth } from "./firebase";
import { signOut } from "firebase/auth";

const Logout = () => {
  const handleLogout = async () => {
    try {
      //Sign the user out
      await signOut(auth);
      alert("Logged out successfully!!");
    } catch (err) {
      console.error("Logout error: ", err.message);
    }
  };
  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Logout;
