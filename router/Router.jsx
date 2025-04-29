// router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../src/App";
import Allusers from "../src/Components/Allusers";
//import Chat from "../src/Components/Chat.jsx";
import Chats from "../src/Components/Chats";
import Home from "../src/Components/Home";
import About from "../src/Components/About";
const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/allusers" element={<Allusers />} />
            <Route path="/chats" element={< Chats />} />
            <Route path="/about" element={< About />} />
        </Routes>
    );
};

export default Router;
