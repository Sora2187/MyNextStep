import React from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function Settings({ refreshGoals }) {
  const deleteAllGoals = async () => {
    const querySnapshot = await getDocs(collection(db, "goals"));
    querySnapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "goals", docSnap.id));
    });
    refreshGoals(); // Refresh goals after deletion
    alert("All goals deleted!");
  };

  return (
    <div>
      <h2>Settings</h2>
      <button onClick={deleteAllGoals}>Delete All Goals</button>
      {/* You can add more user preference controls here */}
    </div>
  );
}

export default Settings;
