import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchJourneys, Journey } from "../api/journeys";
import { QUERY_KEYS } from "../constants/queryKeys";

export function JourneyPage() {
  const { id } = useParams();
  const { data: journeys = [] } = useQuery<Journey[]>({
    queryKey: [QUERY_KEYS.JOURNEYS],
    queryFn: fetchJourneys,
  });

  const journey = journeys.find((j) => j.id === Number(id));

  if (!journey) {
    return <div className="text-gray-200">Journey not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-200">{journey.name}</h1>
    </div>
  );
}
