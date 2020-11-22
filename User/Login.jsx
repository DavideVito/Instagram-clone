import React from "react";
import { useAuth } from "reactfire";
import firebase from "firebase";

const Login = () => {
  const auth = useAuth();
  const googleLogin = () => {
    let provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider);
  };

  return (
    <button className="button is-primary" onClick={googleLogin}>
      Login
    </button>
  );
};

export default Login;
