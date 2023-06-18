import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Navigation } from "./Navigation";
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
      .then(() => {
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
      <Navigation title="Neuer Post" />

      <div className="area">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <div className="file-upload">
          <input
            type="file"
            name="file-upload"
            id="file-upload"
            onChange={(event) => handleSelect(event.target.files[0])}
          />
          <label htmlFor="file-upload">Datei auswählen</label>
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
        <div className="upload">
          {image && <img className="u-img" src={image} alt="Dropped image" />}
        </div>
        <button
          onClick={handleUpload}
          disabled={!formFilled}
          className="button"
        >
          Upload Image
        </button>
      </div>
      <Footer />
    </div>
  );
};
