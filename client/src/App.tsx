import { useState, useEffect } from "react";

interface Journey {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [newJourney, setNewJourney] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/journeys")
      .then((res) => res.json())
      .then((data) => setJourneys(data));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/journeys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newJourney }),
    })
      .then((res) => res.json())
      .then((data) => {
        setJourneys([...journeys, data]);
        setNewJourney("");
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Journeys</h1>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <input
          type="text"
          value={newJourney}
          onChange={(e) => setNewJourney(e.target.value)}
          placeholder="New journey name"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Journey
        </button>
      </form>
      <ul className="space-y-4">
        {journeys.map((journey) => (
          <li
            key={journey.id}
            className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            {journey.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
