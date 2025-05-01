// Home.jsx
/*import React, { useEffect, useContext } from "react";
import { chatAppContext } from "../../Context/ChatAppContext";
import PostList from "../Components/Post/PostList";
import "./Global.css";
const Allpost = () => {
    const {
        fetchMyPosts,
        fetchFriendsPosts,
        myPosts,
        friendsPosts,
    } = useContext(chatAppContext);

    useEffect(() => {
        fetchMyPosts();
        fetchFriendsPosts();
    }, []);

    return (
        <div>
            <h2>My Posts</h2>
            <PostList posts={myPosts} />
            <h2>Friends' Posts</h2>
            <PostList posts={friendsPosts} />
        </div>
    );
};

export default Allpost;
*/
import React, { useEffect, useContext } from "react";
import { chatAppContext } from "../../Context/ChatAppContext";
import PostList from "../Components/Post/PostList";
import "./Global.css"; // Import the new CSS

const Allpost = () => {
    const {
        fetchMyPosts,
        myPosts,
    } = useContext(chatAppContext);

    useEffect(() => {
        fetchMyPosts();
    }, []);

    return (
        <div className="allpost-container">
            <h2>My Posts</h2>
            <PostList posts={myPosts} />
        </div>
    );
};

export default Allpost;