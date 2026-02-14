import React from "react";

import { Link } from "react-router-dom";
import Aurora from "./Aurora/Aurora.jsx";
import { RegisterUser } from "./ViewLibrary/Users/RegisterUser.jsx";
import { LoginUser } from "./ViewLibrary/Users/LoginUser.jsx";
import enterIcon from "../images/enter-outline (3).svg";
import "../styles/HomeScreen.css";

export const HomeScreen = ({ authUser, onAuthSuccess, onLogout }) => {
  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  const isAdmin = authUser?.role?.toLowerCase() === "admin";
  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const closeModals = () => {
    setShowRegister(false);
    setShowLogin(false);
  };

  const handleAuthSuccess = (user) => {
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }
    closeModals();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleCornerClick = () => {
    if (authUser) {
      handleLogout();
    } else {
      openLogin();
    }
  };
  return (
    <div
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <Aurora
        colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
        blend={0.5}
        amplitude={1.0}
        speed={1}
      />

      <div style={{ position: "sticky", top: 0, zIndex: 1, color: "white" }}>
        {authUser && (
          <div className="auth-corner">
            {isAdmin && <span className="auth-role-badge">Admin</span>}
            <span className="auth-email-top">{authUser.email}</span>
            <button className="corner-button" type="button" onClick={handleCornerClick}>
              <img src={enterIcon} alt={authUser ? "Logout" : "Login"} />
            </button>
          </div>
        )}
        {authUser && (
          <nav className="navbar">
            <div className="tabBar">
              <Link to="/">Home</Link>
              {isAdmin && <Link to="/add-authors">Add Authors</Link>}
              {isAdmin && <Link to="/add-books">Add Books</Link>}
              <Link to="/view-library">View Library</Link>
              {isAdmin && <Link to="/global-library">Global Library</Link>}
            </div>
          </nav>
        )}
        
        <div className="welcome-text">
          <p>Welcome to the Library Management System!</p>
        </div>
        {!authUser && (
          <p className="auth-hint">
            Please register or login to manage your library collection.
          </p>
        )}
        {!authUser && (
          <div className="authoriseButtons">
            <button className="register" onClick={openRegister}>
              Register
            </button>
            <button className="login" onClick={openLogin}>
              Login
            </button>
          </div>
        )} 
        {(showRegister || showLogin) && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {showRegister && (
                <RegisterUser onClose={closeModals} onSuccess={handleAuthSuccess} />
              )}
              {showLogin && (
                <LoginUser onClose={closeModals} onSuccess={handleAuthSuccess} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};