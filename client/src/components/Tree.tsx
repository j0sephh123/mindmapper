import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

const mockData: TreeNode[] = [
  {
    id: "1",
    name: "Root Node 1",
    children: [
      { id: "1-1", name: "Child 1.1" },
      {
        id: "1-2",
        name: "Child 1.2",
        children: [{ id: "1-2-1", name: "Grandchild 1.2.1" }],
      },
    ],
  },
  {
    id: "2",
    name: "Root Node 2",
  },
];

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  // In a real application, you would pass a function here to handle adding a node
  // e.g., onAddNode: (parentId: string, newNode: TreeNode) => void;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ node, level }) => {
  const hasChildren = node.children && node.children.length > 0;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddLeaf = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dialog from opening
    // In a real app, you'd get the name (e.g., from a prompt or input)
    // and call the onAddNode prop passed down from the parent.
    const newNodeName = `New Leaf for ${node.name}`;
    const newNodeId = `${node.id}-${Date.now()}`; // Simple unique ID generation
    console.log(
      `Simulating add node: ID=${newNodeId}, Name=${newNodeName}, ParentID=${node.id}`
    );
    // Here you would typically update the state in the parent component
    // For demonstration, we'll just log it. Directly modifying mockData here
    // won't work correctly without lifting state or passing callbacks.
  };

  return (
    <li style={{ paddingLeft: `${level * 20}px` }} className="text-gray-300">
      <div
        className="flex items-center space-x-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
              <Dialog.Description className="text-gray-300 mb-4 flex-grow overflow-auto">
                This is some mock content for the node dialog. You can put
                details about the selected node here.
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
        {isHovered && (
          <button
            onClick={handleAddLeaf}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
            title="Add Leaf"
          >
            +
          </button>
        )}
      </div>
      {hasChildren && (
        <ul className="mt-1 pl-2 border-l border-gray-600">
          {node.children?.map((child) => (
            <TreeNodeComponent key={child.id} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

interface TreeProps {
  data: TreeNode[];
}

export const Tree: React.FC<TreeProps> = ({ data }) => {
  // In a real app, you would manage the tree data state here
  // and pass down update functions (like handleAddNode) to TreeNodeComponent.
  // const [treeData, setTreeData] = useState(data);
  // const handleAddNode = (parentId, newNode) => { ... update treeData ... };

  return (
    <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
      <ul className="space-y-1">
        {data.map((node) => (
          // Pass handleAddNode here: onAddNode={handleAddNode}
          <TreeNodeComponent key={node.id} node={node} level={0} />
        ))}
      </ul>
    </div>
  );
};

export const MockTree: React.FC = () => {
  return <Tree data={mockData} />;
};
