import React, { useState } from "react";

interface FileTreeNodeProps {
  fileName: string;
  nodes?: TreeNode;
}

const FileTreeNode = ({ fileName, nodes }: FileTreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="text-white px-4 bg-black">
      <div className="flex items-center cursor-pointer " onClick={handleToggle}>
        {nodes ? (
          <span className={`mr-2 ${isOpen ? "rotate-90" : ""}`}>
            ▶️
          </span>
        ) : (
          <span className="mr-2">📄</span>
        )}
        {fileName}
      </div>
      {isOpen && nodes && (
        <ul className="ml-4">
          {Object.keys(nodes).map((child) => (
            <li className="p-1" key={child}>
              <FileTreeNode fileName={child} nodes={nodes[child]} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

interface TreeNode {
  [key: string]: TreeNode | undefined;
}

interface FileTreeProps {
  tree: TreeNode;
}

const FileTree = ({ tree }: FileTreeProps) => {
  return <FileTreeNode fileName="/" nodes={tree} />;
};

export default FileTree;
