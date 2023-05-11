import Morphology from "./components/akhos-morphology/Morphology";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/user-handling/Login";
import "./App.css";
// import { useMediaQuery } from 'react-responsive';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Morphology} />
        <Route path="/login" Component={Login} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
