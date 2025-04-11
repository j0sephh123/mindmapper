import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const journeys = await prisma.journey.findMany();
  res.json(journeys);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  const journey = await prisma.journey.create({
    data: { name },
  });
  res.json(journey);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const journey = await prisma.journey.findUnique({
    where: { id: Number(id) },
  });
  res.json(journey);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const journey = await prisma.journey.update({
    where: { id: Number(id) },
    data: { name },
  });
  res.json(journey);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.journey.delete({
    where: { id: Number(id) },
  });
  res.json({ message: "Journey deleted" });
});

export default router;
