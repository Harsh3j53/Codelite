import React, { useEffect, useState } from "react";
import { File, Folder, Tree } from "@/components/ui/file-tree";
import socket from "@/socket";

interface FileTreeNodeProps {
  fileName: string;
  nodes?: Record<string, any>;
  onSelect: (path: string) => void;
  path: string;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({
  fileName,
  nodes,
  onSelect,
  path,
}) => {
  const isDir = !!nodes;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) return;
        onSelect(path);
      }}
      style={{ marginLeft: "10px" }}
    >
      {isDir ? (
        <Folder element={fileName} value={path}>
          {Object.entries(nodes).map(([childName, childNodes]) => (
            <FileTreeNode
              key={childName}
              onSelect={onSelect}
              path={`${path}/${childName}`.replace(/^\/+/, "")}
              fileName={childName}
              nodes={childNodes}
            />
          ))}
        </Folder>
      ) : (
        <File value={path}>
          <p className="file-node">{fileName}</p>
        </File>
      )}
    </div>
  );
};

interface FileTreeProps {
  tree: Record<string, any>;
  onSelect: (path: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ tree, onSelect }) => {
  return (
    <>
      {Object.entries(tree).map(([fileName, nodes]) => (
        <FileTreeNode
          key={fileName}
          onSelect={onSelect}
          path={fileName}
          fileName={fileName}
          nodes={nodes}
        />
      ))}
    </>
  );
};

interface FileTreeDemoProps {
  onFileSelect: (path: string) => void;
}

export function FileTreeDemo({ onFileSelect }: FileTreeDemoProps) {
  const [fileTree, setFileTree] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        const response = await fetch("http://localhost:4000/files");
        const data = await response.json();
        setFileTree(data.tree);
      } catch (error) {
        console.error("Error fetching file tree:", error);
      }
    };

    fetchFileTree();

    socket.on("file:update", (data) => {
      console.log("Received file update:", data);
      setFileTree(data.tree);
    });

    return () => {
      socket.off("file:update");
    };
  }, []);

  return (
    <div className="flex h-screen w-[300px] flex-col items-center justify-center overflow-hidden rounded-lg dark">
      <Tree
        className="p-2 overflow-hidden rounded-md bg-background"
        initialSelectedId="7"
        initialExpandedItems={[
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
        ]}
      >
        <FileTree tree={fileTree} onSelect={onFileSelect} />
      </Tree>
    </div>
  );
}

export default FileTreeDemo;
