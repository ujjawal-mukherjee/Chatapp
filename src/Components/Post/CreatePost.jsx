
import React, { useState, useContext } from "react";
import { chatAppContext } from "../../../Context/ChatAppContext";
import "./Createpost.css"; // Import the CSS file
import images from '../../assets/index'
const CreatePost = () => {
    const { createPost } = useContext(chatAppContext);
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadToPinata = async (file) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const formData = new FormData();
        formData.append("file", file);

        const metadata = JSON.stringify({ name: file.name });
        formData.append("pinataMetadata", metadata);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2OWZjZjE4Yi04YzIxLTQxNTMtODQ3NS0xMTI2ODUxZjY4NjciLCJlbWFpbCI6InVqamF3YWxrdW1hcm11a2hlcmplZTMzNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDU3NjRkZTBjODNkZTk1YjViZjEiLCJzY29wZWRLZXlTZWNyZXQiOiJlMWViN2U5NzkyYzUxNmE3YTJmM2NmZGEwNmEwNTFhNjE0ZDBhZTUzMTc4NmIxODIxNTZlY2VjOWMwYTg2ODlmIiwiZXhwIjoxNzc3NDgwMzgwfQ.xpR1idEkytT5FPs_g_B7ShT9IlNYRhpFBvmh-TrdRLs`, // Replace with your Pinata JWT
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");

            return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        } catch (err) {
            console.error("Pinata upload error:", err.message);
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim() === "") {
            setError("Post content cannot be empty.");
            return;
        }

        setUploading(true);
        setError("");

        try {
            let imageUrl = "";
            if (file) {
                imageUrl = await uploadToPinata(file);
            }

            await createPost(content, imageUrl);
            setContent("");
            setFile(null);
        } catch (err) {
            setError("Failed to upload or post: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="Model">
        <div className="Model_box">
            <div className="Model_box_left">
                <img src={images.friends2} alt="Create Post" />
            </div>

            <div className="Model_box_right">
                <h1>Create <span>Post</span></h1>
                <p>Share your thoughts and images on the blockchain!</p>
                <form onSubmit={handleSubmit}>
                    <div className="Model_box_right_name_info">
                        <textarea
                            className="Model_box_right_textarea"
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="Model_box_right_name_info">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="Model_box_right_name_btn">
                        <button type="submit" disabled={uploading}>
                            {uploading ? "Posting..." : "Post"}
                        </button>
                    </div>
                    {error && <p className="Model_error">{error}</p>}
                </form>
            </div>
        </div>
        </div>
    );
};

export default CreatePost;