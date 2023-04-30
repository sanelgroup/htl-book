import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable, uploadString} from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

export const Drag = () => {
    const [dragging, setDragging] = useState(false);
    const [image, setImage] = useState(null);

    const [imageUpload, setImageUpload] = useState(null);
    const [title, setTitle] = useState("");
    const [imageUrls, setImageUrls] = useState([]);

    const[dragedImage, setDraggedImage] = useState(null);
  
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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setDraggedImage(reader.result);
        setImage(reader.result);
      }
    };
    
      
    const handleUpload = async () => {
        if (dragedImage == null) return;
      
        const imageRef = ref(storage, `images/${uuidv4()}`);
      
        uploadString(imageRef, dragedImage, 'data_url')
          .then((snapshot) => {
            const path = imageRef.fullPath.slice(7);
            addDoc(collection(db,"images"), {
              name: path,
              title: title,
              date: Math.floor(Date.now() / 1000),
              user: auth.currentUser.displayName,
              email: auth.currentUser.email,
            })
              .then(() => {
                console.log('Metadata added to Firestore');
              })
              .catch((error) => {
                console.error('Error adding metadata to Firestore:', error);
              });
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
          });
      }
    

  
    return (
      <div className='drag'>
        <input type="text" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
        
        <div className="App"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ border: dragging ? '2px dashed #aaa' : '2px dashed transparent', padding: '20px' }}
        >
          <p>Drag and drop file(s) here</p>
        </div>
        
        
        <button onClick={handleUpload}> Upload Image</button>
        <p><a href="/home">Home</a></p>
        {image && <img width='600px' src={image} alt="Dropped image" />}
      </div>
    );
  }



