import React, { useContext } from "react";
import Usercard from "./Usercard/Usercard";
import './Allusers.css';
import { chatAppContext } from "../../Context/ChatAppContext";
import Navbar from "./Navbar/Navbar";

const Allusers = () => {
    const {
        userList,
        currentUserName,
        currentUserAddress,
        sendFriendRequest,
        error,
        account
    } = useContext(chatAppContext);

    return (
        <div className="page-transition">
            {/* Top navbar */}


            {/* Page heading */}
            <div className="alluser_info">
                <h1>Discover New Connections</h1>
            </div>

            {/* Display current user account details */}
            <div className="current_user">
                {currentUserName && currentUserAddress ? (
                    <>
                        <h2>Your Account Details</h2>
                        <p><strong>Name:</strong> {currentUserName}</p>
                        <p><strong>Address:</strong> {currentUserAddress}</p>
                    </>
                ) : (
                    <p>Your account is not created yet. Please create your account.</p>
                )}
            </div>

            {/* List of all users */}
            <div className="alluser">
                {userList && userList.length > 0 ? (
                    userList
                        .filter((user) => user.accountAddress.toLowerCase() !== account.toLowerCase()) // exclude self
                        .map((el, i) => (
                            <Usercard
                                key={i}
                                el={el}
                                sendFriendRequest={sendFriendRequest}
                            />
                        ))
                ) : (
                    <p className="para">No users found.</p>
                )}
            </div>

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Allusers;
