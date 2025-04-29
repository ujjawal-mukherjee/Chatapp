import React, { useContext, useState } from 'react';
import "./Friend.css";
import Card from './Card/Card';
import Chat from '../Chat/Chat';
import { chatAppContext } from '../../../Context/ChatAppContext';

const Friend = () => {
    const {
        sendMessage,
        friendMsg,
        account,
        friendLists,
        readMessage,
        username,
        loading,
        currentUserName,
        currentUserAddress,
        readUser,
    } = useContext(chatAppContext);

    // Local state to track which friend is currently selected
    const [selectedFriend, setSelectedFriend] = useState(null);

    // Handler for when a friend card is clicked
    const handleFriendSelect = (friend) => {
        setSelectedFriend(friend);
    };

    return (
        <div className="friend">
            <div className="friend_box">

                <div className="friend_box_left">
                    {friendLists.map((el, i) => (
                        <Card
                            key={i}
                            el={el}
                            i={i}
                            readMessage={readMessage}
                            readUser={readUser}
                            onSelect={() => handleFriendSelect(el)} // pass friend to parent
                        />
                    ))}
                </div>


                <div className="friend_box_right">
                    {selectedFriend ? (
                        <Chat
                            functionName={sendMessage}
                            friendMsg={friendMsg}
                            account={account}
                            username={username}
                            loading={loading}
                            currentUserName={currentUserName}
                            currentUserAddress={currentUserAddress}
                            selectedFriend={selectedFriend}
                            readMessage={readMessage}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', color: '#fff' }}>
                            <h2></h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Friend;

