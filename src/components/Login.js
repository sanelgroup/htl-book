
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
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

  return (
    <div class="container">
      <div class="row">
        <div class="Absolute-Center is-Responsive">
          <div id="logo-container"></div>
          <div class="col-sm-12">
            <img
              width="200px"
              src="https://firebasestorage.googleapis.com/v0/b/schoolweb-test.appspot.com/o/files%2FUnbenannt.PNG?alt=media&token=bd4ae4f1-4fe2-41c0-95de-78be151ac212"
              alt="My Image"
            />
            <h1>Login</h1>
            <form onSubmit={handleSubmit} id="loginForm">
              <div class="form-group input-group">
                <span class="input-group-addon">
                  <i class="glyphicon glyphicon-user"></i>
                </span>
                <input
                  class="form-control"
                  type="email"
                  name="username"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div class="form-group input-group">
                <span class="input-group-addon">
                  <i class="glyphicon glyphicon-lock"></i>
                </span>
                <input
                  class="form-control"
                  type="password"
                  name="password"
                  placeholder="Passwort"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div class="form-group">
                <button type="submit" class="button">
                  Login
                </button>
              </div>
            </form>
            <p>
              <a href="/register">Registrieren</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
