import { auth, storage } from "../config/firebase";
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { Navigation } from "../components/Navigation";

import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

import moment from "moment";
import "moment/locale/de";

import Footer from "../components/Footer";

export const Home = () => {
  let username = "";
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [sortedImageUrls, setSortedImageUrls] = useState([]);

  const loggedin = () => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  };

  try {
    username = auth.currentUser.displayName;
  } catch (error) {
    console.log(error);
  }

  const post = async () => {
    const imagesRef = collection(db, "images");
    const q = query(imagesRef);

    try {
      const querySnapshot = await getDocs(q);
      const urls = [];
      for (const doc of querySnapshot.docs) {
        const { title, name, date, user } = doc.data();
        const imageRef = ref(storage, `images/${name}`);
        try {
          const url = await getDownloadURL(imageRef);
          urls.push({ title, url, date, user });
        } catch (error) {
          console.log("Error getting download URL: ", error);
        }
      }
      const downloadUrls = await Promise.all(
        querySnapshot.docs.map((doc) => {
          const { name } = doc.data();
          const imageRef = ref(storage, `images/${name}`);
          return getDownloadURL(imageRef);
        })
      );
      const sortedUrls = downloadUrls
        .map((url, index) => {
          const { title, date, user } = querySnapshot.docs[index].data();
          return { title, url, date, user };
        })
        .sort((a, b) => b.date - a.date);
      setSortedImageUrls(sortedUrls);
      setIsLoading(false);
    } catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  if (!loaded) {
    post();
    loggedin();
  }

  useEffect(() => {
    setLoaded(true);
  }, []);

  const updatedImages = sortedImageUrls.map((image) => {
    const time = moment.unix(image.date).fromNow();
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
      <Navigation title="Home" />

      <div className="post-wrap">
        {updatedImages.map((image) => {
          return (
            <div key={image.url} className="post">
              <div className="desc">
                <h2 >{image.title}</h2>
                <p title={image.date}>
                  {image.user} {image.dates}
                </p>
              </div>
              <div className="img">
                <img className="p-img" src={image.url} alt={image.title} />
              </div>
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
};
