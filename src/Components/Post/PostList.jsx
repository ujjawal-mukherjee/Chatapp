import React from "react";
import Post from "./Post";

const PostList = ({ posts }) => {
    return (
        <div className="post-list">
            {posts.map((post, index) => (
                <Post key={index} post={post} />
            ))}
        </div>
    );
};

export default PostList;