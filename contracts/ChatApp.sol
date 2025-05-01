// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ChatApp {
    struct Friend {
        address pubkey;
        string name;
    }

    struct Message {
        address sender;
        uint256 timestamp;
        string msg;
    }

    struct User {
        string name;
        string physicalAddress;
        string imageHash; // IPFS hash
        Friend[] friendList;
    }

    struct AllUsersStruct {
        string name;
        address accountAddress;
        string imageHash;
    }
    /*
    post section
    */
    struct Comment {
        address commenter;
        string commentText;
        uint256 timestamp;
    }
    struct Post {
        uint256 id;
        address owner;
        string content;
        string imageHash; // optional: IPFS hash of image
        uint256 timestamp;
        address[] likes;
        Comment[] comments;
    }
    uint256 private postIdCounter;
    mapping(address => User) private userList;
    mapping(bytes32 => Message[]) private allMessages;
    mapping(address => Post[]) private userPosts;
    AllUsersStruct[] private getAllUsers;

    mapping(address => address[]) public pendingRequests; // requests received
    mapping(address => address[]) public sentRequests; // requests sent

    modifier userExists(address user) {
        require(bytes(userList[user].name).length > 0, "User not registered");
        _;
    }

    function checkUserExists(address pubkey) public view returns (bool) {
        return bytes(userList[pubkey].name).length > 0;
    }

    function createAccount(
        string calldata name,
        string calldata physicalAddress,
        string calldata imageHash
    ) external {
        require(!checkUserExists(msg.sender), "User already exists");
        require(bytes(name).length > 0, "Username cannot be empty");

        userList[msg.sender].name = name;
        userList[msg.sender].physicalAddress = physicalAddress;
        userList[msg.sender].imageHash = imageHash;

        getAllUsers.push(AllUsersStruct(name, msg.sender, imageHash));
    }

    function getUsername(
        address pubkey
    ) external view userExists(pubkey) returns (string memory) {
        return userList[pubkey].name;
    }

    function sendFriendRequest(
        address to
    ) external userExists(msg.sender) userExists(to) {
        require(msg.sender != to, "Cannot send request to yourself");
        require(!checkAlreadyFriends(msg.sender, to), "Already friends");
        require(!requestAlreadySent(msg.sender, to), "Request already sent");

        pendingRequests[to].push(msg.sender);
        sentRequests[msg.sender].push(to);
    }

    function acceptFriendRequest(address from) external {
        require(
            requestAlreadyReceived(msg.sender, from),
            "No request from this user"
        );

        _addFriend(msg.sender, from);
        _addFriend(from, msg.sender);

        // Remove from pending and sent requests
        _removeRequest(pendingRequests[msg.sender], from);
        _removeRequest(sentRequests[from], msg.sender);
    }

    function getMyFriendList() external view returns (Friend[] memory) {
        return userList[msg.sender].friendList;
    }

    function getMyPendingRequests() external view returns (address[] memory) {
        return pendingRequests[msg.sender];
    }

    function getMySentRequests() external view returns (address[] memory) {
        return sentRequests[msg.sender];
    }

    function checkAlreadyFriends(
        address user1,
        address user2
    ) internal view returns (bool) {
        Friend[] memory friends = userList[user1].friendList;
        for (uint i = 0; i < friends.length; i++) {
            if (friends[i].pubkey == user2) return true;
        }
        return false;
    }

    function requestAlreadySent(
        address from,
        address to
    ) internal view returns (bool) {
        address[] memory requests = sentRequests[from];
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i] == to) return true;
        }
        return false;
    }

    function requestAlreadyReceived(
        address to,
        address from
    ) internal view returns (bool) {
        address[] memory requests = pendingRequests[to];
        for (uint i = 0; i < requests.length; i++) {
            if (requests[i] == from) return true;
        }
        return false;
    }

    function _removeRequest(address[] storage list, address user) internal {
        for (uint i = 0; i < list.length; i++) {
            if (list[i] == user) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
    }

    function _addFriend(address me, address friendKey) internal {
        Friend memory newFriend = Friend(friendKey, userList[friendKey].name);
        userList[me].friendList.push(newFriend);
    }

    function _getChatCode(
        address pubkey1,
        address pubkey2
    ) internal pure returns (bytes32) {
        return
            pubkey1 < pubkey2
                ? keccak256(abi.encodePacked(pubkey1, pubkey2))
                : keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    function sendMessage(address friendKey, string calldata _msg) external {
        require(checkUserExists(msg.sender), "Register first");
        require(checkUserExists(friendKey), "User not registered");
        require(checkAlreadyFriends(msg.sender, friendKey), "Not friends");

        bytes32 chatCode = _getChatCode(msg.sender, friendKey);
        Message memory newMsg = Message(msg.sender, block.timestamp, _msg);
        allMessages[chatCode].push(newMsg);
    }

    function readMessage(
        address friendKey
    ) external view returns (Message[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friendKey);
        return allMessages[chatCode];
    }

    function getAllAppUser() public view returns (AllUsersStruct[] memory) {
        return getAllUsers;
    }

    function rejectFriendRequest(address from) external {
        require(
            requestAlreadyReceived(msg.sender, from),
            "No request from this user"
        );

        _removeRequest(pendingRequests[msg.sender], from);
        _removeRequest(sentRequests[from], msg.sender);
    }

    /*post section*/
    function createPost(
        string calldata content,
        string calldata imageHash
    ) external userExists(msg.sender) {
        Post memory newPost = Post({
            id: postIdCounter++,
            owner: msg.sender,
            content: content,
            imageHash: imageHash,
            timestamp: block.timestamp,
            likes: new address[](0),
            comments: new Comment[](0)
        });

        userPosts[msg.sender].push(newPost);
    }

    //
    function getFriendsPosts()
        external
        view
        userExists(msg.sender)
        returns (Post[] memory)
    {
        Friend[] memory friends = userList[msg.sender].friendList;
        uint totalPosts;

        for (uint i = 0; i < friends.length; i++) {
            totalPosts += userPosts[friends[i].pubkey].length;
        }

        Post[] memory allFriendPosts = new Post[](totalPosts);
        uint k = 0;

        for (uint i = 0; i < friends.length; i++) {
            Post[] memory posts = userPosts[friends[i].pubkey];
            for (uint j = 0; j < posts.length; j++) {
                allFriendPosts[k++] = posts[j];
            }
        }

        return allFriendPosts;
    }

    //
    function likePost(
        address friend,
        uint256 postId
    ) external userExists(msg.sender) {
        require(checkAlreadyFriends(msg.sender, friend), "Not friends");
        Post[] storage posts = userPosts[friend];

        for (uint i = 0; i < posts.length; i++) {
            if (posts[i].id == postId) {
                for (uint j = 0; j < posts[i].likes.length; j++) {
                    require(posts[i].likes[j] != msg.sender, "Already liked");
                }
                posts[i].likes.push(msg.sender);
                return;
            }
        }

        revert("Post not found");
    }

    //
    function commentOnPost(
        address friend,
        uint256 postId,
        string calldata commentText
    ) external userExists(msg.sender) {
        require(checkAlreadyFriends(msg.sender, friend), "Not friends");
        Post[] storage posts = userPosts[friend];

        for (uint i = 0; i < posts.length; i++) {
            if (posts[i].id == postId) {
                Comment memory newComment = Comment({
                    commenter: msg.sender,
                    commentText: commentText,
                    timestamp: block.timestamp
                });
                posts[i].comments.push(newComment);
                return;
            }
        }

        revert("Post not found");
    }

    //get posts
    function getMyPosts()
        external
        view
        userExists(msg.sender)
        returns (Post[] memory)
    {
        return userPosts[msg.sender];
    }
}
