import React, { useContext, useState, useEffect } from "react";
import { chatAppContext } from "../../Context/ChatAppContext";
import "./Pendingrequest.css"; // <-- Import the CSS file here

const PendingRequests = () => {
    const { pendingRequests, acceptFriendRequest, userList, rejectRequest } = useContext(chatAppContext);
    const [userImages, setUserImages] = useState({});

    const getUserDetails = (address) => {
        return userList.find(user => user.accountAddress.toLowerCase() === address.toLowerCase());
    };

    useEffect(() => {
        const fetchImages = async () => {
            for (const address of pendingRequests) {
                const user = getUserDetails(address);

                if (user && user.imageHash && !userImages[address]) {
                    try {
                        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${user.imageHash}`);
                        if (response.ok) {
                            const data = await response.json();
                            const imageUrl = data.image || "https://via.placeholder.com/100";

                            setUserImages(prev => ({
                                ...prev,
                                [address]: imageUrl,
                            }));
                        } else {
                            console.error(`Failed to fetch JSON for ${address}:`, response.status);
                        }
                    } catch (error) {
                        console.error(`Error fetching JSON for ${address}:`, error);
                    }
                }
            }
        };

        if (pendingRequests.length > 0) {
            fetchImages();
        }
    }, [pendingRequests, userList]);

    return (
        <div className="pending-requests-container">
            <h2>Pending Friend Requests</h2>

            {pendingRequests.length === 0 ? (
                <p>No pending requests.</p>
            ) : (
                <div className="pending-requests-grid">
                    {pendingRequests.map((address, index) => {
                        const user = getUserDetails(address);
                        const imageUrl = userImages[address] || "https://via.placeholder.com/100";

                        return (
                            <div key={index} className="usercard">
                                <div className="number">{index + 1}</div>

                                <div className="usercard_box_img">
                                    <img
                                        src={imageUrl}
                                        alt="Profile"
                                        onError={(e) => console.log("Image failed to load:", e.target.src)}
                                    />
                                </div>

                                <div className="usercard_box_info">
                                    {user ? (
                                        <>
                                            <h3>{user.name}</h3>
                                            <p>{user.accountAddress.slice(0, 6)}...{user.accountAddress.slice(-4)}</p>
                                        </>
                                    ) : (
                                        <>
                                            <h3>Unknown User</h3>
                                            <p>{address.slice(0, 6)}...{address.slice(-4)}</p>
                                        </>
                                    )}
                                    <button onClick={() => acceptFriendRequest(address)}>Accept</button>
                                    <button onClick={() => rejectRequest(address)}>Reject</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PendingRequests;
