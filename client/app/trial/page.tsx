// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from '../../Firebase'; // Destructure db and auth
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link"; // Import Link from Next.js

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [workspaces, setWorkspaces] = useState([]);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchWorkspaces(currentUser.uid); // Fetch workspaces when user is logged in
            } else {
                setUser(null);
                setWorkspaces([]);
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const fetchWorkspaces = async (userId: string) => {
        const querySnapshot = await getDocs(collection(db, "workspace"));
        const workspaceList = querySnapshot.docs
            .filter(doc => doc.data().userId === userId) // Filter workspaces by userId
            .map(doc => ({ id: doc.id, ...doc.data() }));
        setWorkspaces(workspaceList);
    };

    if (!user) {
        return <p>No user is logged in</p>;
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>

            <div className="mt-6">
                <h2>Your Workspaces</h2>
                {workspaces.length > 0 ? (
                    <ul>
                        {workspaces.map((workspace) => (
                            <li key={workspace.id} className="mt-2">
                                <Link href={`/workspaces/${workspace.id}`}>
                                    {workspace.name} (Created at: {new Date(workspace.createdAt.seconds * 1000).toLocaleString()})
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No workspaces found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
