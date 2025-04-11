import { useQuery } from "@tanstack/react-query";

export default function App() {
  const { data: message } = useQuery({
    queryKey: ["hello"],
    queryFn: () => fetch("http://localhost:3000").then((res) => res.text()),
  });

  return <div className="text-3xl text-amber-50">{message}</div>;
}
