import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [formFilled, setFormFilled] = useState(false); // State-Variable für den Formularstatus
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password)
    updateProfile(auth.currentUser, {
      displayName: displayName
    })
      .then((userCredential) => {
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });

  };

  useEffect(() => {
    if (email !== '' && password !== '' && displayName !== '') {
      setFormFilled(true);
    } else {
      setFormFilled(false);
    }
  }, [email, password, displayName]);

  return (
    <form onSubmit={handleSubmit}>
       <label>
        Username:
        <input type="text" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button type="submit" disabled={!formFilled}>Register</button>
      <p>Schon Registriert? <a href="/">Login</a></p>
    </form>
  );
};
