import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { chatAppContext } from '../../../Context/ChatAppContext';
import Model from '../Model/Model';
import images from '../../assets';
import ErrorMessage from '../ErrorMessage';
const Navbar = () => {
    const menuItems = [
        { menu: "Home", path: "/" },
        { menu: "Add-Friends", path: "/allusers" },
        { menu: "Requests", path: "/pendingrequest" },
        { menu: "Messenger", path: "/chats" },
        { menu: "Create Post", path: "/createpost" },
        { menu: "Posts", path: "/totalpost" }
    ];

    const [openModel, setOpenModel] = useState(false);
    const { account, userName, userImage, connectWallet, createAccount, error, currentUserName, } = useContext(chatAppContext);

    return (
        <div className="Navbar">
            <div className="Navbar_box">
                {/* Left Side - Logo */}
                <div className="Navbar_box_left">
                    <img src={images.avatar1} alt="logo" width={50} height={50} />
                </div>

                {/* Right Side - Menu and Connect Button */}
                <div className="Navbar_box_right">
                    <div className="Navbar_box_right_menu">
                        {menuItems.map((el, i) => (
                            <NavLink
                                key={i}
                                to={el.path}
                                className={({ isActive }) =>
                                    isActive ? "Navbar_box_right_menu_link active_btn" : "Navbar_box_right_menu_link"
                                }
                            >
                                {el.menu}
                            </NavLink>
                        ))}
                    </div>

                    {/* Connect Wallet / Account Info */}
                    <div className="Navbar_box_right_connect">
                        {/*{account === "" ? (
                            <button onClick={connectWallet}>
                                <span>Connect Wallet</span>
                            </button>
                        ) : (
                            <button onClick={() => setOpenModel(true)}>
                                <img
                                    src={userImage || images.create2}
                                    alt="account"
                                    width={20}
                                    height={20}
                                    style={{ borderRadius: '50%' }}
                                />
                                <small>{userName || "Create Account"}</small>
                            </button>
                        )}*/}
                        {!account ? (
                            <button onClick={connectWallet}>
                                <span>Connect Wallet</span>
                            </button>
                        ) : !currentUserName ? (
                            <button onClick={() => setOpenModel(true)}>
                                <img
                                    src={images.create2}  // Placeholder image while creating account
                                    alt="create"
                                    width={20}
                                    height={20}
                                    style={{ borderRadius: '50%' }}
                                />
                                <small>Create Account</small>
                            </button>
                        ) : (
                            <button>
                                <img
                                    src={images.accountName}  // You can update this to any new small icon
                                    alt="user"
                                    width={20}
                                    height={20}
                                    style={{ borderRadius: '50%' }}
                                />
                                <small>{currentUserName}</small>
                            </button>
                        )}

                    </div>
                </div>
            </div>

            {/* Modal for Create Account */}
            {openModel && (
                <div className="modelbox">
                    <Model
                        openBox={setOpenModel}
                        title="WELCOME TO"
                        head="CHAT BUDDY"
                        info="This is a chat app where you can communicate in a decentralized and secure way."
                        smallInfo="Kindly select your name..."
                        images={images}
                        functionName={createAccount}
                        address={account}
                    />
                </div>
            )}

            {/* Error Message */}
            {error && <ErrorMessage error={error} />}
        </div>
    );
};

export default Navbar;
