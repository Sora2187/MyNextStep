import React, { useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

function AddGoal({ refreshGoals }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("goal");
  const [deadline, setDeadline] = useState(""); // For goal deadlines
  const [reminder, setReminder] = useState(""); // New: Reminder date & time

  const handleAddGoal = async () => {
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to add goals.");
        return;
      }

      // For daily goals, set deadline to today's midnight
      let adjustedDeadline = deadline;
      if (type === "daily") {
        adjustedDeadline = new Date().setHours(23, 59, 59, 999); // Set to midnight today
      }

      await addDoc(collection(db, "goals"), {
        userId: user.uid,
        title,
        description,
        type,
        deadline: adjustedDeadline,
        reminder, // Save reminder timestamp
        progress: 0,
        completed: false, // Initially not completed
        createdAt: new Date(),
      });

      alert("Goal added successfully!");
      refreshGoals();
      setTitle("");
      setDescription("");
      setDeadline("");
      setReminder("");
    } catch (error) {
      console.error("Error adding goal: ", error);
      alert("Failed to add goal.");
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-4">Add a New Goal</h3>
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 mb-3 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 mb-3 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label className="block mb-2">Goal Type</label>
      <select
        className="w-full p-2 mb-3 border rounded"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="goal">Regular Goal</option>
        <option value="daily">Daily Goal</option>
      </select>
      {type === "goal" && (
        <>
          <label className="block mb-2">Deadline</label>
          <input
            type="datetime-local"
            className="w-full p-2 mb-3 border rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </>
      )}
      <label className="block mb-2">Reminder Time</label>
      <input
        type="datetime-local"
        className="w-full p-2 mb-3 border rounded"
        value={reminder}
        onChange={(e) => setReminder(e.target.value)}
      />
      <button
        onClick={handleAddGoal}
        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Add Goal
      </button>
    </div>
  );
}

export default AddGoal;
