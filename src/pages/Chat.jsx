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
import { FaRegPaperPlane } from "react-icons/fa";

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
            className={"chat_input mb-1"}
          />
          <button type="submit" disabled={!formValue} className="pr-2">
            <FaRegPaperPlane />
          </button>
        
      </form>
    </>
  );
};

function ChatMessage(props) {
  const { text, uid, displayName } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "chat-end" : "chat-start";
  const messageColor =
    uid === auth.currentUser.uid ? "bg-blue-500" : "bg-gray-500";

  const uName = uid === auth.currentUser.uid ? "" : displayName;

  return (
    <>
      <p className="pl-4 text-sm text-slate-600">{uName}</p>
      <div className={`chat ${messageClass}`}>
        <div className={`chat-bubble ${messageColor}`}>
          <p>{text}</p>
        </div>
      </div>
    </>
  );
}
