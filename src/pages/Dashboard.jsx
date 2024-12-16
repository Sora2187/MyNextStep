import React, { useState, useEffect } from "react";
import AddGoal from "../components/AddGoal";
import GoalList from "../components/GoalList";
import QuoteCarousel from "../components/QuoteCarousel"; // Import the carousel
import { Link } from "react-router-dom"; // Import Link for navigation
import { db, auth } from "../firebase/firebase"; // Import both db and auth
import { collection, getDocs, query, where } from "firebase/firestore";
import Logout from "../components/Logout";

function Dashboard() {
  const [goals, setGoals] = useState([]);

  // Fetch user-specific goals
  const fetchGoals = async () => {
    try {
      const user = auth.currentUser; // Get the current logged-in user
      if (!user) {
        alert("You must be logged in to view your goals.");
        return;
      }

      // Query goals where "userId" matches the current user's UID
      const q = query(collection(db, "goals"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      // Map the retrieved goals to an array
      const goalArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalArray);
    } catch (error) {
      alert("Error fetching goals: " + error.message);
    }
  };

  useEffect(() => {
    fetchGoals(); // Fetch goals when the component mounts
  }, []);

  return (
    <div>
      <h2>Welcome to Your Dashboard</h2>
      {/* Render the Logout component */}
      <Logout />
      {/* Settings navigation */}
      <Link to="/settings">Go to Settings</Link>

      {/* Goal management components */}
      <AddGoal refreshGoals={fetchGoals} />
      <GoalList goals={goals} refreshGoals={fetchGoals} />

      {/* Motivational Quote Carousel */}
      <QuoteCarousel />
    </div>
  );
}

export default Dashboard;
