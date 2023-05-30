import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";

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

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css"
        integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY="
        crossorigin="anonymous"
      ></link>
      <div class="banner">
        <h1>Upload</h1>

        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/post">Post</a>
          </li>
        </ul>
      </div>
      <div className="area">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type="file"
          onChange={(event) => handleSelect(event.target.files[0])}
        />

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
          <p>Drag and drop file(s) here</p>
        </div>
        <div class="upload">
          {image && <img class="u-img" src={image} alt="Dropped image" />}
        </div>
        <button onClick={handleUpload} disabled={!formFilled} class="button">
          <i class="fa fa-cloud-upload" aria-hidden="true"></i>
          Upload Image
        </button>
      </div>
    </div>
  );
};
