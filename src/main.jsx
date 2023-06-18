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
import { Chat } from "./components/Chat";
import { Credits } from "./components/Credits";

import "./css/style.css";
import "./css/navigation.css";
import "./css/credits.css";

function App() {
  const user = auth.currentUser;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/post" element={<Posting />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/credits" element={<Credits />} />
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
