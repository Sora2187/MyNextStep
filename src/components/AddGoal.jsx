import React, { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

function AddGoal({ refreshGoals }) {
  const [goal, setGoal] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");

  const handleGoalSubmit = async (e) => {
    e.preventDefault();

    // Get the current user
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to add goals.");
      return;
    }

    try {
      // Add regular goal
      if (goal) {
        await addDoc(collection(db, "goals"), {
          goal,
          completed: false,
          createdAt: new Date(),
          type: "regular",
          userId: user.uid, // Link the goal to the logged-in user
        });
      }

      // Add daily goal
      if (dailyGoal) {
        await addDoc(collection(db, "goals"), {
          goal: dailyGoal,
          completed: false,
          createdAt: new Date(),
          type: "daily",
          deadline: new Date().setHours(23, 59, 59, 999), // End of day deadline
          userId: user.uid, // Link the goal to the logged-in user
        });
      }

      // Clear inputs and refresh goals
      setGoal("");
      setDailyGoal("");
      alert("Goal added!");
      refreshGoals();
    } catch (error) {
      alert("Error adding goal: " + error.message);
    }
  };

  return (
    <div>
      <h3>Add a Goal</h3>
      <form onSubmit={handleGoalSubmit}>
        <input
          type="text"
          placeholder="Enter your goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button type="submit">Add Goal</button>
      </form>

      <h3>Add a Daily Goal</h3>
      <form onSubmit={handleGoalSubmit}>
        <input
          type="text"
          placeholder="Enter your daily goal"
          value={dailyGoal}
          onChange={(e) => setDailyGoal(e.target.value)}
        />
        <button type="submit">Add Daily Goal</button>
      </form>
    </div>
  );
}

export default AddGoal;
