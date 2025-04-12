import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  // fetchJourneys, // No longer need to fetch all journeys here
  Journey,
  fetchJourneyById, // Import the new function
  fetchJourneyTree,
  addTreeNode,
  deleteTreeNode, // Import delete function
  TreeNodeData,
} from "../api/journeys";
import { QUERY_KEYS } from "../constants/queryKeys";
import { Tree } from "../components/Tree";

export function JourneyPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const journeyId = Number(id);

  // Fetch the specific journey details using its ID
  const {
    data: journey,
    isLoading: isJourneyLoading,
    error: journeyError,
  } = useQuery<Journey>({
    queryKey: [QUERY_KEYS.JOURNEYS, journeyId], // Use specific key
    queryFn: () => fetchJourneyById(journeyId),
    enabled: !!journeyId, // Enable only when journeyId is valid
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      return error?.message !== "Journey not found" && failureCount < 2;
    },
  });

  // Fetch the tree data for this journey (keep this)
  const {
    data: treeData = [],
    isLoading: isTreeLoading,
    error: treeError,
  } = useQuery<TreeNodeData[]>({
    queryKey: [QUERY_KEYS.JOURNEY_TREE, journeyId],
    queryFn: () => fetchJourneyTree(journeyId),
    enabled: !!journeyId && !!journey, // Only fetch tree if journey exists
  });

  // Mutation for adding a new node (keep this)
  const { mutate: addNodeMutation } = useMutation({
    mutationFn: (newNode: {
      parentId: string | null;
      name: string;
      content?: string;
    }) =>
      addTreeNode(journeyId, newNode.parentId, {
        name: newNode.name,
        content: newNode.content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.JOURNEY_TREE, journeyId],
      });
    },
    onError: (error) => {
      console.error("Failed to add node:", error);
    },
  });

  // --- Mutation for deleting a node ---
  const { mutate: deleteNodeMutation } = useMutation({
    mutationFn: (nodeId: string) => deleteTreeNode(journeyId, nodeId),
    onSuccess: () => {
      // Invalidate and refetch the tree data after successful deletion
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.JOURNEY_TREE, journeyId],
      });
    },
    onError: (error) => {
      // Handle error, e.g., show a notification
      console.error("Failed to delete node:", error);
      alert(`Error deleting node: ${(error as Error)?.message}`); // Simple alert for now
    },
  });

  // Handle Loading and Not Found states
  if (isJourneyLoading) {
    return <div className="text-gray-200">Loading Journey...</div>;
  }

  if (journeyError) {
    // Check if the error is 'Journey not found'
    if ((journeyError as Error)?.message === "Journey not found") {
      return <div className="text-gray-200">Journey not found</div>;
    }
    return (
      <div className="text-red-400">
        Error loading journey: {(journeyError as Error)?.message}
      </div>
    );
  }

  // If journey exists, proceed to potentially load tree
  if (!journey) {
    // This case might be redundant due to error handling above, but safe to keep
    return <div className="text-gray-200">Journey not found</div>;
  }

  const handleAddNode = (
    parentId: string | null,
    newNodeData: { name: string; content?: string }
  ) => {
    addNodeMutation({ parentId, ...newNodeData });
  };

  // --- Handler for deleting a node ---
  const handleDeleteNode = (nodeId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this node and all its children?"
      )
    ) {
      deleteNodeMutation(nodeId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-200 mb-6">{journey.name}</h1>
      {isTreeLoading ? (
        <div className="text-gray-200">Loading Tree...</div>
      ) : treeError ? (
        <div className="text-red-400">
          Error loading tree: {(treeError as Error)?.message}
        </div>
      ) : (
        <Tree
          data={treeData}
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode}
        />
      )}
    </div>
  );
}
