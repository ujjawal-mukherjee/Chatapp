// main.jsx or index.jsx// main.jsx or index.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ChatAppProvider } from "../Context/ChatAppContext";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter
/*import Router from "../router/Router";*/
import { Navbar, /*Routes, Route */ } from "./Components";
import Home from "./Components/Home";
import About from "./Components/About";
import Allusers from "./Components/Allusers";
import Chats from "./Components/Chats";
import Pendingrequest from "./Components/Pendingrequest";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatAppProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/allusers" element={<Allusers />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/pendingrequest" element={<Pendingrequest />} />
        </Routes>
      </ChatAppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
