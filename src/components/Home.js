import { auth, storage } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { ref, getDownloadURL } from "firebase/storage";

import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";



export const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };


  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "HTLBook"
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });



    return () => unsubscribe();
  }, []);

 

  let username = '';

  try {
    username = auth.currentUser.displayName;
  } catch (error) {
    console.log(error);
  }

  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImages = () => {
        const imagesRef = collection(db, "images");
        const q = query(imagesRef);
      
        getDocs(q)
          .then((querySnapshot) => {
            const urls = [];
            querySnapshot.forEach((doc) => {
              const { title, name, date, user } = doc.data();
      
              const imageRef = ref(storage, `images/${name}`);
              getDownloadURL(imageRef)
                .then((url) => {
                  urls.push({ title, url , date, user});
                  setImageUrls(urls);
                })
                .catch((error) => {
                  console.log("Error getting download URL: ", error);
                });
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      };
      
   

    

    fetchImages();
  }, []);

  
  return (
        
        <div>
          <h1>Willkommen {auth.currentUser.displayName}</h1>
          <p><a href="/upload">Upload</a></p>
          <button onClick={handleLogout}>Abmelden</button>

          {imageUrls.map((image) => (
            <div key={image.url}>
              <h2>{image.title}</h2>
              <p>von {image.user} am {image.date}</p>
              <img src={image.url} alt={image.title} width="400" />
            </div>
          ))}
        </div>
      );
};
