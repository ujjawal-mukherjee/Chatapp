import React, { useState, useEffect, useContext } from 'react';
import './Card.css';
import { chatAppContext } from '../../../../Context/ChatAppContext';

const Card = ({ el, i, readMessage, readUser, onSelect }) => {
    const { userList } = useContext(chatAppContext);
    const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/100'); // Fallback image

    // Destructure the Friend struct
    const accountAddress = el[0]; // pubkey
    const name = el[1]; // name

    // Fetch imageHash from userList and get image URL
    useEffect(() => {
        const fetchImage = async () => {
            try {
                // Find user in userList matching the friend's pubkey
                const user = userList.find(
                    (u) => u.accountAddress.toLowerCase() === accountAddress.toLowerCase()
                );
                const jsonHash = user?.imageHash;

                if (jsonHash) {
                    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${jsonHash}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Fetched JSON data:', data);
                        setImageUrl(data.image || 'https://via.placeholder.com/100');
                    } else {
                        console.log('Failed to fetch JSON:', response.status);
                    }
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        if (accountAddress && userList.length > 0) {
            fetchImage();
        }
    }, [accountAddress, userList]);

    return (
        <div className="card" onClick={() => onSelect(el)}>
            <div className="card_image">
                <img src={imageUrl} alt={name} width={50} height={50} />
            </div>
            <div className="card_info">
                <h4>{name}</h4>
                <p>{accountAddress}</p>
            </div>
        </div>
    );
};

export default Card;