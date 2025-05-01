import React, { useEffect, useContext } from "react";
import { chatAppContext } from "../../Context/ChatAppContext";
import PostList from "../Components/Post/PostList";
import "./Global.css"; // Import the new CSS

const Allfriendpost = () => {
    const {
        fetchFriendsPosts,
        friendsPosts,
    } = useContext(chatAppContext);

    useEffect(() => {
        fetchFriendsPosts();
    }, []);

    return (
        <div className="allpost-container">
            <h2>Friends' Posts</h2>
            <PostList posts={friendsPosts} />
        </div>
    );
};

export default Allfriendpost;