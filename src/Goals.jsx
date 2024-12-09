// src/Goals.js
import { useState, useEffect } from "react";
import { firestore } from "./firebase";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    const unsubscribe = firestore.collection("goals").onSnapshot((snapshot) => {
      const goalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsData);
    });

    return () => unsubscribe();
  }, []);

  const addGoal = async () => {
    if (newGoal.trim()) {
      await firestore.collection("goals").add({
        goal: newGoal,
        deadline: new Date(), // You can store deadlines in any format you prefer
        progress: 0, // Start progress at 0
      });
      setNewGoal("");
    }
  };

  return (
    <div>
      <h2>Your Goals</h2>
      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>{goal.goal}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
        placeholder="New goal"
      />
      <button onClick={addGoal}>Add Goal</button>
    </div>
  );
};

export default Goals;
