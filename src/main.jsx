import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./config/firebase";
import { SignUp } from "./pages/Login";
import { Home } from "./pages/Home";
import { Posting } from "./pages/Posting";
import { Chat } from "./pages/Chat";
import { Credits } from "./pages/Credits";

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
