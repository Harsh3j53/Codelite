"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Folder,
  Bug,
  Zap,
  FileText,
  ChevronRight,
  UsersRound,
  File,
  MessageSquare,
  Bot,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Terminal from "../components/Terminal";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "@/Firebase"; // Adjust the import based on your Firebase configuration
import { Input } from "@/components/ui/input";
import FileTree from "../components/Tree";

interface Workspace {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  passcode?: string;
  members?: string[];
}

interface ToolbarButtonProps {
  icon: React.ElementType;
  label?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, label }) => (
  <button className="flex items-center space-x-2 border-gray-500 p-2 text-white rounded-[5px]">
    <div className="bg-[#252525] p-2 border border-gray-700 rounded-[5px]">
      <Icon size={18} />
    </div>
    {label && <span className="text-sm font-medium">{label}</span>}
  </button>
);

interface WorkspaceSelectorDropdownProps {
  workspaces: Workspace[];
  currentWorkspace: string;
  setCurrentWorkspace: (workspace: string) => void;
  addWorkspace: (name: string) => Promise<void>;
  joinWorkspace: (workspaceName: string, passcode: string) => Promise<void>;
}

const WorkspaceSelectorDropdown: React.FC<WorkspaceSelectorDropdownProps> = ({
  workspaces,
  currentWorkspace,
  setCurrentWorkspace,
  addWorkspace,
  joinWorkspace,
}) => {
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [passcode, setPasscode] = useState("");

  const handleAddWorkspace = () => {
    addWorkspace(newWorkspaceName);
    setNewWorkspaceName("");
  };

  const handleJoinWorkspace = () => {
    joinWorkspace(currentWorkspace, passcode);
    setPasscode("");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center px-2 space-x-2 bg-[#252525] border border-gray-500 text-white rounded-[5px]">
          <Folder size={18} />
          <span className="text-sm font-medium">{currentWorkspace}</span>
          <ChevronDown size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#252525] text-white border border-gray-500">
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => setCurrentWorkspace(workspace.name)}
          >
            {workspace.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ToolbarProps {
  workspaces: Workspace[];
  addWorkspace: (name: string) => Promise<void>;
  joinWorkspace: (workspaceName: string, passcode: string) => Promise<void>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  workspaces,
  addWorkspace,
  joinWorkspace,
}) => {
  const [currentWorkspace, setCurrentWorkspace] = useState("Select Workspace");
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [passcode, setPasscode] = useState("");

  const handleAddWorkspace = () => {
    addWorkspace(newWorkspaceName);
    setNewWorkspaceName("");
  };

  const handleJoinWorkspace = () => {
    joinWorkspace(currentWorkspace, passcode);
    setPasscode("");
  };

  return (
    <div className="flex space-x-2 flex-row bg-black p-4">
      <div className="flex space-x-2 items-center w-full">
        <WorkspaceSelectorDropdown
          workspaces={workspaces}
          currentWorkspace={currentWorkspace}
          setCurrentWorkspace={setCurrentWorkspace}
          addWorkspace={addWorkspace}
          joinWorkspace={joinWorkspace}
        />
        <Input
          type="text"
          placeholder="New Workspace Name"
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
          className="text-white border-gray-500"
        />
        <Button onClick={handleAddWorkspace} className="">
          Create
        </Button>
        <Input
          type="text"
          placeholder="Join Workspace Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="text-white border-gray-500   "
        />
        <Button onClick={handleJoinWorkspace} className="">
          Join
        </Button>

      </div>
      <div className="flex items-center gap-1 justify-end w-full">
        <ToolbarButton icon={Zap} label="Optimize" />
        <ToolbarButton icon={UsersRound} />
        <Button className="bg-orange-600 rounded-[5px]">Invite</Button>
      </div>
    </div>
  );
};

interface FileTreeItemProps {
  name: string;
  isFolder: boolean;
  level?: number;
  children?: FileTreeItemProps[];
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  name,
  isFolder,
  level = 0,
  children = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isFolder ? Folder : File;

  return (
    <div>
      <div
        className={`flex items-center space-x-2 p-1 hover:bg-[#3a3a3a] cursor-pointer`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder &&
          (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        {!isFolder && <div className="w-4" />}
        <Icon size={16} />
        <span className="text-sm">{name}</span>
      </div>
      {isOpen && isFolder && (
        <div>
          {children.map((child) => (
            <FileTreeItem
              key={child.name}
              name={child.name}
              isFolder={child.isFolder}
              level={level + 1}
              children={child.children}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileTreeProps {
  tree: FileTreeItemProps[];
}

// const FileTree: React.FC<FileTreeProps> = ({ tree }) => {
//   return (
//     <div className="bg-black p-2 text-white w-64 h-full overflow-y-auto">
//       <div className="p-2 text-xl font-medium">Explorer</div>
//       {tree.map((item) => (
//         <FileTreeItem
//           key={item.name}
//           name={item.name}
//           isFolder={item.isFolder}
//           children={item.children}
//         />
//       ))}
//     </div>
//   );
// };

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`function helloWorld() {
    console.log("Hello, World!");
}

helloWorld();`);

  return (
    <div className="bg-[#1e1e1e] text-white font-mono">
      <div className="flex bg-[#252525] text-sm">
        <div className="p-2 border-r border-gray-700">index.js</div>
        <div className="p-2 border-r border-gray-700">JavaScript</div>
      </div>
      <div className="p-4 flex">
        <div className="mr-4 text-gray-500 select-none">
          {code.split("\n").map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-transparent outline-none resize-none"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

const Page: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [fileTree, setFileTree] = useState<FileTreeItemProps[]>([]);

  const getFileTree = async () => {
    const response = await fetch("http://localhost:4000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const querySnapshot = await getDocs(collection(db, "workspace"));
      const workspaceList: Workspace[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workspace[];
      setWorkspaces(workspaceList);
    };

    fetchWorkspaces();
  }, []);

  const addWorkspace = async (name: string) => {
    if (!name.trim()) return;

    try {
      await addDoc(collection(db, "workspace"), {
        name,
        userId: auth.currentUser?.uid,
        createdAt: new Date(),
        passcode: generatePasscode(),
        members: [auth.currentUser?.uid],
      });
      const querySnapshot = await getDocs(collection(db, "workspace"));
      const updatedWorkspaceList: Workspace[] = querySnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      ) as Workspace[];
      setWorkspaces(updatedWorkspaceList);
    } catch (error) {
      console.error("Error adding workspace:", error);
    }
  };

  const joinWorkspace = async (workspaceName: string, passcode: string) => {
    try {
      const querySnapshot = await getDocs(collection(db, "workspace"));
      const workspace = querySnapshot.docs.find(
        (doc) => doc.data().name === workspaceName
      );
      if (workspace && workspace.data().passcode === passcode) {
        const workspaceRef = doc(db, "workspace", workspace.id);
        await updateDoc(workspaceRef, {
          members: arrayUnion(auth.currentUser?.uid),
        });
        console.log(`Joined workspace: ${workspaceName}`);
      } else {
        console.error("Invalid workspace name or passcode");
      }
    } catch (error) {
      console.error("Error joining workspace:", error);
    }
  };

  return (
    <div className="bg-[#1e1e1e] w-full h-screen flex flex-col">
      <Toolbar
        workspaces={workspaces}
        addWorkspace={addWorkspace}
        joinWorkspace={joinWorkspace}
      />
      <div className="flex border-t-[1px] border-t-gray-500 flex-1 overflow-hidden">
        <FileTree tree={fileTree} />
        <div className="flex-1 flex flex-col border border-gray-600">
          <div className="flex-1 border-gray-600">
            <CodeEditor />
          </div>
          <div className="h-64 mt-4 bg-black rounded-lg overflow-hidden border-t border-gray-600">
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

const generatePasscode = (): string => {
  return Math.random().toString(36).slice(-6);
};
