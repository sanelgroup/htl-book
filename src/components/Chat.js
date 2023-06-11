import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";

import Cheeseburger from "./Cheeseburger";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import "../css/chat.css";

export const Chat = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState("");
  const [user] = useAuthState(auth);
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"));

  const [messages] = useCollectionData(q, { idField: "id" });

  useEffect(() => {
    if (ref.current) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, displayName } = auth.currentUser;
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      displayName,
    });

    setFormValue("");
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

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

  const [toggled, setToggled] = useState(false);

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
    <>
      <div id="left">
        <Cheeseburger
          color={"#222222"}
          width={60}
          height={60}
          isToggled={toggled}
          onClick={toggle}
        />
        <h1 class="mario" title="https://github.com/mario-hess">
          Chat
        </h1>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/schoolweb-test.appspot.com/o/files%2FUnbenanntx.png?alt=media&token=ce988587-d78b-4578-8b59-ac64ba164265"
          class="logo"
        />
      </div>

      <div id="mySidenav" style={{ width: sidenavWidth }}>
        <a href="/home">Home</a>
        <a href="/post">Neuer Post</a>
        <a href="/chat">Chat</a>
        <a href="#" onClick={handleLogout}>
          Abmelden
        </a>
        <div title="https://github.com/mario-hess">
          <a href="/mario">
            <span class="credit-p">Cheeseburger by mario-hess</span>
          </a>
        </div>
      </div>
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      </main>
      <div ref={ref}></div>

      <form onSubmit={sendMessage} className={"chat_form"}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          className={"chat_input"}
        />
        <button type="submit" disabled={!formValue} className={"send_button"}>
          <i class="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
      </form>
    </>
  );
};

function ChatMessage(props) {
  const { text, uid, displayName } = props.message;
  const messageClass = uid === auth.currentUser.uid ? " sent" : "received";

  const uName = uid === auth.currentUser.uid ? "" : displayName;

  const senderClass = uid === auth.currentUser.uid ? "gone" : "sender";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <h2 className={`${senderClass}`}>{uName}</h2>
        <p className={`p_chat `}>{text}</p>
      </div>
    </>
  );
}
