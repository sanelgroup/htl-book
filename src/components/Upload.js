import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

export const Upload = () => {

  const [user, setUser] = useState(null);

  const [loaded, setLoaded] = useState(false);

  const loggedin = () => {
    document.title = "HTLBook"
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  };

  const [imageUpload, setImageUpload] = useState(null);
  const [title, setTitle] = useState("");
  const [imageUrls, setImageUrls] = useState([]);



  const handleUpload = async () => {
    if (imageUpload == null) return;

    const imageRef = ref(storage, `images/${uuidv4()}`);
    

    uploadBytesResumable(imageRef, imageUpload)
      .then((snapshot) => {
        const path = imageRef.fullPath.slice(7)
      // Add metadata to Firestore
      console.log(path)
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

      // ...
    })
    .catch((error) => {
      console.error('Error uploading image:', error);
    });
  };


  if (!loaded) {
    loggedin();
  }

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="App">
      <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
      <input type="text" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
      <button onClick={handleUpload}> Upload Image</button>
      {imageUpload && (
        <img src={URL.createObjectURL(imageUpload)} alt="Selected image" />
      )}
      <p><a href="/home">Home</a></p>
    </div>
  );
}
