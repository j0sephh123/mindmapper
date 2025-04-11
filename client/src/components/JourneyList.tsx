import { useJourneys } from "../hooks/useJourneys";
import { timeAgo } from "../utils/timeAgo";

export function JourneyList() {
  const { journeys, isLoading } = useJourneys();

  if (isLoading) return <div className="text-gray-200">Loading...</div>;

  return (
    <ul className="space-y-4">
      {journeys.map((journey) => (
        <li
          key={journey.id}
          className="p-4 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 text-gray-200"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{journey.name}</span>
            <span className="text-sm text-gray-400">
              {timeAgo(journey.createdAt)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
