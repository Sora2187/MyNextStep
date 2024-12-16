import React from "react";
import { db } from "../firebase/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

function GoalList({ goals, refreshGoals }) {
  const dailyGoals = goals.filter((goal) => goal.type === "daily");
  const regularGoals = goals.filter((goal) => goal.type === "regular");

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "goals", id));
      refreshGoals(); // Refresh the goal list after deletion
    } catch (error) {
      alert("Error deleting goal: " + error.message);
    }
  };

  const handleComplete = async (id, completed) => {
    try {
      const goalRef = doc(db, "goals", id);
      await updateDoc(goalRef, { completed: !completed }); // Toggle completion status
      refreshGoals();
    } catch (error) {
      alert("Error updating goal: " + error.message);
    }
  };

  return (
    <div>
      <h3>Your Goals</h3>

      <h4>Regular Goals</h4>
      {regularGoals.length === 0 ? (
        <p>No regular goals added yet.</p>
      ) : (
        <ul>
          {regularGoals.map((goal) => (
            <li key={goal.id}>
              {goal.goal}
              <button onClick={() => handleDelete(goal.id)}>Delete</button>
              <button onClick={() => handleComplete(goal.id, goal.completed)}>
                {goal.completed ? "Unmark Completed" : "Mark as Completed"}
              </button>
            </li>
          ))}
        </ul>
      )}

      <h4>Daily Goals</h4>
      {dailyGoals.length === 0 ? (
        <p>No daily goals added yet.</p>
      ) : (
        <ul>
          {dailyGoals.map((goal) => (
            <li key={goal.id}>
              {goal.goal}
              <button onClick={() => handleDelete(goal.id)}>Delete</button>
              <button onClick={() => handleComplete(goal.id, goal.completed)}>
                {goal.completed ? "Unmark Completed" : "Mark as Completed"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default GoalList;
