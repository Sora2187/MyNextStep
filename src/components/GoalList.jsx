import React from "react";
import { db } from "../firebase/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore"; // Import updateDoc

function GoalList({ goals, refreshGoals }) {
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "goals", id));
      alert("Goal deleted!");
      refreshGoals();
    } catch (error) {
      alert("Error deleting goal: " + error.message);
    }
  };

  const handleComplete = async (id, completed) => {
    try {
      const goalRef = doc(db, "goals", id);
      await updateDoc(goalRef, { completed: !completed }); // Toggle completed status
      refreshGoals();
    } catch (error) {
      alert("Error marking goal as completed: " + error.message);
    }
  };

  return (
    <div>
      <h3>Your Goals</h3>
      {goals.length === 0 ? (
        <p>No goals added yet.</p>
      ) : (
        <ul>
          {goals.map((goal) => (
            <li key={goal.id}>
              {goal.goal}
              <button onClick={() => handleDelete(goal.id)}>Delete</button>
              <button onClick={() => handleComplete(goal.id, goal.completed)}>
                {goal.completed ? "Unmark Completed" : "Mark as Completed"}
              </button>{" "}
              {/* Mark as completed button */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GoalList;
