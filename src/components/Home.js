import { auth, storage } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import Cheeseburger from "./Cheeseburger";

import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

import moment from "moment";
import "moment/locale/de";

export const Home = () => {
  let username = "";
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortedImageUrls, setSortedImageUrls] = useState([]);

  const handleLogout = async () => {
    await signOut(auth)
      .then(() => {
        localStorage.removeItem("uid");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

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

  const post = () => {
    const imagesRef = collection(db, "images");
    const q = query(imagesRef);

    getDocs(q).then((querySnapshot) => {
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
      Promise.all(
        querySnapshot.docs.map((doc) => {
          const { name } = doc.data();
          const imageRef = ref(storage, `images/${name}`);
          return getDownloadURL(imageRef);
        })
      )
        .then((urls) => {
          const sortedUrls = urls
            .map((url, index) => {
              const { title, date, user } = querySnapshot.docs[index].data();
              return { title, url, date, user };
            })
            .sort((a, b) => b.date - a.date);
          setSortedImageUrls(sortedUrls);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }, []);
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
          Willkommen {username}
        </h1>
        <img src="https://firebasestorage.googleapis.com/v0/b/schoolweb-test.appspot.com/o/files%2FUnbenanntx.png?alt=media&token=ce988587-d78b-4578-8b59-ac64ba164265" class="logo"/>
      </div>

      <div id="mySidenav" style={{ width: sidenavWidth }}>
        <a href="/home">Home</a>
        <a href="/post">Neuer Post</a>
        <a href="#" onClick={handleLogout}>Abmelden</a>
        <div title="https://github.com/mario-hess">
          <a href="/mario">
            <span class="credit-p">Cheeseburger by mario-hess</span>
          </a>
        </div>
      </div>

      <div class="post-wrap">
        {updatedImages.map((image) => {
          return (
            <div key={image.url} class="post">
              <div class="desc">
                <h2>{image.title}</h2>
                <p title={image.date}>
                  {image.user} {image.dates}
                </p>
              </div>
              <div class="img">
                <img class="p-img" src={image.url} alt={image.title} />
              </div>
            </div>
          );
        })}
      </div>
      <p class="footer">2023 by SanelGroup Ltd.</p>
    </div>
  );
};
