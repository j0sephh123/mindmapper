import express from "express";
import cors from "cors";
import { PrismaClient, TreeNode } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JOURNEY_API_PREFIX = "/api/journeys";

// --- Helper Function to Build Tree ---
interface TreeNodeWithChildren extends TreeNode {
  children: TreeNodeWithChildren[];
}

function buildTree(nodes: TreeNode[]): TreeNodeWithChildren[] {
  const nodeMap: { [key: string]: TreeNodeWithChildren } = {};
  const roots: TreeNodeWithChildren[] = [];

  nodes.forEach((node) => {
    nodeMap[node.id] = { ...node, children: [] };
  });

  nodes.forEach((node) => {
    if (node.parentId && nodeMap[node.parentId]) {
      nodeMap[node.parentId].children.push(nodeMap[node.id]);
    } else {
      roots.push(nodeMap[node.id]);
    }
  });

  return roots;
}

// @ts-ignore - Temporarily ignore TS error, investigate environment/types
app.get(JOURNEY_API_PREFIX, async (req, res) => {
  try {
    const journeys = await prisma.journey.findMany();
    res.json(journeys);
  } catch (error) {
    console.error("Error fetching journeys:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @ts-ignore - Temporarily ignore TS error, investigate environment/types
app.post(JOURNEY_API_PREFIX, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Journey name is required" });
    }
    const journey = await prisma.journey.create({
      data: { name },
    });
    res.status(201).json(journey);
  } catch (error) {
    console.error("Error creating journey:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @ts-ignore - Temporarily ignore TS error, investigate environment/types
app.get(`${JOURNEY_API_PREFIX}/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid Journey ID format" });
    }
    const journey = await prisma.journey.findUnique({
      where: { id: numericId },
    });
    if (!journey) {
      return res.status(404).json({ message: "Journey not found" });
    }
    res.json(journey);
  } catch (error) {
    console.error("Error fetching journey:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @ts-ignore - Temporarily ignore TS error, investigate environment/types
app.put(`${JOURNEY_API_PREFIX}/:id`, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid Journey ID format" });
    }
    if (!name) {
      return res
        .status(400)
        .json({ message: "Journey name is required for update" });
    }
    const journey = await prisma.journey.update({
      where: { id: numericId },
      data: { name },
    });
    res.json(journey);
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ message: "Journey not found" });
    } else {
      console.error("Error updating journey:", error);
      res
        .status(500)
        .json({ message: "Internal server error or update failed" });
    }
  }
});

// @ts-ignore - Temporarily ignore TS error, investigate environment/types
app.delete(`${JOURNEY_API_PREFIX}/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Invalid Journey ID format" });
    }
    await prisma.journey.delete({
      where: { id: numericId },
    });
    res.json({ message: "Journey deleted" });
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ message: "Journey not found" });
    } else {
      console.error("Error deleting journey:", error);
      res
        .status(500)
        .json({ message: "Internal server error or delete failed" });
    }
  }
});

// @ts-ignore - Temporarily ignore TS error, investigate environment/types
app.get(`${JOURNEY_API_PREFIX}/:journeyId/tree`, async (req, res) => {
  const { journeyId } = req.params;
  console.log(`Fetching tree for journey ID: ${journeyId}`);
  try {
    const numericJourneyId = Number(journeyId);
    if (isNaN(numericJourneyId)) {
      return res.status(400).json({ message: "Invalid Journey ID format" });
    }

    const journeyExists = await prisma.journey.findUnique({
      where: { id: numericJourneyId },
    });
    if (!journeyExists) {
      return res.status(404).json({ message: "Journey not found" });
    }

    // Use prisma.treeNode to fetch nodes for the specific journey
    const nodes = await prisma.treeNode.findMany({
      where: { journeyId: numericJourneyId },
      orderBy: { createdAt: "asc" },
    });

    const tree = buildTree(nodes);
    res.json(tree);
  } catch (error) {
    console.error("Error fetching journey tree:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @ts-ignore - Temporarily ignore TS error, investigate environment/types
app.post(`${JOURNEY_API_PREFIX}/:journeyId/tree/nodes`, async (req, res) => {
  const { journeyId } = req.params;
  const { parentId, name, content } = req.body;

  console.log(`Adding node to journey ID: ${journeyId}`);
  console.log(`Parent ID: ${parentId}`);
  console.log(`Node Name: ${name}`);
  console.log(`Node Content: ${content}`);

  try {
    const numericJourneyId = Number(journeyId);
    if (isNaN(numericJourneyId)) {
      return res.status(400).json({ message: "Invalid Journey ID format" });
    }
    if (!name) {
      return res.status(400).json({ message: "Node name is required" });
    }

    const journeyExists = await prisma.journey.findUnique({
      where: { id: numericJourneyId },
    });
    if (!journeyExists) {
      return res.status(404).json({ message: "Journey not found" });
    }

    if (parentId) {
      // Use prisma.treeNode to check parent
      const parentExists = await prisma.treeNode.findUnique({
        where: { id: parentId },
      });
      if (!parentExists || parentExists.journeyId !== numericJourneyId) {
        return res.status(400).json({ message: "Invalid parent node ID" });
      }
    }

    // Use prisma.treeNode to create
    const newNode = await prisma.treeNode.create({
      data: {
        name: name,
        content: content || null,
        journeyId: numericJourneyId,
        parentId: parentId || null,
      },
    });

    res.status(201).json(newNode);
  } catch (error) {
    console.error("Error adding tree node:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- New DELETE Tree Node Route ---
// @ts-ignore
app.delete(
  `${JOURNEY_API_PREFIX}/:journeyId/tree/nodes/:nodeId`,
  // @ts-ignore
  async (req, res) => {
    const { journeyId, nodeId } = req.params;

    console.log(`DELETE request: Journey ID=${journeyId}, Node ID=${nodeId}`);

    try {
      const numericJourneyId = Number(journeyId);
      console.log(
        `Parsed Journey ID: ${numericJourneyId} (Type: ${typeof numericJourneyId})`
      );

      if (isNaN(numericJourneyId)) {
        console.log("Validation failed: Journey ID is NaN");
        return res.status(400).json({ message: "Invalid Journey ID format" });
      }
      if (!nodeId) {
        console.log("Validation failed: Node ID missing");
        return res.status(400).json({ message: "Node ID is required" });
      }

      console.log(`Attempting to find node with ID: ${nodeId}`);
      const nodeToDelete = await prisma.treeNode.findUnique({
        where: { id: nodeId },
      });

      if (!nodeToDelete) {
        console.log(`Node find result: Not Found (ID: ${nodeId})`);
        return res.status(404).json({ message: "Node not found" });
      }

      console.log(
        `Node find result: Found. Node Journey ID = ${
          nodeToDelete.journeyId
        } (Type: ${typeof nodeToDelete.journeyId})`
      );
      console.log(
        `Comparing Node Journey ID (${nodeToDelete.journeyId}) with Request Journey ID (${numericJourneyId})`
      );

      // Explicitly check types before comparison, just in case
      if (
        typeof nodeToDelete.journeyId !== "number" ||
        typeof numericJourneyId !== "number"
      ) {
        console.error(
          "Type mismatch detected! DB journeyId type:",
          typeof nodeToDelete.journeyId,
          "Parsed journeyId type:",
          typeof numericJourneyId
        );
        // Fallback to potentially less strict comparison if types are unexpectedly different, though this indicates a deeper issue
        // if (String(nodeToDelete.journeyId) !== String(numericJourneyId)) { ... }
        // For now, let the original strict check proceed, but log the type error
      }

      if (nodeToDelete.journeyId !== numericJourneyId) {
        console.log(
          `Journey ID mismatch: Node's journey (${nodeToDelete.journeyId}) !== Requested journey (${numericJourneyId})`
        );
        return res
          .status(404)
          .json({ message: "Node not found in this journey" });
      }

      console.log(`Checks passed. Attempting to delete node ID: ${nodeId}`);
      await prisma.treeNode.delete({
        where: { id: nodeId },
      });
      console.log(`Node ID: ${nodeId} deleted successfully.`);

      res.status(204).send();
    } catch (error: any) {
      console.error("Error during node deletion process:", error);
      if (error?.code === "P2025") {
        console.log(
          "Error handler caught P2025 (Not Found), though explicit check should have caught it."
        );
        res.status(404).json({ message: "Node not found" });
      } else {
        res
          .status(500)
          .json({ message: "Internal server error during node deletion" });
      }
    }
  }
);

export default app;
