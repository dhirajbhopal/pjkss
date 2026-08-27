import axios from "axios";
import "./style.css";
import React, {useState,useEffect,} from "react";
import {BrowserRouter,Routes,Route,} from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import Login from "./Login";
import Logout from "./Logout";
import Contact from "./Contact";
import About from "./About";
import Donation from "./Donation";
import Donationqr from "./Donationqr";
import Updateimage from "./Updateimage";
import PasswordReset from "./PasswordReset";
import ResetPasswordConfirm from "./ResetPasswordConfirm";
import ChangePassword from "./ChangePassword";
import Signup from "./Signup";
import Profile from "./Profile";
import Donationlist from "./Donationlist";
import Serialnoadd from "./Serialnoadd";
import Searchnoserial from "./Searchnoserial";
import Serialnoedit from "./Serialnoedit";
import Serialnoall from "./Serialnoall";
import GalleryA from "./GalleryA";
import GalleryB from "./GalleryB";
import GalleryC from "./GalleryC";
import Vision from "./Vision";
import Nopage from "./Nopage";
axios.defaults.withCredentials = true;

function App() {

  // USER STATE
  const [user, setUser] =
    useState(null);

  // LOGIN STATE
  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = useState(false);

  // LOAD USER FROM LOCAL STORAGE
  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    const auth =
      localStorage.getItem(
        "isAuthenticated"
      );

    if (
      savedUser &&
      auth === "true"
    ) {

      setUser(
        JSON.parse(savedUser)
      );

      setIsAuthenticated(true);

    }

  }, []);

 

  return (

    <BrowserRouter>

      <Routes>

        {/* MAIN LAYOUT */}

        <Route
          path="/"
          element={
            <Layout
              user={user}
              isAuthenticated={
                isAuthenticated
              }
            />
          }
        >

          {/* HOME */}

          <Route
            index
            element={<Home />}
          />

          {/* LOGIN */}

          <Route
            path="login"
            element={
              <Login
                setUser={setUser}
                setIsAuthenticated={
                  setIsAuthenticated
                }
              />
            }
          />

          {/* LOGOUT */}

          <Route
            path="logout"
            element={<Logout />}
          />

          {/* CONTACT */}

          <Route
            path="contact"
            element={<Contact />}
          />

          {/* ABOUT */}

          <Route
            path="about"
            element={<About />}
          />

          <Route
            path="donation"
            element={<Donation />}
          />

          <Route
            path="donationqr"
            element={<Donationqr />}
          />
          <Route
            path="updateimage"
            element={<Updateimage />}
          />

          <Route
            path="passwordReset"
            element={<PasswordReset />}
          />

          <Route
            path="changepassword"
            element={<ChangePassword />}
          />

          <Route
            path="reset-password/:uid/:token/"
            element={<ResetPasswordConfirm />}
          />

          <Route
            path="signup"
            element={<Signup />}
          />

          <Route
           path="profile/:id"
           element={<Profile />}
           />
            
            <Route
            path="donationlist"
            element={<Donationlist />}
          />

          <Route
            path="addserialno"
            element={<Serialnoadd />}
          />

          <Route
            path="searchserialno"
            element={<Searchnoserial />}
          />

          <Route
            path="editserialno"
            element={<Serialnoedit />}
          />
          <Route
            path="searchserialnoall"
            element={<Serialnoall />}GalleryC
          />

          <Route
            path="gallery1"
            element={<GalleryA />}
          />

          <Route
            path="gallery2"
            element={<GalleryB />}
          />

          <Route
            path="gallery3"
            element={<GalleryC />}
          />

           <Route
            path="vision"
            element={<Vision />}
          />



          {/* 404 PAGE */}
          <Route
            path="*"
            element={<Nopage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>

  );

}

export default App;