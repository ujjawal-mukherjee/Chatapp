import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './TotalPost.css';

const Totalpost = () => {
    return (
        <div className="allposts-container">
            <h2 className="post-heading">Explore Posts</h2>
            <div className="post-button-group">
                <Link to="allpost">
                    <button className="post-card-button">Your Posts</button>
                </Link>
                <Link to="friendpost">
                    <button className="post-card-button">Friend's Posts</button>
                </Link>
            </div>

            <Outlet />

        </div>
    );
};

export default Totalpost;
