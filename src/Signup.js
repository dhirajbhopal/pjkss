import React, { useState, useEffect } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileno: "",
    gender: "",
    address: "",
    otp: "",
    captchaInput: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [passwordStrength, setPasswordStrength] = useState({
    text: "",
    color: "",
  });

  const [generatedCaptcha, setGeneratedCaptcha] = useState("");

  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [emailDisabled, setEmailDisabled] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) setUser(loggedInUser);
  }, []);

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$&@%abcdefghijklmnopqrstuvwxyz0123456789";

    let captcha = "";
    for (let i = 0; i < 5; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }

    setGeneratedCaptcha(captcha);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    let strength = 0;

    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[$@!%*#?&]/.test(password)) strength++;

    if (strength <= 2) {
      setPasswordStrength({ text: "Weak", color: "red" });
    } else if (strength === 3) {
      setPasswordStrength({ text: "Medium", color: "orange" });
    } else {
      setPasswordStrength({ text: "Strong", color: "green" });
    }
  };

  // ================= OTP SEND =================
  const sendOtp = async () => {
    if (otpLoading) return;

    if (!formData.email) {
      alert("Enter email first");
      return;
    }

    setOtpLoading(true);

    try {
      const res = await axios.post(
        "https://pjkss.pythonanywhere.com/sendotp_api/",
        {
          email: formData.email,
        }
      );

      if (res.data.success) {
        setOtpSent(true);
        setEmailDisabled(true);
        setGeneratedOtp(res.data.otp?.toString() || "");

        alert("OTP sent successfully");
      } else {
        alert(res.data.message || "OTP sending failed");
      }
    } catch (err) {
      alert("Server error while sending OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    
    if (formData.gender ==="") {
      alert("Please select gender");
      return false;
    }

    if (!formData.first_name.match(/^[A-Za-z]+$/)) {
      alert("Enter First Name");
      return false;
    }

    if (!formData.last_name.match(/^[A-Za-z]+$/)) {
      alert("Enter Last Name");
      return false;
    }

    if (!formData.email.endsWith("@gmail.com")) {
      alert("Use Gmail only");
      return false;
    }

    if (isNaN(formData.mobileno) || formData.mobileno.length !== 10) {
      alert("Invalid mobile number");
      return false;
    }

    if (formData.password.length < 8) {
      alert("Password too short");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords mismatch");
      return false;
    }

    // OTP validation (frontend)
    if (!otpSent) {
      alert("Please send OTP first");
      return false;
    }

    if (!formData.otp) {
      alert("Enter OTP");
      return false;
    }

    if (formData.otp !== generatedOtp) {
      alert("Invalid OTP");
      return false;
    }

    if (formData.captchaInput !== generatedCaptcha) {
      alert("Captcha incorrect");
      return false;
    }

    

    return true;
  };

  // ================= REGISTER =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registerLoading) return;
    if (!validateForm()) return;

    setRegisterLoading(true);

    try {
      const res = await axios.post(
        "https://pjkss.pythonanywhere.com/signup/",
        {
          ...formData,
          username: formData.username || formData.email,
        }
      );

      setMessage(res.data.message);
      setMessageType("success");

      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileno: "",
        gender: "",
        address: "",
        otp: "",
        captchaInput: "",
      });

      setOtpSent(false);
      setGeneratedOtp("");
      setEmailDisabled(false);
      generateCaptcha();
    } catch (err) {
      setMessage("Registration failed or Email id already registered");
      setMessageType("error");
    } finally {
      setRegisterLoading(false);
    }
  };

  if (user) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="container-fluid justify-content-center py-1">
      <div className="card shadow-lg border-0 rounded-4 w-100">
        
        {/* HEADER */}
        <div
          className="text-white text-center p-1 rounded-top-4"
          style={{ background: "linear-gradient(135deg,#0d6efd,#0dcaf0)" }}
        >
          <h3 className="fw-bold mb-1">Create Account</h3>
        </div>

         <div className="card-body p-3">
            {/* TOP BUTTONS */}
            <div className="d-flex justify-content-between mb-1">
              <button
                onClick={() => window.history.back()}
                className="btn btn-light rounded-pill px-3"
              >
                <img
                  src="/img/animated-icon-backward_2.gif"
                  height="20px"
                  alt="back"
                />{" "}
                Back
              </button>
              <a
                href="/"
                className="text-decoration-none"
                style={{ fontSize: "32px" }}
              >
                🏠
              </a>
            </div>
            </div>

        {/* BODY */}
        <div className="card-body p-1">

          <div style={{ maxWidth: "70%", margin: "0 auto" }}>

            <form onSubmit={handleSubmit}>

              {/* Gender */}
              <div className="text-center mb-2">
                <label className="me-3">
                  <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male
                </label>
                <label>
                  <input type="radio" name="gender" value="Female" onChange={handleChange} /> Female
                </label>
              </div>

              <input
                className="form-control mb-2 p-1"
                name="first_name"
                placeholder="First Name"
                onChange={handleChange}
              />

              <input
                className="form-control mb-2 p-1"
                name="last_name"
                placeholder="Last Name"
                onChange={handleChange}
              />
             
              <input
                className="form-control mb-2 p-1"
                name="email"
                placeholder="Email"
                disabled={emailDisabled}
                onChange={handleChange}
              />
             
              <input
                className="form-control mb-2 p-1"
                name="mobileno"
                placeholder="Mobile Number"
                onChange={handleChange}
              />

              <input
                type="password"
                className="form-control mb-2 p-1"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              /> 

              <input
                type="password"
                className="form-control mb-2 p-1"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
              />

              <small style={{ color: passwordStrength.color, fontWeight: "bold"}}>
                Strength: {passwordStrength.text}
              </small>
            
              {/* OTP */}
              <button
                type="button"
                className="btn btn-outline-primary btn-sm m-2 ms-0 me-0 w-100"
                onClick={sendOtp}
                disabled={otpLoading}
              >
                {otpLoading ? "Sending OTP..." : "Send OTP"}
              </button>
              
              <input
                className="form-control mb-2 p-1"
                name="otp"
                placeholder="Enter OTP"
                onChange={handleChange}
              />
              {/* CAPTCHA */}
              <div
                className="text-center fw-bold mb-2"
                style={{
                  backgroundImage: "url('/images/capback.png')",
                  height: "32px",
                  borderRadius: "8px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  fontSize:"25px",
                  justifyContent: "center",
                  //maxWidth:"150px"
                }}
              >
                {generatedCaptcha}
              </div>
              <button
                type="button"
                className="btn btn-success btn-sm mb-2 w-100"
                onClick={generateCaptcha}
              >
                Refresh Captcha
              </button>

              <input
                className="form-control mb-2 p-1"
                name="captchaInput"
                placeholder="Enter Captcha"
                onChange={handleChange}
              />

              <input
                className="form-control mb-2 p-1"
                name="address"
                placeholder="Address"
                rows="2"
                onChange={handleChange}
              />

              <button
                className="btn w-100 fw-semibold mb-2"
                disabled={registerLoading}
                style={{
                  background: "linear-gradient(135deg,#198754,#20c997)",
                  color: "white",
                  border: "none",
                }}
              >
                {registerLoading ? "Registering..." : "Create Account"}
              </button>

              {message && (
                <div
                  className={`alert mt-3 text-center ${
                    messageType === "success" ? "alert-success" : "alert-danger"
                  }`}
                >
                  {message}
                </div>
              )}

            </form>

          </div>
        </div>
        <span align="center" className="text-success"> <a href="/login"> I have login credentials </a> </span>
      </div>
    </div>
  );
};

export default Signup;