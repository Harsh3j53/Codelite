"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/Firebase"; // Adjust import as needed
import { doc, getDoc } from "firebase/firestore";
// import Layout from "@/components/Layout"; // Adjust import as needed

interface Workspace {
  id: string;
  [key: string]: any;
}

const WorkspacePage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the workspace ID from the URL
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (id) {
        try {
          const workspaceRef = doc(
            db,
            "workspace",
            Array.isArray(id) ? id[0] : id
          );
          const workspaceDoc = await getDoc(workspaceRef);

          if (workspaceDoc.exists()) {
            setWorkspace({ id: workspaceDoc.id, ...workspaceDoc.data() });
          } else {
            console.log("No such workspace!");
            setError("No such workspace!");
          }
        } catch (err) {
          console.error("Error fetching workspace:", err);
          setError("Error fetching workspace");
        }
      }
    };

    fetchWorkspace();
  }, [id]);

  if (error) {
    return <p>{error}</p>; // Display error message
  }

  if (!workspace) {
    return <p>Loading...</p>; // Loading state while fetching workspace
  }

  return (
    <div data-workspace-id={workspace.id}>
      {/* You can add other content or children here if needed */}
    </div>
  );
};

export default WorkspacePage;
