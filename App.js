import "./App.css";
import { useUser } from "reactfire";
import Login from "./User/Login.jsx";
import Main from "./Main";
function App() {
  let utente = useUser();

  return <div className="App">{utente ? <Main /> : <Login />}</div>;
}

export default App;
