export interface Journey {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = "http://localhost:3000/api/journeys";
const headers = {
  "Content-Type": "application/json",
};

export const fetchJourneys = async (): Promise<Journey[]> => {
  const res = await fetch(API_URL);
  return res.json();
};

export const createJourney = async (name: string): Promise<Journey> => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const updateJourney = async (
  id: number,
  name: string
): Promise<Journey> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const deleteJourney = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};

// Fetch a single journey by ID
export const fetchJourneyById = async (id: number): Promise<Journey> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    // Distinguish between 404 and other errors
    if (res.status === 404) {
      throw new Error("Journey not found");
    }
    throw new Error("Failed to fetch journey details");
  }
  return res.json();
};

// --- Tree Node Types and API Functions ---

export interface TreeNodeData {
  id: string; // Assuming string IDs from the backend for nodes
  name: string;
  content?: string; // Optional content for the node
  children?: TreeNodeData[];
}

// Fetch the tree structure for a specific journey
export const fetchJourneyTree = async (
  journeyId: number
): Promise<TreeNodeData[]> => {
  const res = await fetch(`${API_URL}/${journeyId}/tree`);
  if (!res.ok) {
    throw new Error("Failed to fetch journey tree");
  }
  return res.json();
};

// Add a new node to the tree
export const addTreeNode = async (
  journeyId: number,
  parentId: string | null, // null parentId means adding a root node
  nodeData: { name: string; content?: string }
): Promise<TreeNodeData> => {
  const res = await fetch(`${API_URL}/${journeyId}/tree/nodes`, {
    method: "POST",
    headers,
    body: JSON.stringify({ parentId, ...nodeData }),
  });
  if (!res.ok) {
    throw new Error("Failed to add tree node");
  }
  return res.json();
};

// Delete a specific tree node
export const deleteTreeNode = async (
  journeyId: number,
  nodeId: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/${journeyId}/tree/nodes/${nodeId}`, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 204) {
    // Allow 204 No Content as success
    // Handle errors, e.g., node not found (404)
    const errorData = await res.json().catch(() => ({})); // Try to parse error JSON
    throw new Error(errorData.message || "Failed to delete tree node");
  }
  // No need to return anything on successful delete (or 204)
};
