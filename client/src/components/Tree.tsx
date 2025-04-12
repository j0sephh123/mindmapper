import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { TreeNodeData } from "../api/journeys"; // Import backend type

// Remove local TreeNode interface if it conflicts
// interface TreeNode {
//   id: string;
//   name: string;
//   children?: TreeNode[];
// }

// Remove mockData
// const mockData: TreeNode[] = [...];

// Define the type for the function to add a node
type AddNodeHandler = (
  parentId: string | null,
  newNodeData: { name: string; content?: string }
) => void;

interface TreeNodeProps {
  node: TreeNodeData; // Use backend type
  level: number;
  onAddNode: AddNodeHandler; // Pass handler down
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  level,
  onAddNode,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddLeaf = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dialog from opening
    // TODO: Replace prompt with a better UI element (e.g., inline input or small modal)
    const newNodeName = prompt("Enter name for the new leaf:", "New Leaf");
    if (newNodeName) {
      // Call the handler passed via props
      onAddNode(node.id, { name: newNodeName });
    }
  };

  return (
    <li style={{ paddingLeft: `${level * 20}px` }} className="text-gray-300">
      <div className="flex items-center space-x-2 group">
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger asChild>
            <span className="font-medium hover:bg-gray-700 rounded px-2 py-1 cursor-pointer inline-block">
              {node.name}
            </span>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-md w-[90vw] h-[90vh] shadow-lg border border-gray-700 flex flex-col">
              <Dialog.Title className="text-xl font-bold text-gray-200 mb-4 flex-shrink-0">
                Node: {node.name}
              </Dialog.Title>
              <Dialog.Description className="text-gray-300 mb-4 flex-grow overflow-auto prose prose-invert prose-sm max-w-none">
                {node.content || "No content for this node."}
              </Dialog.Description>
              <div className="flex justify-end flex-shrink-0">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-gray-200 hover:bg-gray-700 rounded-md">
                    Close
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <button
          onClick={handleAddLeaf}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0"
          title="Add Leaf"
        >
          +
        </button>
      </div>
      {hasChildren && (
        <ul className="mt-1 pl-2 border-l border-gray-600">
          {node.children?.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              level={level + 1}
              onAddNode={onAddNode}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

interface TreeProps {
  data: TreeNodeData[]; // Use backend type
  onAddNode: AddNodeHandler;
}

export const Tree: React.FC<TreeProps> = ({ data, onAddNode }) => {
  // Handler for adding a root node (if needed)
  const handleAddRootNode = () => {
    // Similar logic to handleAddLeaf, but pass null as parentId
    const newNodeName = prompt("Enter name for the new root node:", "New Root");
    if (newNodeName) {
      onAddNode(null, { name: newNodeName });
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
      {/* Conditionally render Add Root Node button only if data is empty */}
      {data.length === 0 && (
        <div className="mb-4">
          <button
            onClick={handleAddRootNode}
            className="text-sm bg-gray-600 hover:bg-gray-500 text-white px-3 py-1.5 rounded"
          >
            Add Root Node
          </button>
        </div>
      )}
      <ul className="space-y-1">
        {data.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            level={0}
            onAddNode={onAddNode}
          />
        ))}
      </ul>
    </div>
  );
};

// Remove MockTree export
// export const MockTree: React.FC = () => {
//   return <Tree data={mockData} />;
// };
