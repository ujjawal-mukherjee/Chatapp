import React, { useState, useEffect, useContext } from 'react';
import images from '../../assets';
import { converTime } from '../../../Utils/apiFeatures';
import Loader from '../Loader/Loader';
import './Chat.css';
import { chatAppContext } from '../../../Context/ChatAppContext';

const Chat = ({
    functionName,
    friendMsg,
    account,
    username,
    loading,
    currentUserName,
    currentUserAddress,
    selectedFriend,
    readMessage,
}) => {
    const { userList } = useContext(chatAppContext);
    const [message, setMessage] = useState('');
    const [userImageUrl, setUserImageUrl] = useState('https://via.placeholder.com/100'); // Current user's image
    const [friendImageUrl, setFriendImageUrl] = useState('https://via.placeholder.com/100'); // Friend's image

    // Fetch user and friend images
    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch current user's image
                if (currentUserAddress) {
                    const user = userList.find(
                        (u) => u.accountAddress.toLowerCase() === currentUserAddress.toLowerCase()
                    );
                    if (user?.imageHash) {
                        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${user.imageHash}`);
                        if (response.ok) {
                            const data = await response.json();
                            setUserImageUrl(data.image || 'https://via.placeholder.com/100');
                        }
                    }
                }

                // Fetch friend's image
                if (selectedFriend && selectedFriend[0]) {
                    const friend = userList.find(
                        (u) => u.accountAddress.toLowerCase() === selectedFriend[0].toLowerCase()
                    );
                    if (friend?.imageHash) {
                        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${friend.imageHash}`);
                        if (response.ok) {
                            const data = await response.json();
                            setFriendImageUrl(data.image || 'https://via.placeholder.com/100');
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        if (userList.length > 0 && (currentUserAddress || selectedFriend)) {
            fetchImages();
        }
    }, [userList, currentUserAddress, selectedFriend]);

    // Fetch messages when selectedFriend changes
    useEffect(() => {
        if (selectedFriend && selectedFriend[0]) {
            readMessage(selectedFriend[0]); // Fetch messages for the friend's address
        }
    }, [selectedFriend, readMessage]);

    const handleSend = () => {
        try {
            if (!selectedFriend || !selectedFriend[0]) {
                console.error('No valid friend address found!');
                return;
            }

            const friendAddress = selectedFriend[0];
            functionName({ msg: message, address: friendAddress });

            console.log('Message Sent:', message);
            console.log('Recipient Address:', friendAddress);

            setMessage(''); // Clear input field
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat">
            {currentUserName && currentUserAddress && selectedFriend && (
                <div className="chat_user_info">
                    <img
                        src={friendImageUrl}
                        alt={selectedFriend[1]}
                        width={70}
                        height={70}
                    />
                    <div className="chat_user_details">
                        <h4>{selectedFriend[1]}</h4>
                        <p>{selectedFriend[0]}</p>
                    </div>
                </div>
            )}

            <div className="chat_box_box">
                <div className="chat_box">
                    <div className="chat_box_left">
                        {friendMsg.map((el, i) => (
                            <div key={i}>
                                {el.sender.toLowerCase() === selectedFriend[0].toLowerCase() ? (
                                    <div className="chat_box_left_title">
                                        <img
                                            src={friendImageUrl}
                                            alt={selectedFriend[1]}
                                            width={50}
                                            height={50}
                                        />
                                        <span>
                                            {selectedFriend[1]}
                                            <small>{converTime(el.timestamp)}</small>
                                        </span>
                                        <p>{el.msg}</p>
                                    </div>
                                ) : (
                                    <div className="chat_box_right_title">
                                        <img
                                            src={userImageUrl}
                                            alt={username}
                                            width={50}
                                            height={50}
                                        />
                                        <span>
                                            {username}
                                            <small>{converTime(el.timestamp)}</small>
                                        </span>
                                        <p>{el.msg}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {currentUserName && currentUserAddress && (
                    <div className="chat_box_send">
                        <div className="chat_box_image">
                            <img
                                src={images.smile}
                                alt="smile"
                                width={50}
                                height={50}
                            />
                            <input
                                type="text"
                                placeholder="type your msg..."
                                onChange={(e) => setMessage(e.target.value)}
                                value={message}
                            />
                            <img
                                src={images.file}
                                alt="file"
                                width={50}
                                height={50}
                            />
                            {loading ? (
                                <Loader />
                            ) : (
                                <img
                                    src={images.send}
                                    alt="send"
                                    width={50}
                                    height={50}
                                    onClick={handleSend}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;