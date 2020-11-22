import { useState } from "react";
import { useUser, useAuth } from "reactfire";
import CameraComponent from "./CameraComponent";
import ViewStories from "./ViewStories";

const Main = () => {
  const utente = useUser();
  const auth = useAuth();
  const [viewToShow, changeViewToShow] = useState("view");

  const logout = () => {
    auth.signOut();
  };

  return (
    <div style={{ marginTop: "25px" }}>
      Ciao {utente.displayName}{" "}
      <div style={{ marginTop: "25px" }}>
        <button className="button is-primary" onClick={logout}>
          Logout
        </button>
      </div>
      <div style={{ marginTop: "30px" }}>
        {viewToShow === "record" ? (
          <div style={{ marginTop: "30px" }}>
            <CameraComponent />
            <button
              className="button is-primary"
              onClick={() => {
                changeViewToShow("view");
              }}
            >
              View Stories
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                changeViewToShow("record");
              }}
              className="button is-primary"
            >
              Create story
            </button>
            <ViewStories />
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
