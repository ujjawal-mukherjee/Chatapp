import React from 'react';
import Filter from './Filter/Filter';
import Friend from './Friend/Friend';
import './Chats.css';
import Navbar from './Navbar/Navbar';
const Chats = () => {
    return (
        <div className='page-transition'>
            {/**/}
            <div className="chat-content">
                <Filter />
                <Friend />
            </div>
        </div>
    );
};

export default Chats;
