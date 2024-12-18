import React, { useEffect, useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function GoalList({ goals, refreshGoals }) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [notifiedGoals, setNotifiedGoals] = useState(new Set()); // Track notified goals

  const regularGoals = goals.filter((goal) => goal.type === "goal");
  const dailyGoals = goals.filter((goal) => goal.type === "daily");

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Request notification permission when the component mounts
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    }
  }, []);

  // Handle Delete
  const handleDelete = async (goalId) => {
    try {
      await deleteDoc(doc(db, "goals", goalId));
      refreshGoals();
    } catch (error) {
      console.error("Error deleting goal:", error.message);
      alert("Failed to delete goal.");
    }
  };

  // Handle Mark as Complete
  const markRegularGoalAsCompleted = async (goalId) => {
    try {
      const goalRef = doc(db, "goals", goalId);
      await updateDoc(goalRef, {
        progress: 100,
        completed: true,
      });
      console.log("Regular goal marked as completed");
      refreshGoals();
    } catch (error) {
      console.error("Error marking goal as completed: ", error);
    }
  };

  const markDailyGoalAsCompleted = async (goalId) => {
    try {
      const goalRef = doc(db, "goals", goalId);
      await updateDoc(goalRef, {
        completed: true,
        progress: 100,
      });
      console.log("Daily goal marked as completed");
      refreshGoals();
    } catch (error) {
      console.error("Error marking daily goal as completed: ", error);
    }
  };

  // Check if the reminder is triggered
  const isReminderTriggered = (reminderTime, goalTitle, goalId) => {
    if (reminderTime) {
      const reminderDate = new Date(reminderTime);
      if (currentTime >= reminderDate.getTime()) {
        if (!notifiedGoals.has(goalId)) {
          if (Notification.permission === "granted") {
            new Notification("Goal Reminder", {
              body: `Reminder: ${goalTitle} is due now!`,
              icon: "/path/to/your/icon.png",
            });
          }
          setNotifiedGoals((prev) => new Set(prev.add(goalId)));
        }
        return true;
      }
    }
    return false;
  };

  // Progress bar calculation
  const getProgressStyle = (progress) => {
    return {
      width: `${progress}%`,
      height: "100%",
      backgroundColor: progress === 100 ? "green" : "blue", // Green for completed, Blue for in-progress
      borderRadius: "0.5rem",
    };
  };

  return (
    <div>
      {/* Regular Goals */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        Regular Goals
      </h3>
      <ul className="space-y-4 mb-6">
        {regularGoals.map((goal) => (
          <li
            key={goal.id}
            className={`p-4 rounded-lg shadow-md ${
              isReminderTriggered(goal.reminder, goal.title, goal.id)
                ? "bg-gray-100"
                : "bg-gray-100"
            }`}
          >
            <h4 className="text-xl font-bold">{goal.title}</h4>
            <p className="text-gray-600">
              {goal.description || "No description"}
            </p>
            <p className="text-sm text-gray-500">
              Deadline: {formatDate(goal.deadline)}
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
              <div
                className="h-2.5 rounded-full"
                style={getProgressStyle(goal.progress || 0)}
              ></div>
            </div>
            <p className="text-sm mt-1">{goal.progress || 0}% completed</p>
            <div className="flex gap-2 mt-3">
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(goal.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
              {/* Mark as Complete Button */}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => markRegularGoalAsCompleted(goal.id)}
              >
                Mark as Completed
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Daily Goals */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">Daily Goals</h3>
      <ul className="space-y-4">
        {dailyGoals.map((goal) => (
          <li
            key={goal.id}
            className={`p-4 rounded-lg shadow-md ${
              isReminderTriggered(goal.reminder, goal.title, goal.id)
                ? "bg-gray-100"
                : "bg-gray-100"
            }`}
          >
            <h4 className="text-xl font-bold">{goal.title}</h4>
            <p className="text-gray-600">
              {goal.description || "No description"}
            </p>
            <p className="text-sm text-gray-500">
              Deadline: {formatDate(goal.deadline)}
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
              <div
                className="h-2.5 rounded-full"
                style={getProgressStyle(goal.progress === 100 ? 100 : 0)}
              ></div>
            </div>
            <p className="text-sm mt-1">
              {goal.progress === 100 ? "Completed" : "Not Completed"}
            </p>
            <div className="flex gap-2 mt-3">
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(goal.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
              {/* Mark as Complete Button */}
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => markDailyGoalAsCompleted(goal.id)}
              >
                Mark as Completed
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GoalList;
