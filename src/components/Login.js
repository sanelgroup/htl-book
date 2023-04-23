import '../design/Login.css';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState(''); //nice shit
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); //Really???

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem('user', JSON.stringify(userCredential.user));
        navigate('/home');
      })
      .catch(() => {
        navigate('/register');
      
    });
  };

  return (

    <div class="container">
    <div class="row">
      <div class="Absolute-Center is-Responsive">
        <div id="logo-container"></div>
        <div class="col-sm-12">
        <h1>Login</h1>
          <form onSubmit={handleSubmit} id="loginForm">
            <div class="form-group input-group">
              <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
              <input class="form-control" type="email" name='username' placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)}/>          
            </div>
            <div class="form-group input-group">
              <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
              <input class="form-control" type="password" name='password' placeholder="Passwort" value={password} onChange={(event) => setPassword(event.target.value)}/>     
            </div>

            <div class="form-group">
              <button type="submit" class="button">Login</button>
            </div>
            
          </form>        
        </div>  
      </div>    
    </div>
  </div>
  );
};
