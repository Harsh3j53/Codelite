import React, { useState } from "react";

interface FileTreeNodeProps {
  fileName: string;
  nodes?: TreeNode;
  onSelect: (path: string) => void;
  path: string;
}

const FileTreeNode = ({
  fileName,
  nodes,
  onSelect,
  path,
}: FileTreeNodeProps) => {
  const isDir = !!nodes;
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) return;
        onSelect(path);
      }}
      className="text-white px-4 bg-black"
    >
      <div className="flex items-center cursor-pointer" onClick={handleToggle}>
        {nodes ? (
          <span className={`mr-2 ${isOpen ? "rotate-90" : ""}`}>▶️</span>
        ) : (
          <span className="mr-2">📄</span>
        )}
        {fileName}
      </div>
      {isOpen && nodes && (
        <ul className="ml-4">
          {Object.keys(nodes).map((child) => (
            <li className="p-1" key={child}>
              <FileTreeNode
                onSelect={onSelect}
                path={path + "/" + child}
                fileName={child}
                nodes={nodes[child]}
              />
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
  onSelect: (path: string) => void;
}

const FileTree = ({ tree, onSelect }: FileTreeProps) => {
  return <FileTreeNode onSelect={onSelect} fileName="/" nodes={tree} path="" />;
};

export default FileTree;
