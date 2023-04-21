import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { storage, db } from "../config/firebase";
import { getDownloadURL, ref } from "firebase/storage";

export const ImageGallery = () => {
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
          <h1>Image List</h1>
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
