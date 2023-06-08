import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Footer from "./Footer";

export const SignUp = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleInfoItemClick = () => {
    setIsLogin(!isLogin);
  };

  const containerClasses = `container ${isLogin ? "log-in" : ""} ${
    isActive ? "active" : ""
  }`;

  const handleLoginButtonClick = () => {
    setIsLogin(false);
    setIsActive(false);
  };

  //Login

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const uid = userCredential.user.uid;
        localStorage.setItem("uid", uid);
        navigate("/home");
      })
      .catch(() => {
        navigate("/register");
      });
  };

  //Signup

  const [displayName, setDisplayName] = useState("");
  const [formFilled, setFormFilled] = useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    await createUserWithEmailAndPassword(auth, email, password);
    updateProfile(auth.currentUser, {
      displayName: displayName,
    })
      .then((userCredential) => {
        handleLoginButtonClick();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (email !== "" && password !== "" && displayName !== "") {
      setFormFilled(true);
    } else {
      setFormFilled(false);
    }
  }, [email, password, displayName]);

  return (
    <div>
      <div className={containerClasses}>
        <div className="box"></div>
        <div className="container-forms">
          <div className="container-info">
            <div className="info-item">
              <div className="table">
                <div className="table-cell">
                  <p>Schon registriert?</p>
                  <button class="btn" onClick={handleLoginButtonClick}>
                    Login
                  </button>
                </div>
              </div>
            </div>
            <div className="info-item">
              <div className="table">
                <div className="table-cell">
                  <p>Noch kein Account?</p>
                  <button class="btn" onClick={handleInfoItemClick}>
                    Registrieren
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="container-form">
            <div className="form-item log-in">
              <div className="table">
                <div className="table-cell">
                  <input
                    class="form-control"
                    type="email"
                    name="username"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <input
                    class="form-control"
                    type="password"
                    name="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button class="button" onClick={handleLogin}>
                    Login
                  </button>
                </div>
              </div>
            </div>
            <div className="form-item sign-up">
              <div className="table">
                <div className="table-cell">
                  <input
                    type="text"
                    placeholder="Username"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Passswort"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button class="button" onClick={handleSignUp}>
                    Registrieren
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
