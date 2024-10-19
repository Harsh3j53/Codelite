"use client";
import * as React from "react";
import {
  AudioWaveform,
  Command,
  Inbox,
  Calendar,
  Search,
  Trash2,
  Plus,
  UserPlus,
} from "lucide-react";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavWorkspaces } from "@/components/nav-workspaces";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { db, auth } from "@/Firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";

const data = {
  teams: [
    { name: "Syncr Inc", logo: Command, plan: "Enterprise" },
    { name: "Syncr Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ],
  navMain: [
    { title: "Search", url: "#", icon: Search },
    { title: "Inbox", url: "#", icon: Inbox, badge: "10" },
  ],
  navSecondary: [
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Trash", url: "#", icon: Trash2 },
  ],
};

export default function AppSidebar({ ...props }) {
  interface Workspace {
    id?: string;
    name: string;
    passcode: string;
    members: string[]; // Array to store member IDs
  }

  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [joinWorkspaceName, setJoinWorkspaceName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Fetch workspaces from Firestore when user is authenticated
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (user) {
        try {
          const querySnapshot = await getDocs(collection(db, "workspace"));
          const workspaceList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWorkspaces(workspaceList);
        } catch (error) {
          console.error("Error fetching workspaces: ", error);
        }
      }
    };

    fetchWorkspaces();
  }, [user]); // Fetch workspaces whenever the user changes

  // Function to generate a random passcode
  const generatePasscode = () => {
    const length = 6; // Set desired passcode length
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let passcode = "";
    for (let i = 0; i < length; i++) {
      passcode += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return passcode;
  };

  // Function to handle adding workspace to Firestore
  const addWorkspace = async () => {
    if (!workspaceName.trim()) {
      setMessage("Workspace name cannot be empty.");
      return;
    }

    const passcode = generatePasscode(); // Generate a passcode

    try {
      // Add a new document to the "workspace" collection
      await addDoc(collection(db, "workspace"), {
        name: workspaceName,
        userId: user?.uid, // Storing the user's ID with the workspace
        createdAt: new Date(), // Timestamp for when the workspace is created
        passcode, // Include the generated passcode
        members: [user?.uid], // Initialize members with the creator's ID
      });

      setWorkspaces((prev) => [...prev, { name: workspaceName, passcode, members: [user?.uid] }]);
      setWorkspaceName(""); // Clear the input after submission
      setMessage(""); // Clear message
    } catch (error) {
      console.error("Error adding workspace:", error);
      setMessage("Error adding workspace.");
    }
  };

  const joinWorkspace = async () => {
    if (!joinWorkspaceName.trim()) {
      setMessage("Please enter a workspace name to join.");
      return;
    }

    // Handle joining logic here (e.g., fetch workspace details and add the user to the workspace)
    // You would also need to check if the workspace exists and the passcode is correct

    setJoinWorkspaceName(""); // Clear the input after submission
    setMessage(""); // Clear message
  };

  if (!user) {
    return <p>No user is logged in</p>;
  }

  return (
    <Sidebar className="border-r-0 p-4" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <h1>Welcome, {user.email}</h1>

        {/* Create and Join Buttons */}
        <div className="flex mt-4 mb-4 gap-2 ">
          <button
            onClick={() => {
              setIsCreating(!isCreating);
              setIsJoining(false); // Close join input if creating a workspace
            }}
            className="flex w-full text-[12px] items-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            <Plus className="mr-2" size={16} />
            Create
          </button>
          <button
            onClick={() => {
              setIsJoining(!isJoining);
              setIsCreating(false); // Close create input if joining a workspace
            }}
            className="flex items-center w-full text-[12px] justify-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            <UserPlus className="mr-2" size={16} />
            Join
          </button>
        </div>

        {/* Workspace Creation Input */}
        {isCreating && (
          <div className="mb-4">
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Workspace Name"
              className="p-2 border mb-2 w-full text-black"
            />
            <button onClick={addWorkspace} className="p-2 bg-blue-500 w-full text-white ">
              Add Workspace
            </button>
          </div>
        )}

        {/* Workspace Joining Input */}
        {isJoining && (
          <div className="mb-4">
            <input
              type="text"
              value={joinWorkspaceName}
              onChange={(e) => setJoinWorkspaceName(e.target.value)}
              placeholder="Enter Workspace Name to Join"
              className="w-full mb-2 p-2 border text-black"
            />
            <button
              onClick={joinWorkspace}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Join Workspace
            </button>
          </div>
        )}

        {message && <p className="text-red-500">{message}</p>}
        <NavWorkspaces workspaces={workspaces} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
