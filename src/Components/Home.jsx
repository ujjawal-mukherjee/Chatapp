import React from 'react';
import Navbar from './Navbar/Navbar';
import images from '../assets';
import './Home.css';
import enc from "../assets/enc.jpg"
import network from "../assets/network.jpg"
import cover from "../assets/cover.png"
const Home = () => {
    return (
        <div className='page-transition'>
            {/**/}
            <div className="home-container">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-text">
                        <h1>Welcome to <span>ChainTalk</span></h1>
                        <p>Experience the power of decentralized and secure messaging.</p>
                        <button className="get-started-btn">Get Started</button>
                    </div>
                    <div className="hero-image">
                        <img src={images.buddy} alt="Chat Banner" />
                    </div>
                </div>

                {/* Features Section */}
                <div className="features">
                    <div className="feature-box">
                        <img src={enc} alt="img1" />
                        <h3>End-to-End Encryption</h3>
                        <p>Your messages are completely private and secure.</p>
                    </div>
                    <div className="feature-box">
                        <img src={network} alt="img1" />
                        <h3>Decentralized Network</h3>
                        <p>No central servers – pure peer-to-peer communication.</p>
                    </div>
                    <div className="feature-box">
                        <img src={cover} alt="img1" />
                        <h3>Seamless Communication</h3>
                        <p>Fast, reliable, and real-time chat experience.</p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="footer">
                    <p>© 2025 Chat Buddy. Built on Decentralization.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
