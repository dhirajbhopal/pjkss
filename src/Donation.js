import React, { useState } from "react";
import axios from "axios";

const Donation = () => {
  const [amount, setAmount] = useState("10000");
  const [loading, setLoading] = useState(false);

  // VALIDATION
  const validation = () => {
    if (amount === "") {
      alert("Please enter Amount");
      return false;
    }

    if (parseFloat(amount) <= 0.9) {
      alert("Please Enter Amount more than Rs 1");
      return false;
    }

    if (isNaN(amount)) {
      alert("Enter Numeric value");
      setAmount("");
      return false;
    }

    return true;
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    try {
      setLoading(true);

      // DJANGO API URL
      const response = await axios.post(
        "https://pjkss.pythonanywhere.com/donationdetail/",
        {
          amount: amount,
        }
      );


      // SAVE API DATA
      localStorage.setItem(
        "donationData",
        JSON.stringify(response.data)
      );

      // REDIRECT
      window.location.href = "/donationqr";

    } catch (error) {
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <div
        className="container w-75 py-1 d-flex justify-content-center align-items-center">

        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{
           // width: "100%",
          }}
        >

          {/* HEADER */}
          <div
            className="text-center text-white p-3"
            style={{
              background:
                "linear-gradient(135deg,#ff1493,#ff69b4)",
            }}
          >

            <h2 className="fw-bold mb-1">
              DONATION
            </h2>

            <p className="mb-0">
              पटेल जी की मूर्ति स्थापना हेतु अपना सहयोग प्रदान करें।
            </p>

          </div>
          <form onSubmit={handleSubmit}>

        <table
          id="generatePdf"
          align="center"
          className="bg-light shadow border border-2 rounded-4"
          style={{
            borderRadius: "25px",
            overflow: "hidden",
            padding: "20px",
          }}
        >
          <tbody>

            <tr>
              <td
                colSpan="3"
                style={{
                  color: "green",
                  padding: "10px",
                  fontSize: "30px",
                  fontWeight: "bolder",
                  textAlign: "center",
                }}
              >
                Please Enter Amount
              </td>
            </tr>

            <tr>
              <td
                style={{
                  paddingLeft: "10px",
                  fontSize: "20px",
                  fontWeight: "bolder",
                }}
              >
                Amount in Rs.
              </td>

              <td style={{ padding: "10px" }}>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  min="1"
                  name="amount"
                  style={{
                    border: "solid red 2px",
                    fontSize: "20px",
                    borderRadius: "10px",
                    width: "100%",
                    padding: "10px",
                  }}
                />
              </td>
            </tr>

            <tr>
              <td
                colSpan="3"
                align="center"
                style={{
                  paddingLeft: "10px",
                  fontSize: "20px",
                  fontWeight: "bolder",
                }}
              >
                <input
                  className="btn btn-outline-danger rounded-4"
                  style={{
                    margin: "10px",
                    padding: "10px 25px",
                  }}
                  type="submit"
                  value={
                    loading
                      ? "Processing..."
                      : "Pay Now"
                  }
                />
              </td>
            </tr>

          </tbody>
        </table>

      </form>
          </div>
          </div>
    </>
  );
};

export default Donation;