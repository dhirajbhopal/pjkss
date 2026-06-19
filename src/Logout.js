// src/Logout.js

import React, { useEffect } from "react";

const Logout = () => {


  useEffect(() => {

    // REMOVE LOGIN DATA
    localStorage.removeItem("user");

    localStorage.removeItem("isAuthenticated");

    // OPTIONAL
    localStorage.clear();
    localStorage.clear();

    // REDIRECT TO LOGIN
    window.location.href = "/login";

  }, []);

  return (

    <div
      className="container text-center mt-5"
    >

      <div
        className="card shadow p-5"
      >

        <h2
          style={{ color: "red" }}
        >
          Logging Out...
        </h2>

        <p>
          Please wait
        </p>

      </div>

    </div>

  );

};

export default Logout;