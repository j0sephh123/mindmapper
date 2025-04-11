import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJourneys, createJourney, Journey } from "../api/journeys";

export const useJourneys = () => {
  const queryClient = useQueryClient();

  const {
    data: journeys = [],
    isLoading,
    error,
  } = useQuery<Journey[]>({
    queryKey: ["journeys"],
    queryFn: fetchJourneys,
  });

  const { mutate: createJourneyMutation, isPending } = useMutation({
    mutationFn: createJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
    },
  });

  return {
    journeys,
    isLoading,
    error,
    createJourney: createJourneyMutation,
    isCreating: isPending,
  };
};
