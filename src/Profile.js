import axios from "axios";
import React, { useEffect, useState } from "react";
   // ADD THIS
import { useParams } from "react-router-dom";

const Profile = () => {

  // ADD THIS
  const { id } = useParams();

  // ADD THIS

    // USER STATE
  const [user, setUser] =
    useState(null);
  

  // USER DATA
  const [userData, setUserData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    mobileno: "",
    gender: "",
    address: "",
    image: null,
  });
    
  // MESSAGE
  const [message, setMessage] = useState("");

  // LOADING
  const [loading, setLoading] = useState(true);

  // BUTTON LOADING
  const [buttonLoading, setButtonLoading] =
    useState(false);

  // FETCH PROFILE
  useEffect(() => {

    fetchProfile();

  }, []);

  // GET PROFILE API
  const fetchProfile = async () => {

    try {

      const response = await axios.get(
        "https://pjkss.pythonanywhere.com/profile_api/",
        {
          withCredentials: true,
        }
      );

      

      // SUCCESS
      if (
        response.data.success &&
        response.data.user
      ) {

        setUserData(response.data.user);

      } else {

        setMessage(
          response.data.message ||
          "User Not Logged In"
        );

      }

    } catch (error) {

      setMessage(
        "Failed To Load Profile"
      );

    } finally {

      setLoading(false);

    }

  };

  // HANDLE CHANGE
  const handleChange = (e) => {

    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });

  };

  // UPDATE PROFILE
  const handleSubmit = async (e) => {

    e.preventDefault();

    // BUTTON DISABLE
    setButtonLoading(true);

    setMessage("");

    // VALIDATION
    if (!userData.first_name.trim()) {

      setMessage("First Name Is Required");
      setButtonLoading(false);
      return;

    }

    if (!userData.last_name.trim()) {

      setMessage("Last Name Is Required");
      setButtonLoading(false);
      return;

    }

    if (!userData.mobileno.trim()) {

      setMessage("Mobile Number Is Required");
      setButtonLoading(false);
      return;

    }

    // MOBILE VALIDATION
    if (!/^[0-9]{10}$/.test(userData.mobileno)) {

      setMessage(
        "Mobile Number Must Be 10 Digits"
      );

      setButtonLoading(false);
      return;

    }

    if (!userData.gender.trim()) {

      setMessage("Gender Is Required");
      setButtonLoading(false);
      return;

    }

    if (!userData.address.trim()) {

      setMessage("Address Is Required");
      setButtonLoading(false);
      return;

    }

    try {

      const response = await axios.put(
        "https://pjkss.pythonanywhere.com/update_profile_api/",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );


      if (response.data.success) {

        setMessage(
          "Profile Updated Successfully"
        );

      } else {

        setMessage(
          response.data.message ||
          "Profile Update Failed"
        );

      }

    } catch (error) {

      if (error.response) {

        setMessage(
          error.response.data.message ||
          "Server Error"
        );

      } else {

        setMessage("Server Error");

      }

    } finally {

      // BUTTON ENABLE AGAIN
      setButtonLoading(false);

    }

  };

  // NO PERMISSION
  if (!user) {

    return (
      <h1>
        You are not logged in
      </h1>
    );
  }
  // LOADING SCREEN
  if (loading) {

    return (
      <div className="text-center mt-5">
        <h3>Loading Profile...</h3>
      </div>
    );

  }

  return (
    <>

      <div
        className="container w-75 py-3 d-flex justify-content-center align-items-center"
      >

        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
        >

          {/* HEADER */}
          <div
            className="text-center text-white p-3"
            style={{
              background:
                "linear-gradient(135deg,#d4af37,#ffd700)",
            }}
          >

            <h2 className="fw-bold">
              My Profile
            </h2>

            <p className="mb-0">
              Update your profile information
            </p>

          </div>

          {/* BODY */}
          <div className="card-body p-3">

            {/* PROFILE IMAGE */}
            <div className="text-center mb-3">

              <img
                src={
                  userData?.image
                    ? userData.image.startsWith("http")
                      ? userData.image
                      : `https://pjkss.pythonanywhere.com${userData.image}`
                    : "/image/user.png"
                }
                alt="profile"
                className="rounded-circle shadow"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                }}
              />

            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              {/* FIRST + LAST NAME */}
              <div className="row g-4">

                <div className="col-md-6">

                  <label
                    className="form-label fw-semibold text-success"
                  >
                    First Name
                    <span className="text-danger">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="first_name"
                    className="form-control rounded-3 py-2"
                    value={userData.first_name || ""}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="col-md-6">

                  <label
                    className="form-label fw-semibold text-success"
                  >
                    Last Name
                    <span className="text-danger">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="last_name"
                    className="form-control rounded-3 py-2"
                    value={userData.last_name || ""}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

              {/* EMAIL + USERNAME */}
              <div className="row g-4 mt-1">

                <div className="col-md-6">

                  <label
                    className="form-label fw-semibold text-success"
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    className="form-control rounded-3 py-2"
                    value={userData.email || ""}
                    disabled
                  />

                </div>

                <div className="col-md-6">

                  <label
                    className="form-label fw-semibold text-success"
                  >
                    Username
                  </label>

                  <input
                    type="text"
                    className="form-control rounded-3 py-2"
                    value={userData.username || ""}
                    disabled
                  />

                </div>

              </div>

              {/* MOBILE + GENDER */}
              <div className="row g-4 mt-1">

                <div className="col-md-6">

                  <label
                    className="form-label fw-semibold text-success"
                  >
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    name="mobileno"
                    className="form-control rounded-3 py-2"
                    value={userData.mobileno || ""}
                    onChange={handleChange}
                    maxLength="10"
                    required
                  />

                </div>

                <div className="col-md-6">

                  <label
                    className="form-label fw-semibold text-success"
                  >
                    Gender
                  </label>

                  <select
                    name="gender"
                    className="form-select rounded-3 py-2"
                    value={userData.gender || ""}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                  </select>

                </div>

              </div>

              {/* ADDRESS */}
              <div className="mt-3">

                <label
                  className="form-label fw-semibold text-success"
                >
                  Address
                </label>

                <input
                  name="address"
                  type="text"
                  className="form-control rounded-3"
                  rows="4"
                  value={userData.address || ""}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* BUTTON */}
              <div className="text-center mt-4">

                <button
                  type="submit"
                  disabled={buttonLoading}
                  className="btn btn-success px-5 py-2 rounded-pill fw-bold shadow"
                  style={{
                    background:
                      "linear-gradient(135deg,#198754,#20c997)",
                    border: "none",
                    opacity:
                      buttonLoading
                        ? "0.7"
                        : "1",
                    cursor:
                      buttonLoading
                        ? "not-allowed"
                        : "pointer",
                  }}
                >

                  {buttonLoading
                    ? "Updating...."
                    : "Update Profile"}

                </button>

              </div>

            </form>

            {/* MESSAGE */}
            {message && (

              <div
                className="alert alert-info text-center mt-4 rounded-3"
              >
                {message}
              </div>

            )}

          </div>

        </div>

      </div>

    </>
  );

};

export default Profile;