import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase/firebase"; // Make sure firebase is configured correctly
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings"; // Import Settings Page

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
