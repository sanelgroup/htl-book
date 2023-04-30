import { auth, storage } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { ref, getDownloadURL } from "firebase/storage";

import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

import moment from "moment";
import "moment/locale/de"; 



export const Home = () => {
  const navigate = useNavigate();


  const [loaded, setLoaded] = useState(false);


  const handleLogout = async () => {
    await signOut(auth)
      .then(() => {
        localStorage.removeItem("uid");
        navigate('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };


  const [user, setUser] = useState(null);

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


 

  let username = '';

  try {
    username = auth.currentUser.displayName;
  } catch (error) {
    console.log(error);
  }

  const [imageUrls, setImageUrls] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [sortedImageUrls, setSortedImageUrls] = useState([]);


  const post = () => {
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
              urls.push({ title, url, date, user });
            })
            .catch((error) => {
              console.log("Error getting download URL: ", error);
            });
        });
        Promise.all(querySnapshot.docs.map((doc) => {
          const { name } = doc.data();
          const imageRef = ref(storage, `images/${name}`);
          return getDownloadURL(imageRef);
        }))
        .then((urls) => {
          const sortedUrls = urls.map((url, index) => {
            const { title, date, user } = querySnapshot.docs[index].data();
            return { title, url, date, user };
          }).sort((a, b) => b.date - a.date);
          setSortedImageUrls(sortedUrls);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }, []);
    console.log('load')
  
  };
  
  


  if (!loaded) {
    post();
    loggedin();
  }

  useEffect(() => {
    setLoaded(true);
  }, []);



  
  // Aktuelles Datum als Unix-Timestamp

  
  const updatedImages = sortedImageUrls.map((image) => {
    // Berechnen Sie den Unterschied in Sekunden zwischen dem aktuellen Datum und dem Datum des Bildes
    
    // Verwenden Sie moment.js, um das Datum in ein relativen Format umzuwandeln
    const time = moment.unix(image.date).fromNow();
    // Geben Sie ein neues Bild-Objekt zurück, das das ursprüngliche Objekt mit dem aktualisierten Datum enthält

    const date = new Date(image.date * 1000);
    const formattedDate = date.toLocaleString();
    return {
      ...image,
      date: formattedDate,
      dates: time,
    };
  });



return (
  <div>
    <div  class="banner">
      <h1>Willkommen {username}</h1>
      
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="/drag">Post</a></li>
        <li><button id="buttn" onClick={handleLogout}>Abmelden</button></li>
      </ul>
    </div>

    {updatedImages.map((image) => {
      return (
      <div key={image.title} class="post">
        <div class="desc">
        <h2>{image.title}</h2>
        <p title={image.date}>{image.user}  {image.dates}</p>
        </div>
        <div class="img"><img src={image.url} alt={image.title}  /></div>
        
        </div>
      )
  })}
  </div>
);

};


