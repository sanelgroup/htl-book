import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SignUp } from "./components/Login";
import { Home } from "./components/Home";
import { auth } from "./config/firebase";
import { Posting } from "./components/Posting";
import { Menu } from "./components/Mario";
import { Chat } from "./components/Chat";

import "./css/style.css";

function App() {
  const user = auth.currentUser;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/post" element={<Posting />} />
      <Route path="/mario" element={<Menu />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
