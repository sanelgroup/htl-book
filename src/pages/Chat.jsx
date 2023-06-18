import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, db } from "../config/firebase";

import { Navigation } from "../components/Navigation";

import "../css/chat.css";

export const Chat = () => {
  const ref = useRef(null);
  const [formValue, setFormValue] = useState("");
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

  return (
    <>
      <Navigation title="Chat" />
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
          <i className="fa fa-paper-plane" aria-hidden="true"></i>
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
