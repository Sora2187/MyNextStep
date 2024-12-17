import React, { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

function AddGoal({ refreshGoals }) {
  const [goalType, setGoalType] = useState("goal"); // Default to regular goal
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to add a goal.");
      return;
    }

    if (!title) {
      alert("Title is required!");
      return;
    }

    try {
      const goalRef = collection(db, "goals");
      const goalData = {
        title,
        userId: user.uid,
        createdAt: new Date(),
        type: goalType,
      };

      // Add extra fields for regular goals
      if (goalType === "goal") {
        goalData.description = description;
        goalData.deadline = deadline;
        goalData.progress = Number(progress);
      }

      await addDoc(goalRef, goalData);

      // Reset the form
      setTitle("");
      setDescription("");
      setDeadline("");
      setProgress(0);
      setGoalType("goal");

      refreshGoals();
    } catch (error) {
      alert("Error adding goal: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleAddGoal}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-2xl font-semibold text-gray-800">Add New Goal</h3>

      {/* Goal Type Selector */}
      <div className="flex items-center gap-4">
        <label className="text-gray-700 font-medium">
          <input
            type="radio"
            value="goal"
            checked={goalType === "goal"}
            onChange={() => setGoalType("goal")}
            className="mr-2"
          />
          Regular Goal
        </label>
        <label className="text-gray-700 font-medium">
          <input
            type="radio"
            value="daily"
            checked={goalType === "daily"}
            onChange={() => setGoalType("daily")}
            className="mr-2"
          />
          Daily Goal
        </label>
      </div>

      {/* Common Field */}
      <input
        type="text"
        placeholder="Goal Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Regular Goal Fields */}
      {goalType === "goal" && (
        <>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
          ></textarea>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Progress (0-100)"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            min="0"
            max="100"
          />
        </>
      )}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
      >
        Add Goal
      </button>
    </form>
  );
}

export default AddGoal;
