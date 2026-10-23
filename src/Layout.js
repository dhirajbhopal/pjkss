
import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./style.css";
import Footer from "./Footer";

const Layout = ({ user, isAuthenticated, msg }) => {
  const [today, setToday] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const location = useLocation();

  const isAdmin = user?.role === "Admin";
  const isCoremember = user?.role === "Coremember";
  const isMember = user?.role === "Member";

  // LIVE DATE AND TIME
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // CLOSE MENUS AFTER NAVIGATION
  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  // LOGOUT
  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();

      // Clear cookies accessible to JavaScript
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substring(0, eqPos) : cookie;

        document.cookie =
          `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      // Clear Cache Storage
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      }

      // Unregister service workers
      if ("serviceWorker" in navigator) {
        const registrations =
          await navigator.serviceWorker.getRegistrations();

        await Promise.all(
          registrations.map((registration) =>
            registration.unregister()
          )
        );
      }
    } catch (error) {
      console.error("Logout cleanup error:", error);
    } finally {
      window.location.replace("/login");
    }
  };

  // NAVIGATION LINK
  

  return (
    <>
      {/* WEBSITE HEADER */}
      <header className="pjk-header">
        <div className="pjk-header-main">

          {/* LOGO */}
          <Link
            to="/"
            className="pjk-logo-link"
            aria-label="Patel Jan Kalyan Seva Samiti home"
          >
            <img
              className="pjk-logo"
              src="/images/PATEL_LOGO.png"
              alt="Patel Jan Kalyan Seva Samiti Logo"
            />
          </Link>

          {/* ORGANIZATION NAME */}
          <div className="pjk-title-block">
            <div className="pjk-title-en">
              PATEL JAN KALYAN SEVA SAMITI
            </div>

            <div className="pjk-title-hi">
              पटेल जन कल्याण सेवा समिति
            </div>

            <div className="pjk-title-tagline">
              सेवा • सहयोग • समाज कल्याण
            </div>
          </div>

          {/* FOUNDER IMAGE */}
          <a
            href="/images/modnarayanfounder.png"
            target="_blank"
            rel="noreferrer"
            className="pjk-founder-link"
            aria-label="View founder photograph"
          >
            <img
              className=""
              src="/images/modnarayanfounder.png"
              alt="Founder Mod Narayan Singh Patel"
              height="120x"
            />
          </a>
        </div>

        {/* ADDRESS AND LIVE CLOCK */}
        <div className="pjk-info-bar">
          <div className="pjk-address">
            <span className="pjk-info-icon" aria-hidden="true">
              📍
            </span>

            <span>
              Patel Smarak, GT Road Bus Stand, Dehri,
              Ward No. 26, Rohtas, Bihar - 821307
            </span>
            <a
              href="https://maps.app.goo.gl/kPbw4MSsSZuvGFfh7?g_st=awb"
              target="_blank"
              rel="noreferrer"
              className="pjk-direction-link"
            >
              Get Directions ↗
            </a>
          

          <div className="pjk-clock" aria-label="Current date and time">
            <span className="pjk-clock-date">
              {today.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>

            <span className="pjk-clock-divider">|</span>

            <span className="pjk-clock-time">
              {today.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </span>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="pjk-navbar">
        <div className="pjk-navbar-inner">

          {/* HOME */}
          <Link
            to="/"
            className="pjk-home-link"
           onClick={() => setMobileMenuOpen(false)}
          >
            <span aria-hidden="true">⌂</span>
            Home
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="pjk-mobile-toggle"
            aria-label={
              mobileMenuOpen ? "Close navigation" : "Open navigation"
            }
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span>{mobileMenuOpen ? "✕" : "☰"}</span>
            <span>{mobileMenuOpen ? "Close" : "Menu"}</span>
          </button>

          {/* NAVIGATION CONTENT */}
          <div
            className={`pjk-nav-content${
              mobileMenuOpen ? " pjk-nav-content-open" : ""
            }`}
          >
            {/* PUBLIC LINKS */}
            <div className="pjk-public-links">
              <Link className="pjk-nav-link pjk-public-link" to="/contact">
              Contact
              </Link>

              <Link className="pjk-nav-link pjk-public-link" to="/vision">
                Vision
              </Link>

              <Link className="pjk-nav-link pjk-public-link" to="/about">
                About
              </Link>

              <Link
                className="pjk-nav-link pjk-donate-link"
                to="/donation"
              >
                ♥ Donate
              </Link>
            </div>

            {/* AUTHENTICATED USER */}
            {isAuthenticated ? (
              <div className="pjk-account-area">

                {/* USER SUMMARY */}
                <div className="pjk-user-summary">
                  <div className="pjk-user-avatar">
                    {user?.image ? (
                      <img
                        src={`${
                       user.image.startsWith("http")
                    ? user.image
                     : `https://pjkss.pythonanywhere.com/media/${user.image}`
                    }?t=${Date.now()}`}
                        alt="Profile"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>
                        {(user?.first_name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="pjk-user-details">
                    <span className="pjk-welcome">
                      Welcome
                    </span>

                    <strong>
                      {[user?.first_name, user?.last_name]
                        .filter(Boolean)
                        .join(" ") || "Member"}
                    </strong>

                    <span className="pjk-role">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {/* ACCOUNT MENU */}
                <div className="pjk-account-dropdown">
                  <button
                    type="button"
                    className="pjk-account-toggle"
                    aria-expanded={accountMenuOpen}
                    onClick={() =>
                      setAccountMenuOpen((open) => !open)
                    }
                  >
                    Account
                    <span aria-hidden="true">
                      {accountMenuOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  {accountMenuOpen && (
                    <div className="pjk-dropdown-menu">

                      <div className="pjk-dropdown-heading">
                        Account Services
                      </div>

                      <Link
                        className="pjk-dropdown-item"
                        to="/Updateimage"
                      >
                        <span>▣</span> Update Image
                      </Link>

                      <Link
                        className="pjk-dropdown-item"
                        to="/changepassword"
                      >
                        <span>🔒</span> Change Password
                      </Link>

                      <Link
                        className="pjk-dropdown-item"
                        to="/donationlist"
                      >
                        <span>☷</span> Donation List
                      </Link>

                      {/* ADMIN MENU */}
                      {isAdmin && (
                        <>
                          <div className="pjk-dropdown-separator" />

                          <div className="pjk-dropdown-heading">
                            Administration
                          </div>

                          <Link
                            className="pjk-dropdown-item"
                            to="/addserialno"
                          >
                            <span>№</span> Serial Number
                          </Link>

                          <a
                            className="pjk-dropdown-item pjk-admin-console"
                            href="https://pjkss.pythonanywhere.com/admin/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span>⚙</span> Admin Console ↗
                          </a>
                        </>
                      )}

                      {/* CORE MEMBER MENU */}
                      {isCoremember && (
                        <>
                          <div className="pjk-dropdown-separator" />

                          <Link
                            className="pjk-dropdown-item"
                            to="/searchserialno"
                          >
                            <span>⌕</span> Search Serial
                          </Link>
                        </>
                      )}

                      {/* MEMBER MENU */}
                      {isMember && (
                        <>
                          <div className="pjk-dropdown-separator" />

                          <Link
                            className="pjk-dropdown-item"
                            to="/member-dashboard"
                          >
                            <span>▦</span> Member Dashboard
                          </Link>
                        </>
                      )}

                      <div className="pjk-dropdown-separator" />

                      <button
                        type="button"
                        className="pjk-dropdown-item pjk-logout-button"
                        onClick={handleLogout}
                      >
                        <span>↪</span> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* GUEST MENU */
              <div className="pjk-guest-links">
                {msg && (
                  <span className="pjk-login-message">
                    {msg}
                  </span>
                )}

                <Link className="pjk-signup-link" to="/signup">
                  Sign Up
                </Link>

                <Link className="pjk-login-link" to="/login">
                  Member Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="pjk-main-content">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Layout;
