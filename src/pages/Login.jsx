import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Footer from "../components/Footer";

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
          <div className="flex justify-center items-center">
            <div className="w-1/2  pt-32 pl-20">
              <p className="text-white">Schon registriert?</p>
              <button className="mt-5 ml-5 border-white border p-2 pl-5 pr-5 text-white" onClick={handleLoginButtonClick}>
                Login
              </button>
            </div>
            <div className="w-1/2 pt-32 pl-24">
              <p className="text-white">Noch kein Account?</p>
              <button className="mt-5 ml-4 border-white border p-2 text-white" onClick={handleInfoItemClick}>
                Registrieren
              </button>
            </div>
          </div>
          <div className="container-form">
            <div className="form-item log-in">
              <div className="table">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/schoolweb-test.appspot.com/o/files%2FUnbenanntx.png?alt=media&token=ce988587-d78b-4578-8b59-ac64ba164265"
                  className="logo2"
                />
                <div className="table-cell">
                  <input
                    className="form-control"
                    type="email"
                    name="username"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    placeholder="Passwort"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button className="button" onClick={handleLogin}>
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
                  <button className="button" onClick={handleSignUp}>
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
