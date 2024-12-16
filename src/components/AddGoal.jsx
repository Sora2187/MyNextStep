import React, { useState } from "react";
import { db, auth } from "../firebase/firebase"; // Ensure firebase config is correct
import { collection, addDoc } from "firebase/firestore";

function AddGoal({ refreshGoals }) {
  const [goal, setGoal] = useState("");

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    if (!goal) return;

    try {
      // Get the current logged-in user's UID
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to add goals.");
        return;
      }

      // Add the goal with the user's UID
      await addDoc(collection(db, "goals"), {
        goal,
        completed: false,
        createdAt: new Date(),
        userId: user.uid, // Store user UID with the goal
      });

      setGoal(""); // Reset goal input after successful submit
      alert("Goal added!");
      refreshGoals(); // Refresh goals after adding
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
          required
        />
        <button type="submit">Add Goal</button>
      </form>
    </div>
  );
}

export default AddGoal;
