
import React, { useState, useContext } from "react";
import { chatAppContext } from "../../../Context/ChatAppContext";
import './Model.css';

const Model = () => {
    const { createAccount } = useContext(chatAppContext);
    const [form, setForm] = useState({ name: "", physicalAddress: "" });
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadToPinata = async (file) => {
        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        const formData = new FormData();
        formData.append("file", file);

        const metadata = JSON.stringify({
            name: file.name,
        });

        formData.append("pinataMetadata", metadata);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer `
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "File upload to Pinata failed");
            return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        } catch (error) {
            throw new Error("File upload to Pinata failed: " + error.message);
        }
    };

    const uploadMetadataToPinata = async (name, address, imageUrl) => {
        const jsonData = {
            name,
            physicalAddress: address,
            image: imageUrl,
        };

        try {
            const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer `,
                },
                body: JSON.stringify(jsonData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Metadata upload failed");
            console.log("Metadata IPFS Hash:", data.IpfsHash);
            return data.IpfsHash;
        } catch (err) {
            throw new Error("Metadata upload failed: " + err.message);
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.physicalAddress || !file) {
            setError("All fields are required");
            return;
        }

        try {
            const imageUrl = await uploadToPinata(file);
            const metadataHash = await uploadMetadataToPinata(
                form.name,
                form.physicalAddress,
                imageUrl
            );

            await createAccount({
                name: form.name,
                physicalAddress: form.physicalAddress,
                imageHash: metadataHash,
            });

            setForm({ name: "", physicalAddress: "" });
            setFile(null);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="Model">
            <div className="Model_box">
                <div className="Model_box_right">
                    <h1>
                        Create Your <span>Account</span>
                    </h1>
                    <p>Fill in the details below to join the blockchain chat app.</p>
                    <small>Ensure all fields are completed accurately.</small>
                    <div className="Model_box_right_name_info">
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            onChange={handleChange}
                            value={form.name}
                        />
                    </div>
                    <div className="Model_box_right_name_info">
                        <input
                            type="text"
                            placeholder="Physical Address"
                            name="physicalAddress"
                            onChange={handleChange}
                            value={form.physicalAddress}
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
                        <button onClick={handleSubmit}>
                            Create Account
                        </button>
                    </div>
                    {error && <p className="Model_error">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default Model;
