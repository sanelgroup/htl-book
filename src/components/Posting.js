import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import Cheeseburger from "./Cheeseburger";
import Footer from "./Footer";

export const Posting = () => {
  const [dragging, setDragging] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [dragedImage, setDraggedImage] = useState(null);
  const [formFilled, setFormFilled] = useState(false);

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setDraggedImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleSelect = (file) => {
    setDraggedImage(file);
    console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleUpload = async () => {
    if (dragedImage == null) return;

    const imageRef = ref(storage, `images/${uuidv4()}`);
    uploadBytesResumable(imageRef, dragedImage)
      .then((snapshot) => {
        const path = imageRef.fullPath.slice(7);
        addDoc(collection(db, "images"), {
          name: path,
          title: title,
          date: Math.floor(Date.now() / 1000),
          user: auth.currentUser.displayName,
          email: auth.currentUser.email,
        })
          .then(() => {
            console.log("Uploaded!");
          })
          .catch((error) => {
            console.error("Error adding metadata to Firestore:", error);
          });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    if (title !== "") {
      setFormFilled(true);
    } else {
      setFormFilled(false);
    }
  }, [title]);

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
    <div>
      <div id="left">
        <Cheeseburger
          color={"#222222"}
          width={60}
          height={60}
          isToggled={toggled}
          onClick={toggle}
        />
        <h1 class="mario" title="https://github.com/mario-hess">
          Upload
        </h1>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/schoolweb-test.appspot.com/o/files%2FUnbenanntx.png?alt=media&token=ce988587-d78b-4578-8b59-ac64ba164265"
          class="logo"
        />
      </div>

      <div id="mySidenav" style={{ width: sidenavWidth }}>
        <a href="/home">Home</a>
        <div title="https://github.com/mario-hess">
          <a href="/mario">
            <span class="credit-p">Cheeseburger by mario-hess</span>
          </a>
        </div>
      </div>

      <div className="area">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <div class="file-upload">
          <input
            type="file"
            name="file-upload"
            id="file-upload"
            onChange={(event) => handleSelect(event.target.files[0])}
          />
          <label for="file-upload">Datei auswählen</label>
        </div>

        <div
          className="drop-area"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            border: dragging ? "2px dashed #aaa" : "2px dashed transparent",
            padding: "20px",
          }}
        >
          <p>Drag and drop pictures here</p>
        </div>
        <div class="upload">
          {image && <img class="u-img" src={image} alt="Dropped image" />}
        </div>
        <button onClick={handleUpload} disabled={!formFilled} class="button">
          Upload Image
        </button>
      </div>
      <Footer />
    </div>
  );
};
