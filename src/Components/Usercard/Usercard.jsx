import React, { useContext, useState, useEffect } from 'react';
import './Usercard.css';
import { chatAppContext } from '../../../Context/ChatAppContext';

const Usercard = ({ el }) => {
    const { sendFriendRequest } = useContext(chatAppContext);
    const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/100"); // Fallback image

    console.log("Full el object:", el); // Debug the entire el object
    const name = el[0]; // Name
    const accountAddress = el[1]; // Account Address
    const jsonHash = el[2]; // JSON Hash

    useEffect(() => {
        const fetchJsonData = async () => {
            try {
                const response = await fetch(`https://gateway.pinata.cloud/ipfs/${jsonHash}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched JSON data:", data);
                    setImageUrl(data.image || "https://via.placeholder.com/100"); // Use the nested image URL
                } else {
                    console.log("Failed to fetch JSON:", response.status);
                }
            } catch (error) {
                console.log("Error fetching JSON:", error);
            }
        };

        fetchJsonData();
    }, [jsonHash]);

    return (
        <div className='usercard'>
            <div className='usercard_box'>
                <img
                    src={imageUrl}
                    alt="user"
                    width={100}
                    height={100}
                    onError={(e) => console.log("Image failed to load:", e.target.src)} // Debug image load failure
                />
            </div>
            <div className='usercard_box_info'>
                <h3>{name}</h3>
                <p>{accountAddress.slice(0, 25)}...</p>
                <button onClick={() => sendFriendRequest(accountAddress)}>
                    Send Request
                </button>
            </div>
        </div>
    );
};

export default Usercard;