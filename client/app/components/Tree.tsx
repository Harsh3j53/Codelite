import React from "react";

interface FileTreeNodeProps {
  fileName: string;
  nodes?: TreeNode;
}

const FileTreeNode = ({ fileName, nodes }: FileTreeNodeProps) => {
  return (
    <div className="text-white bg-black">
      {fileName}
      {nodes && (
        <ul>
          {Object.keys(nodes).map((child) => (
            <li className="p-2 ml-4 mr-4" key={child}>
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
  console.log(tree);
  return <FileTreeNode fileName="/" nodes={tree} />;
};

export default FileTree;
