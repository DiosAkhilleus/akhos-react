import Morphology from "./components/akhos-morphology/Morphology";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/user-handling/Login";
import Nav from "./components/Nav";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" Component={Morphology} />
        <Route path="/login" Component={Login} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
