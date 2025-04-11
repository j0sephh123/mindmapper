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
