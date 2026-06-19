import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "./style.css";
import Footer from "./Footer";
//import logo from "/images/PATEL_LOGO.png";
//import founderImg from "/images/modnarayanfounder.png";
//import arrowGif from "/img/Arrows_down_animated.gif";

const Layout = ({ user, isAuthenticated, msg }) => {


const handleLogout = async () => {

  try {

    // LOCAL STORAGE
    localStorage.clear();

    // SESSION STORAGE
    sessionStorage.clear();

    // CLEAR COOKIES
    document.cookie.split(";").forEach((cookie) => {

      const eqPos = cookie.indexOf("=");

      const name =
        eqPos > -1
          ? cookie.substr(0, eqPos)
          : cookie;

      document.cookie =
        name +
        "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";

    });

    // CLEAR CACHE STORAGE
    if ("caches" in window) {

      const cacheNames =
        await caches.keys();

      await Promise.all(
        cacheNames.map((cacheName) =>
          caches.delete(cacheName)
        )
      );

    }

    // REMOVE SERVICE WORKERS
    if ("serviceWorker" in navigator) {

      const registrations =
        await navigator.serviceWorker.getRegistrations();

      for (let registration of registrations) {

        await registration.unregister();

      }

    }

    // FORCE HARD RELOAD
    window.location.replace("/login");

  } catch (error) {

  }

};

///////////////////

 // LIVE DATE TIME
  const [today, setToday] = useState(
    new Date()
  );

  // LIVE CLOCK
  useEffect(() => {

    const interval = setInterval(() => {

      setToday(new Date());

    }, 1000);

    return () => clearInterval(interval);

  }, []);


  // ROLE CHECK
  const isAdmin =
    user?.role === "Admin";

  const isCoremember =
    user?.role === "Coremember";

  const isMember =
    user?.role === "Member";


  return (
    <>
      <div>

        {/* TOP HEADER */}
        <div
          className="d-flex"
          style={{ backgroundColor: "#f6f7c1" }}
        >

          <div
            className="flex-fill"
            style={{ marginLeft: "1%" }}
          >

            <Link to="/">
              <img className="mt-1"
                src="/images/PATEL_LOGO.png"
                height="100px"
                alt="Logo"

              />
            </Link>

          </div>

          <div className="flex-fill text-center">

            <span
              style={{
                fontSize: "30px",
                color: "green",
                fontFamily: "serif",
                fontWeight: "bolder",
              }}
            >
              PATEL JAN KALYAN SEVA SAMITI
              <br />
              पटेल जन कल्याण सेवा समिति
            </span>

          </div>

          <div
            className="flex-fill text-end"
            style={{ marginRight: "1%" }}
          >

            <a
              href="/images/modnarayanfounder.png"
              target="_blank"
              rel="noreferrer"
            >

              <img
                src="/images/modnarayanfounder.png"
                height="105px"
                alt="Founder"
              />

            </a>

          </div>

        </div>

        {/* ADDRESS */}
        <div
          className="text-center"
          style={{ backgroundColor: "#f6f7c1" }}
        >

          <span
            style={{
              fontSize: "15px",
              color: "blue",
            }}
          >

            Add:- AT Patel Asmarak, GT Road Bus Stand Dehri,
            Ward No-26 Dist-Rohtas, Bihar (821307)

            <a
              href="https://maps.app.goo.gl/kPbw4MSsSZuvGFfh7?g_st=awb"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "red",
                marginLeft: "5px",
              }}
            >
              Direction
            </a>

          </span>
          {/* DATE TIME */}
        <span
          style={{
            fontSize: "15px",
            fontWeight: "bold",
            color: "red",
          }}>

        &nbsp;&nbsp;
       {today.toDateString()}

      &nbsp;&nbsp;&nbsp;

       {today.toLocaleTimeString([], {hour: "2-digit",minute: "2-digit",second: "2-digit",hour12: true,})}

    </span>


        </div>

        {/* NAVBAR */}
        <nav
          className="navbar navbar-expand-sm navbar-light bg-light"
        >

          <div className="container-fluid">

            <Link
              to="/" style={{fontSize:"15px", marginBottom:"0"}}
              className="navbar-brand"
            >
              🏠 Home
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
            >

              <img
                src={"/img/Arrows_down_animated.gif"}
                height="20px"
                alt="menu"
              />

            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >

              <ul className="navbar-nav me-auto">

                {/* PUBLIC MENU */}

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/contact" >
                    Contact
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/vision"
                  >
                    Vision
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/about"
                  >
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="https://webmail.pjkss.com/" target="blank"
                  >
                    Email
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link text-success"
                    to="/donation"
                  >
                  Donate
                  </Link>
                </li>

                {/* AUTH USER */}

                {isAuthenticated ? (
                  <>

                    {/* USER INFO */}

                    <li className="nav-item">

                      <span
                        className="nav-link"
                        style={{
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >

                        Welcome :
                        {" "}
                        {user?.first_name}
                        {" "}
                        {user?.last_name}

                      </span>

                    </li>

                    <li className="nav-item">

                      <span
                        className="nav-link"
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                        }}
                      >

                        Role :
                        {" "}
                        {user?.role}

                      </span>

                    </li>

                    {/* DROPDOWN */}

                    <li className="nav-item dropdown">

                      <a
                        href="/#"
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                      >
                        Menu
                      </a>

                      <ul className="dropdown-menu">

                        {/* COMMON MENU */}

                      {/*  <li>
                          <Link
                            className="dropdown-item"
                            to="/profile/:id"
                          >
                            Update Profile
                          </Link>
                        </li>  */}

                        <li>
                          <Link
                            className="dropdown-item"
                            to="/Updateimage"
                          >
                            Update Image
                          </Link>
                        </li>

                        <li>
                          <Link
                            className="dropdown-item"
                            to="/changepassword"
                          >
                            Change Password
                          </Link>
                        </li>

                        <li>
                          <Link
                            className="dropdown-item"
                            to="/donationlist"
                          >
                            Donation List
                          </Link>
                        </li>

                        {/* ADMIN MENU */}

                        {isAdmin && (
                          <>

                            <li>
                              <hr className="dropdown-divider" />
                            </li>

                            <li>
                              <Link
                                className="dropdown-item"
                                to="/addserialno"
                              >
                                Serial No
                              </Link>
                            </li>

                            <li>
                            </li>

                            <li>
                              <a
                                className="dropdown-item text-danger"
                                href="https://pjkss.pythonanywhere.com/admin/"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Admin Console
                              </a>
                            </li>

                          </>
                        )}

                        {/* MANAGER MENU */}

                        {isCoremember && (
                          <>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>

                            <li>
                              <Link
                                className="dropdown-item"
                                to="/searchserialno"
                              >
                                Search Serial
                              </Link>
                            </li>
                          </>
                        )}

                        {/* MEMBER MENU */}

                        {isMember && (
                          <>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>

                            <li>
                              <Link
                                className="dropdown-item"
                                to="/member-dashboard"
                              >
                                Member Dashboard
                              </Link>
                            </li>
                          </>
                        )}

                        {/* LOGOUT */}

                        <li>
                          <hr className="dropdown-divider" />
                        </li>

                        <li>
                    <Link className="dropdown-item text-danger" to="/logout" 
                    onClick={(e) => {e.preventDefault();handleLogout();}} >
                  Logout
                  </Link>
                  </li>

                      </ul>

                    </li>

                    {/* PROFILE IMAGE */}

                    <li className="nav-item">
                    

                    <img
  src={`https://pjkss.pythonanywhere.com/media/${user?.image}?v=${user?.updated_at}`}
  alt="profile"
  height="40px"
  width="50px"
  className="rounded rounded-3"
  style={{
    objectFit: "cover",
    marginTop: "0",
  }}
/>

          

                    </li>

                  </>
                ) : (
                  <>

                    {/* GUEST MENU */}

                    <li className="nav-item">

                      <Link
                        className="nav-link"
                        to="/signup"
                      >
                        Signup
                      </Link>

                    </li>

                    <li className="nav-item">

                      <Link
                        className="nav-link"
                        to="/login"
                      >
                        Member Login
                      </Link>

                    </li>

                    <li className="nav-item">

                      <span
                        style={{
                          color: "red",
                          marginLeft: "10px",
                        }}
                      >
                        {msg}
                      </span>

                    </li>

                  </>
                )}

              </ul>

            </div>

          </div>

        </nav>

      </div>

      <Outlet />

      <Footer/>

    </>
  );
};

export default Layout;