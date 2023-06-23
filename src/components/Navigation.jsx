import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import Cheeseburger from "./Cheeseburger";

export const Navigation = ({ title = "title" }) => {
  const [toggled, setToggled] = useState(false);
  let username = "";
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortedImageUrls, setSortedImageUrls] = useState([]);

  const handleLogout = async () => {
    await signOut(auth)
      .then(() => {
        localStorage.removeItem("uid");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const loggedin = () => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  };

  try {
    username = auth.currentUser.displayName;
  } catch (error) {
    console.log(error);
  }

  const toggle = (event) => {
    event.preventDefault();
    setToggled(!toggled);
    if (!toggled) {
      openNav();
    } else {
      closeNav();
    }
  };

  const [sidenavWidth, setSidenavWidth] = useState(0);

  function openNav() {
    setSidenavWidth(250);
  }

  function closeNav() {
    setSidenavWidth(0);
  }

  return (
    <div>
      <div className="header">
        <Cheeseburger
          color={"#222222"}
          width={60}
          height={60}
          isToggled={toggled}
          onClick={toggle}
        />
        <h1 className="header-title text-4xl pt-4 font-bold">{title}</h1>
        <img
          className="header-logo"
          src="https://firebasestorage.googleapis.com/v0/b/schoolweb-test.appspot.com/o/files%2FUnbenanntx.png?alt=media&token=ce988587-d78b-4578-8b59-ac64ba164265"
        />
      </div>

      <div className="navigation" style={{ width: sidenavWidth }}>
        <a href="/home">Home</a>
        <a href="/post">Neuer Post</a>
        <a href="/chat">Chat</a>
        <a href="/credits">Credits</a>
        <a href="#" onClick={handleLogout}>
          Abmelden
        </a>
        <div
          className="navigation-credit"
          title="https://github.com/mario-hess"
        >
          <span>Cheeseburger by mario-hess</span>
        </div>

        <div className="navigation-user" style={{ width: sidenavWidth }}>
          <i class="fas fa-user-alt"></i>
          <p>{username}</p>
        </div>
      </div>
    </div>
  );
};
