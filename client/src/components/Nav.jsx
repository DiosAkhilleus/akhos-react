import React from "react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  return (
    <div className="nav-bar">
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div className="page-title">Akhos</div>
        {/* <div className="page-subtitle">A Classical Studies Morphology Tool</div> */}
      </div>

      <a
        href="https://www.buymeacoffee.com/andrewbertin"
        target="_blank"
        className="coffee-button"
      >
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png"
          alt="Buy Me A Coffee"
          style={{ height: 50, width: 217 * (5 / 6) }}
        />
      </a>
      <button
        className="button-base"
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Nav;
