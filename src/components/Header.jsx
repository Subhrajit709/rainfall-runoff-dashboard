import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import React, { useState, useRef, useEffect } from "react";
import "./Header.css";

export default function Header({ onNavigate, dashboardRef, aboutRef, galleryRef, contactRef }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
        setShowLoginOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setLoggedIn(true);
      setUserName(user.displayName || "User");
      setProfileOpen(false);
      setShowLoginOptions(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserName("User");
  };

  return (
    <header className="isro-header">
      <div className="isro-header__left">
        <img
          src="https://www.nrsc.gov.in/nrscnew/assets/img/footer/isro.png"
          alt="ISRO"
          className="isro-logo"
        />
        <div>
          <div className="brand-main">NRSC | ISRO</div>
          <div className="brand-sub">National Remote Sensing Centre</div>
        </div>
      </div>

      <div className="isro-header__center">
        <h1 className="main-title">Rainfall-Runoff monitoring dashboard</h1>
        <div className="center-sub">
          Real-time Data Visualization & Analysis System
        </div>
      </div>

      <div className="isro-header__right">
        <div className="status">
          <span className="status-dot" />
          <span className="status-text">System Active</span>
        </div>
        {/* Navigation buttons */}
          
<br />
<br />
<br />
<br />
        <div className="header-nav-buttons">
          <button className="header-nav-btn" onClick={() => onNavigate(dashboardRef)}>
            Dashboard
          </button>
          <button className="header-nav-btn" onClick={() => onNavigate(aboutRef)}>
            About
          </button>
          <button className="header-nav-btn" onClick={() => onNavigate(galleryRef)}>
            Gallery
          </button>
          <button className="header-nav-btn" onClick={() => onNavigate(contactRef)}>
            Contact
          </button>
        </div>

        <div className="profile-wrap" ref={dropdownRef}>
          <button
            className="profile-btn"
            onClick={() => setProfileOpen((o) => !o)}
          >
            {loggedIn ? userName.slice(0, 2).toUpperCase() : "👤"}
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              {!loggedIn && showLoginOptions && (
                <>
                  <div className="profile-dropdown-header">
                    <div>
                      <div className="profile-dropdown-name">Sign in</div>
                      <div className="profile-dropdown-role">
                        Choose login method
                      </div>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <button
                    className="profile-dropdown-item login-btn"
                    onClick={handleGoogleLogin}
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="google"
                      style={{ width: "16px", marginRight: "8px" }}
                    />
                    Continue with Google
                  </button>

                  <button
                    className="profile-dropdown-item"
                    onClick={() => setShowLoginOptions(false)}
                  >
                    ← Back
                  </button>
                </>
              )}

              {!loggedIn && !showLoginOptions && (
                <>
                  <div className="profile-dropdown-header" style={{ textAlign: "center" }}>
                    <div>
                      <div className="profile-dropdown-name">Welcome</div>
                      <div className="profile-dropdown-role">
                        Sign in to your account
                      </div>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <button
                    className="profile-dropdown-item login-btn"
                    onClick={() => setShowLoginOptions(true)}
                  >
                    Log In
                  </button>

                  <button className="profile-dropdown-item">
                    Sign Up
                  </button>
                </>
              )}

              {loggedIn && (
                <>
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avatar">
                      {userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="profile-dropdown-name">{userName}</div>
                      <div className="profile-dropdown-role">
                        NRSC Researcher
                      </div>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <button className="profile-dropdown-item">
                    My Profile
                  </button>

                  <button className="profile-dropdown-item">
                    Settings
                  </button>

                  <div className="profile-dropdown-divider" />

                  <button
                    className="profile-dropdown-item danger"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
