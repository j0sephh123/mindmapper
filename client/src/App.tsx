import { JourneyList } from "./components/JourneyList";
import { CreateJourneyForm } from "./components/CreateJourneyForm";

export default function App() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-200">Journeys</h1>
        <CreateJourneyForm />
      </div>
      <JourneyList />
    </div>
  );
}
