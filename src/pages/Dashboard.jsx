import React, { useState, useEffect } from "react";
import AddGoal from "../components/AddGoal";
import GoalList from "../components/GoalList";
import QuoteCarousel from "../components/QuoteCarousel";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Logout from "../components/Logout";

function Dashboard() {
  const [goals, setGoals] = useState([]);

  const fetchGoals = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to view your goals.");
        return;
      }

      const q = query(collection(db, "goals"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const goalArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const validGoals = goalArray.filter((goal) => {
        if (goal.type === "daily" && new Date(goal.deadline) < new Date()) {
          deleteGoal(goal.id);
          return false;
        }
        return true;
      });

      setGoals(validGoals);
    } catch (error) {
      alert("Error fetching goals: " + error.message);
    }
  };

  const deleteGoal = async (goalId) => {
    const goalRef = doc(db, "goals", goalId);
    await deleteDoc(goalRef);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-950 to-purple-900 min-h-screen p-6 text-white font-sans">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <h2 className="text-4xl font-bold text-yellow-400 tracking-wider">
          Your Goals Dashboard
        </h2>
        <div className="mt-4 sm:mt-0">
          <Logout />
        </div>
      </header>

      {/* Navigation Link */}
      <nav className="mb-8 text-center">
        <Link
          to="/settings"
          className="text-blue-300 underline hover:text-blue-200 transition duration-300"
        >
          Go to Settings
        </Link>
      </nav>

      {/* Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Goal Section */}
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-2xl font-semibold text-indigo-600 border-b pb-2">
            Add a Goal
          </h3>
          <div className="space-y-4">
            <AddGoal refreshGoals={fetchGoals} />
          </div>
        </div>

        {/* Goals List Section */}
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-2xl font-semibold text-indigo-600 border-b pb-2">
            Your Goals
          </h3>
          <div className="space-y-2 text-sm">
            <GoalList goals={goals} refreshGoals={fetchGoals} />
          </div>
        </div>
      </div>

      {/* Motivational Quotes Section */}
      <div className="mt-10 text-center text-gray-300 italic">
        <QuoteCarousel />
      </div>
    </div>
  );
}

export default Dashboard;
