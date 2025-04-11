import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JourneyList } from "./components/JourneyList";
import { CreateJourneyForm } from "./components/CreateJourneyForm";
import { JourneyPage } from "./pages/JourneyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-2xl mx-auto p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-200">Journeys</h1>
                <CreateJourneyForm />
              </div>
              <JourneyList />
            </div>
          }
        />
        <Route path="/journeys/:id" element={<JourneyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
