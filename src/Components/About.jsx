import React from 'react';
import Navbar from './Navbar/Navbar';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            {/**/}
            <div className="about-content">
                <h1 className='heading'>About ChatApp</h1>
                <p className='paragraph'>
                    ChatApp is a fast, secure, and user-friendly messaging platform designed to keep you connected with your friends and family.
                    Whether you're sending text messages, making video calls, or sharing media, ChatApp ensures a smooth and private communication experience.
                </p>

                <h2 className='heading'>Why Choose ChatApp?</h2>
                <div className='features-container'>
                    <div className='feature-card'>
                        <h3>🔐 End-to-End Encryption</h3>
                        <p>Your messages and calls are completely private.</p>
                    </div>
                    <div className='feature-card'>
                        <h3>📹 Seamless Video Calls</h3>
                        <p>High-quality video and audio for uninterrupted conversations.</p>
                    </div>
                    <div className='feature-card'>
                        <h3>💬 Instant Messaging</h3>
                        <p>Send texts, images, and documents in real-time.</p>
                    </div>
                    <div className='feature-card'>
                        <h3>💻 Cross-Platform Support</h3>
                        <p>Available on mobile, web, and desktop.</p>
                    </div>
                </div>

                <h2 className='heading'>Stay Connected, Anytime, Anywhere</h2>
                <p className='paragraph'>
                    ChatApp is built for the modern world, helping people communicate without boundaries.
                    Whether you're chatting with a close friend or collaborating with a team, our platform makes communication effortless and enjoyable.
                </p>
            </div>
        </div>
    );
};

export default About;
