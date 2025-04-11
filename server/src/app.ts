import express from "express";
import cors from "cors";
import journeyRoutes from "./routes/journey";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/journeys", journeyRoutes);

export default app;
