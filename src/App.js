import './App.css';
import { Auth } from './components/auth';
//import { Login} from './components/login';

import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config/firebase";
import { useNavigate, Routes, Route } from 'react-router-dom';

import Home from './Home';
import Register from './Register';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/home');
      })
      .catch(() => {
        navigate('/register');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
