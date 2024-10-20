"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/Firebase"; // Adjust import as needed
import { doc, getDoc } from "firebase/firestore";
// import Layout from "@/components/Layout"; // Adjust import as needed

const WorkspacePage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the workspace ID from the URL
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (id) {
        const workspaceRef = doc(db, "workspace", id);
        const workspaceDoc = await getDoc(workspaceRef);

        if (workspaceDoc.exists()) {
          setWorkspace({ id: workspaceDoc.id, ...workspaceDoc.data() });
        } else {
          console.log("No such workspace!");
        }
      }
    };

    fetchWorkspace();
  }, [id]);

  if (!workspace) {
    return <p>Loading...</p>; // Loading state while fetching workspace
  }

  return (
    <div workspaceId={workspace.id}>
      {/* You can add other content or children here if needed */}
    </div>
  );
};

export default WorkspacePage;
