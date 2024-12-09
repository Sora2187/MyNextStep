import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "./firebase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      //create user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User created successfully!!!");
    } catch (err) {
      setError(err.message); //if theres an error show it
    }
  };
  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>} {/* show error if any */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
