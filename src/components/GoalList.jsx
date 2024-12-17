import React from "react";

function GoalList({ goals }) {
  const regularGoals = goals.filter((goal) => goal.type === "goal");
  const dailyGoals = goals.filter((goal) => goal.type === "daily");

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  return (
    <div>
      {/* Regular Goals */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">
        Regular Goals
      </h3>
      <ul className="space-y-4 mb-6">
        {regularGoals.map((goal) => (
          <li key={goal.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h4 className="text-xl font-bold">{goal.title}</h4>
            <p className="text-gray-600">
              {goal.description || "No description"}
            </p>
            <p className="text-sm text-gray-500">
              Deadline: {formatDate(goal.deadline)}
            </p>
            <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${goal.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-sm mt-1">{goal.progress || 0}% completed</p>
          </li>
        ))}
      </ul>

      {/* Daily Goals */}
      <h3 className="text-2xl font-semibold text-gray-800 mb-2">Daily Goals</h3>
      <ul className="space-y-4">
        {dailyGoals.map((goal) => (
          <li key={goal.id} className="p-4 bg-yellow-100 rounded-lg shadow-md">
            <h4 className="text-xl font-bold">{goal.title}</h4>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GoalList;
