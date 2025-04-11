import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  const invalidateJourneys = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JOURNEYS] });
  };

  return {
    invalidateJourneys,
  };
};
