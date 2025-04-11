import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchJourneys, createJourney, Journey } from "../api/journeys";
import { QUERY_KEYS } from "../constants/queryKeys";
import { useInvalidateQueries } from "./useInvalidateQueries";

export const useJourneys = () => {
  const { invalidateJourneys } = useInvalidateQueries();

  const {
    data: journeys = [],
    isLoading,
    error,
  } = useQuery<Journey[]>({
    queryKey: [QUERY_KEYS.JOURNEYS],
    queryFn: fetchJourneys,
  });

  const { mutate: createJourneyMutation, isPending } = useMutation({
    mutationFn: createJourney,
    onSuccess: invalidateJourneys,
  });

  return {
    journeys,
    isLoading,
    error,
    createJourney: createJourneyMutation,
    isCreating: isPending,
  };
};
