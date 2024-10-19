"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from '../../Firebase'; // Destructure db and auth

import { User } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [workspaceName, setWorkspaceName] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // User is logged in
                setUser(currentUser);
            } else {
                // No user is logged in
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    // Function to handle adding workspace to Firestore
    const addWorkspace = async () => {
        if (!workspaceName.trim()) {
            setMessage("Workspace name cannot be empty.");
            return;
        }

        try {
            // Add a new document to the "workspace" collection
            await addDoc(collection(db, "workspace"), {
                name: workspaceName,
                userId: user?.uid, // Storing the user's ID with the workspace
                createdAt: new Date(), // Timestamp for when the workspace is created
            });

            setMessage("Workspace added successfully!");
            setWorkspaceName(""); // Clear the input after submission
        } catch (error) {
            console.error("Error adding workspace:", error);
            setMessage("Error adding workspace.");
        }
    };

    if (!user) {
        return <p>No user is logged in</p>;
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>

            <div className="mt-4">
                <h2>Add a new Workspace</h2>
                <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Workspace Name"
                    className="p-2 border"
                />
                <button onClick={addWorkspace} className="p-2 bg-blue-500 text-white ml-2">
                    Add Workspace
                </button>

                {message && <p className="mt-2">{message}</p>}
            </div>
        </div>
    );
};

export default Dashboard;
