"use client"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from '../../Firebase';
import { User } from "firebase/auth";
import { collection, getDocs, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [workspaces, setWorkspaces] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
    const [workspacePasscode, setWorkspacePasscode] = useState<string>(""); // Changed from workspace ID to passcode
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editingMessageContent, setEditingMessageContent] = useState<string>("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchWorkspaces(currentUser.uid);
            } else {
                setUser(null);
                setWorkspaces([]);
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (selectedWorkspace) {
            fetchMessages(selectedWorkspace);
        }
    }, [selectedWorkspace]);

    const fetchWorkspaces = async (userId: string) => {
        const createdWorkspacesSnapshot = await getDocs(collection(db, "workspace"));
        const createdWorkspaces = createdWorkspacesSnapshot.docs
            .filter(doc => doc.data().userId === userId)
            .map(doc => ({ id: doc.id, ...doc.data(), type: 'created' }));

        const joinedWorkspacesSnapshot = await getDocs(collection(db, "joinedWorkspaces"));
        const joinedWorkspaces = joinedWorkspacesSnapshot.docs
            .filter(doc => doc.data().uid === userId)
            .map(doc => doc.data().workspaceId);

        const joinedWorkspacesDetails = await Promise.all(joinedWorkspaces.map(async (workspaceId) => {
            const workspaceDoc = await getDoc(doc(db, "workspace", workspaceId));
            return { id: workspaceDoc.id, ...workspaceDoc.data(), type: 'joined' };
        }));

        const allWorkspaces = [...createdWorkspaces, ...joinedWorkspacesDetails];
        setWorkspaces(allWorkspaces);
    };

    const fetchMessages = (workspaceId: string) => {
        const messagesRef = collection(db, "chats");
        const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
            const messagesList = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(msg => msg.workspaceId === workspaceId);
            setMessages(messagesList);
        });

        return () => unsubscribe();
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedWorkspace) {
            await addDoc(collection(db, "chats"), {
                uid: user?.uid,
                email: user?.email,
                message: newMessage,
                createdAt: new Date(),
                workspaceId: selectedWorkspace,
            });
            setNewMessage("");
        }
    };

    const handleEditMessage = (msgId: string, msgContent: string) => {
        setEditingMessageId(msgId);
        setEditingMessageContent(msgContent);
    };

    const updateMessage = async (msgId: string) => {
        if (editingMessageContent.trim()) {
            const msgRef = doc(db, "chats", msgId);
            await updateDoc(msgRef, {
                message: editingMessageContent,
                updatedAt: new Date(),
            });
            setEditingMessageId(null);
            setEditingMessageContent("");
        }
    };

    const handleDeleteMessage = async (msgId: string) => {
        await deleteDoc(doc(db, "chats", msgId));
    };

    const handleWorkspaceChange = (workspaceId: string) => {
        setSelectedWorkspace(workspaceId);
    };

    const handleJoinWorkspace = async () => {
        if (workspacePasscode.trim()) {
            const workspacesSnapshot = await getDocs(collection(db, "workspace"));
            const workspaceToJoin = workspacesSnapshot.docs.find(doc => doc.data().passcode === workspacePasscode);

            if (workspaceToJoin) {
                const workspaceId = workspaceToJoin.id;
                await setDoc(doc(db, "joinedWorkspaces", `${user?.uid}_${workspaceId}`), {
                    uid: user?.uid,
                    workspaceId: workspaceId,
                });
                fetchWorkspaces(user?.uid || "");
                setWorkspacePasscode(""); // Clear the input after joining
            } else {
                alert("Workspace not found!");
            }
        }
    };

    if (!user) {
        return <p>No user is logged in</p>;
    }

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar */}
            <div className="w-1/4 bg-black text-white p-4">
                <h2 className="text-xl font-bold mb-4">Workspaces</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        value={workspacePasscode}
                        onChange={(e) => setWorkspacePasscode(e.target.value)}
                        placeholder="Enter workspace passcode"
                        className="bg-gray-700 text-white w-full p-2 rounded"
                    />
                    <button
                        onClick={handleJoinWorkspace}
                        className="w-full bg-orange-500 mt-2 p-2 rounded text-white"
                    >
                        Join Workspace
                    </button>
                </div>
                {workspaces.length > 0 ? (
                    <ul>
                        {workspaces.map((workspace) => (
                            <li
                                key={workspace.id}
                                onClick={() => handleWorkspaceChange(workspace.id)}
                                className={`cursor-pointer p-2 rounded ${selectedWorkspace === workspace.id ? "bg-gray-700" : ""
                                    }`}
                            >
                                {workspace.name} <br />
                                <span className="text-sm text-gray-400">
                                    ({workspace.type === "created" ? "Created" : "Joined"})
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No workspaces found.</p>
                )}
            </div>

            {/* Chat Section */}
            <div className="w-3/4 bg-black flex flex-col">
                <div className="bg-gray-800 p-4 border-b border-gray-700">
                    <h2 className="text-xl text-orange-500">
                        {selectedWorkspace
                            ? workspaces.find(ws => ws.id === selectedWorkspace)?.name
                            : "Select a workspace"}
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {selectedWorkspace ? (
                        <>
                            <ul>
                                {messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <li key={msg.id} className="mb-4">
                                            <div className="bg-black p-3 rounded shadow-md">
                                                <div className="flex justify-between">
                                                    <strong className="text-orange-500">{msg.email}</strong>
                                                    <span className="text-sm text-gray-400">
                                                        {new Date(msg.createdAt?.seconds * 1000).toLocaleString()}
                                                    </span>
                                                </div>
                                                {editingMessageId === msg.id ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={editingMessageContent}
                                                            onChange={(e) => setEditingMessageContent(e.target.value)}
                                                            className="w-full border border-gray-700 rounded p-2 mt-2 bg-gray-900 text-white"
                                                        />
                                                        <button
                                                            onClick={() => updateMessage(msg.id)}
                                                            className="bg-orange-500 text-white mt-2 p-2 rounded"
                                                        >
                                                            Update
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p className="mt-2 text-gray-200">{msg.message}</p>
                                                )}
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleEditMessage(msg.id, msg.message)}
                                                        className="text-orange-500"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="text-red-500"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p>No messages found for this workspace.</p>
                                )}
                            </ul>
                        </>
                    ) : (
                        <p className="text-gray-400">Select a workspace to view messages.</p>
                    )}
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-gray-800 border-t border-gray-700">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
                        disabled={!selectedWorkspace}
                    />
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
