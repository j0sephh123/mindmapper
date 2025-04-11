import { useJourneys } from "../hooks/useJourneys";
import { JourneyListItem } from "./JourneyListItem";

export function JourneyList() {
  const { journeys, isLoading } = useJourneys();

  if (isLoading) return <div className="text-gray-200">Loading...</div>;

  return (
    <ul className="space-y-4">
      {journeys.map((journey) => (
        <JourneyListItem key={journey.id} journey={journey} />
      ))}
    </ul>
  );
}
