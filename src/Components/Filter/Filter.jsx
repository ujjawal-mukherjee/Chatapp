import React, { useState, useContext } from 'react';
import './Filter.css';
import { chatAppContext } from '../../../Context/ChatAppContext';
import Model from '../Model/Model';
import images from "../../assets";

const Filter = () => {
    const { account, addFriends } = useContext(chatAppContext);
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);

    return (
        <div className='filter'>
            <div className='filter_box'>
                <div className='filter_box_left_search'>
                    <img src={images.search} alt="search icon" width={20} height={20} />
                    <input type="text" placeholder='search.....' />
                </div>
                {/* <div className='filter_box_right'>
                    <button onClick={() => setShowAddFriendModal(true)}>
                        <img src={images.user} alt="user icon" width={20} height={20} />
                        ADD FRIEND
                    </button>
                    <button className="clear_chat_button">
                        Clear Chat
                    </button>
                </div>*/}
            </div>
            {/* Modal Component */}
            {showAddFriendModal && (
                <div className='filter_model'>
                    <Model
                        openBox={setShowAddFriendModal}
                        title="WELCOME TO"
                        head="CHAT BUDDY"
                        info="HEY WELCOME TO CHATAPP CHAT WITH YOUR FAMILY AND FRIENDS"
                        smallInfo="Kindly provide your and your friend's name"
                        images={images}
                        functionName={addFriends}
                        address={account} // Pass the account address here
                    />
                </div>
            )}
        </div>
    );
};

export default Filter;
