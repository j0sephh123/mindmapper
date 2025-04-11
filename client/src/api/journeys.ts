export interface Journey {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchJourneys = async (): Promise<Journey[]> => {
  const res = await fetch("http://localhost:3000/api/journeys");
  return res.json();
};

export const createJourney = async (name: string): Promise<Journey> => {
  console.log({ name });

  const res = await fetch("http://localhost:3000/api/journeys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  return res.json();
};
