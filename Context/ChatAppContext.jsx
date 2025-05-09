import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckIfWalletConnected, connectWallet } from "../Utils/apiFeatures";
import { ethers } from "ethers";
import { ChatAppAddress, ChatAppABI } from "./constants";

export const chatAppContext = React.createContext();

export const ChatAppProvider = ({ children }) => {
    const navigate = useNavigate();
    const title = "Hey welcome to blockchain";

    const [account, setAccount] = useState("");
    const [username, setUserName] = useState("");
    const [friendLists, setFriendLists] = useState([]);
    const [friendMsg, setFriendMsg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [error, setError] = useState("");

    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserAddress, setCurrentUserAddress] = useState("");
    const [myPosts, setMyPosts] = useState([]);
    const [friendsPosts, setFriendsPosts] = useState([]);
    const getProvider = () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        provider.resolveName = async () => null;
        return provider;
    };

    const fetchData = async () => {
        try {
            const connectAccount = await connectWallet();
            if (!connectAccount) throw new Error("Wallet not connected");
            setAccount(connectAccount);

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const userName = await contract.getUsername(connectAccount);
            if (userName) {
                setUserName(userName);
                setCurrentUserName(userName);
                setCurrentUserAddress(connectAccount);
            }

            const friends = await contract.getMyFriendList();
            setFriendLists(friends);

            const users = await contract.getAllAppUser();
            setUserList(users);

            const pending = await contract.getMyPendingRequests();
            setPendingRequests(pending);

            const sent = await contract.getMySentRequests();
            setSentRequests(sent);

        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Please connect your wallet");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const createAccount = async ({ name, physicalAddress, imageHash }) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.createAccount(name, physicalAddress, imageHash);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            await new Promise((resolve) => setTimeout(resolve, 3000));

            const updatedUserName = await contract.getUsername(account);
            if (!updatedUserName || updatedUserName === "0x") {
                throw new Error("User not created or empty data returned.");
            }

            setUserName(updatedUserName);
            setCurrentUserName(updatedUserName);
            setCurrentUserAddress(account);

            const updatedUserList = await contract.getAllAppUser();
            setUserList(updatedUserList);

            navigate("/");
        } catch (error) {
            console.error("Error creating account:", error);
            setError("Error in creating account");
        }
    };

    const sendFriendRequest = async (friendAddress) => {
        try {
            if (!friendAddress) {
                return setError("Friend address cannot be empty");
            }

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.sendFriendRequest(friendAddress);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Error sending friend request:", error);
            setError("Error in sending friend request");
        }
    };

    const acceptFriendRequest = async (friendAddress) => {
        try {
            if (!friendAddress) {
                return setError("Friend address cannot be empty");
            }

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.acceptFriendRequest(friendAddress);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Error accepting friend request:", error);
            setError("Error in accepting friend request");
        }
    };

    const sendMessage = async ({ msg, address }) => {
        try {
            if (!msg || !address) {
                return setError("Message and address cannot be empty");
            }

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.sendMessage(address, msg);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            const updatedMessages = await contract.readMessage(address);
            setFriendMsg(updatedMessages);

        } catch (error) {
            console.error("Error sending message:", error);
            setError("Error in sending message");
        }
    };

    const readMessage = async (friendAddress) => {
        try {
            if (!friendAddress) return;

            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const messages = await contract.readMessage(friendAddress);
            setFriendMsg(messages);
        } catch (error) {
            console.error("Error reading message:", error);
            setError("No message found");
        }
    };

    const readUser = async (userAddress) => {
        try {
            const provider = getProvider();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, provider);

            const userName = await contract.getUsername(userAddress);
            setCurrentUserName(userName);
            setCurrentUserAddress(userAddress);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setError("Unable to fetch user details");
        }
    };
    //
    const rejectRequest = async (fromaddress) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);
            const tx = await contract.rejectFriendRequest(fromaddress);
            await tx.wait();
            console.log("friend request sent sucessfully");
        } catch (error) {
            console.error("Error rejecting friend request:", error);
        }
    }

    useEffect(() => {
        if (account) {
            setCurrentUserAddress(account);
        }
    }, [account]);
    //post section
    const createPost = async (content, imageHash) => {
        try {
            const provider = await getProvider();
            const signer = await provider.getSigner();
            const signerAddress = await signer.getAddress();
            console.log("Creating post with address:", signerAddress);
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.createPost(content, imageHash);
            setLoading(true);
            console.log("Create post tx hash:", tx.hash);
            await tx.wait();
            setLoading(false);

            await fetchMyPosts();
        } catch (error) {
            console.error("Error creating post:", error);
            setError("Error in creating post: " + error.message);
        }
    };

    // Fetch user's own posts
    /*
    const fetchMyPosts = async () => {
        try {
            const provider = await getProvider();
            const signer = await provider.getSigner();
            const signerAddress = await signer.getAddress();
            console.log("Fetching posts for address:", signerAddress);
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, provider);
            const posts = await contract.getMyPosts();
            setMyPosts(posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Error in fetching posts: " + error.message);
        }
    };
    */
    // Fetch friends' posts
    /*
    const fetchFriendsPosts = async () => {
        try {
            const provider = await getProvider();
            const signer = await provider.getSigner();
            const signerAddress = await signer.getAddress();
            console.log("Fetching friends' posts for address:", signerAddress);
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const isUserRegistered = await contract.checkUserExists(signerAddress);
            console.log("Is user registered?", isUserRegistered);
            if (!isUserRegistered) {
                setError("User not registered. Please create an account.");
                return;
            }

            const posts = await contract.getFriendsPosts();
            setFriendsPosts(posts);
        } catch (error) {
            console.error("Error fetching friends' posts:", error);
            setError("Error in fetching friends' posts: " + error.message);
        }
    };
    */
    const fetchMyPosts = async () => {
        try {
            const provider = await getProvider();
            const signer = await provider.getSigner();
            const signerAddress = await signer.getAddress();
            console.log("Fetching my posts for address:", signerAddress);
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            // Check if user is registered
            const isUserRegistered = await contract.checkUserExists(signerAddress);
            console.log("Is user registered for my posts?", isUserRegistered);
            if (!isUserRegistered) {
                setError("User not registered. Please create an account.");
                return;
            }

            const posts = await contract.getMyPosts();
            console.log("My posts fetched:", posts);
            setMyPosts(posts);
        } catch (error) {
            console.error("Error fetching my posts:", error);
            setError("Error fetching my posts: " + error.message);
        }
    };

    const fetchFriendsPosts = async () => {
        try {
            const provider = await getProvider();
            const signer = await provider.getSigner();
            const signerAddress = await signer.getAddress();
            console.log("Fetching friends' posts for address:", signerAddress);
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            // Check if user is registered
            const isUserRegistered = await contract.checkUserExists(signerAddress);
            console.log("Is user registered for friends' posts?", isUserRegistered);
            if (!isUserRegistered) {
                setError("User not registered. Please create an account.");
                return;
            }

            const posts = await contract.getFriendsPosts();
            console.log("Friends' posts fetched:", posts);
            setFriendsPosts(posts);
        } catch (error) {
            console.error("Error fetching friends' posts:", error);
            setError("Error fetching friends' posts: " + error.message);
        }
    };

    // Like a friend's post
    const likePost = async (friendAddress, postId) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.likePost(friendAddress, postId);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            await fetchFriendsPosts();
        } catch (error) {
            console.error("Error liking post:", error);
            setError("Error in liking post");
        }
    };

    // Comment on a friend's post
    const commentOnPost = async (friendAddress, postId, commentText) => {
        try {
            const provider = getProvider();
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(ChatAppAddress, ChatAppABI, signer);

            const tx = await contract.commentOnPost(friendAddress, postId, commentText);
            setLoading(true);
            await tx.wait();
            setLoading(false);

            await fetchFriendsPosts();
        } catch (error) {
            console.error("Error commenting on post:", error);
            setError("Error in commenting on post");
        }
    };
    return (
        <chatAppContext.Provider
            value={{
                title,
                account,
                username,
                friendLists,
                friendMsg,
                loading,
                error,
                currentUserName,
                currentUserAddress,
                userList,
                pendingRequests,
                sentRequests,
                CheckIfWalletConnected,
                connectWallet,
                readMessage,
                createAccount,
                sendFriendRequest,
                acceptFriendRequest,
                sendMessage,
                readUser,
                rejectRequest,
                createPost,
                fetchMyPosts,
                fetchFriendsPosts,
                likePost,
                commentOnPost,
                myPosts,
                friendsPosts
            }}
        >
            {children}
        </chatAppContext.Provider>
    );
};
