import React, { useState, useEffect } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Quote Carousel Component
const QuoteCarousel = () => {
  const quotes = [
    "Success is not the key to happiness. Happiness is the key to success.",
    "The only way to do great work is to love what you do.",
    "It always seems impossible until it's done.",
    "Believe you can and you're halfway there.",
    "Don’t watch the clock; do what it does. Keep going.",
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) =>
        prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [quotes.length]);

  return (
    <div className="quote-carousel bg-gray-200 p-4 rounded-lg shadow-md">
      <p className="text-lg font-semibold text-center">
        {quotes[currentQuoteIndex]}
      </p>
    </div>
  );
};

// Goal Progress Component
const GoalProgress = ({ progress }) => {
  const getProgressStyle = (progress) => ({
    width: `${progress}%`,
    height: "100%",
    backgroundColor: progress === 100 ? "green" : "blue",
    borderRadius: "0.5rem",
  });

  return (
    <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
      <div
        className="h-2.5 rounded-full"
        style={getProgressStyle(progress)}
      ></div>
    </div>
  );
};

function GoalList({ goals, refreshGoals, currentUser }) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [notifiedGoals, setNotifiedGoals] = useState(new Set());

  const regularGoals = goals.filter((goal) => goal.type === "goal");
  const dailyGoals = goals.filter((goal) => goal.type === "daily");

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());

      dailyGoals.forEach((goal) => {
        if (
          !notifiedGoals.has(goal.id) &&
          goal.reminder &&
          currentTime >= new Date(goal.reminder).getTime()
        ) {
          alert(`Reminder: ${goal.title}`);
          setNotifiedGoals((prev) => new Set(prev.add(goal.id))); // Mark goal as notified
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [currentTime, dailyGoals, notifiedGoals]);

  const handleDelete = async (goalId) => {
    try {
      await deleteDoc(doc(db, "goals", goalId));
      refreshGoals();
    } catch (error) {
      console.error("Error deleting goal:", error.message);
      alert("Failed to delete goal.");
    }
  };

  const markRegularGoalAsCompleted = async (goalId) => {
    try {
      const goalRef = doc(db, "goals", goalId);
      await updateDoc(goalRef, { progress: 100, completed: true });
      refreshGoals();
    } catch (error) {
      console.error("Error marking goal as completed: ", error);
    }
  };

  const markDailyGoalAsCompleted = async (goalId) => {
    try {
      const goalRef = doc(db, "goals", goalId);
      await updateDoc(goalRef, { completed: true, progress: 100 });
      refreshGoals();
    } catch (error) {
      console.error("Error marking daily goal as completed: ", error);
    }
  };

  const updateProgress = async (goalId, newProgress) => {
    try {
      const goalRef = doc(db, "goals", goalId);
      await updateDoc(goalRef, { progress: newProgress });
      refreshGoals(); // Optionally refresh goals after the update
    } catch (error) {
      console.error("Error updating progress: ", error);
    }
  };

  return (
    <div>
      <QuoteCarousel />

      <h3 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">
        Regular Goals
      </h3>
      <ul className="space-y-4 mb-6">
        {regularGoals.map((goal) => (
          <li key={goal.id} className="p-4 rounded-lg shadow-md bg-gray-100">
            <h4 className="text-xl font-bold">{goal.title}</h4>
            <p className="text-gray-600">
              {goal.description || "No description"}
            </p>
            <p className="text-sm text-gray-500">
              Deadline: {formatDate(goal.deadline)}
            </p>
            <GoalProgress progress={goal.progress || 0} />
            <p className="text-sm mt-1">{goal.progress || 0}% completed</p>
            <input
              type="range"
              min="0"
              max="100"
              value={goal.progress || 0}
              onChange={(e) => updateProgress(goal.id, Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleDelete(goal.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
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

      <h3 className="text-2xl font-semibold text-gray-800 mb-2">Daily Goals</h3>
      <ul className="space-y-4">
        {dailyGoals.map((goal) => (
          <li key={goal.id} className="p-4 rounded-lg shadow-md bg-gray-100">
            <h4 className="text-xl font-bold">{goal.title}</h4>
            <p className="text-gray-600">
              {goal.description || "No description"}
            </p>
            <p className="text-sm text-gray-500">
              Deadline: {formatDate(goal.deadline)}
            </p>
            <GoalProgress progress={goal.completed ? 100 : 0} />
            <p className="text-sm mt-1">
              {goal.completed ? "Completed" : "Not Completed"}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleDelete(goal.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
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
