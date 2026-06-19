import React, { useEffect, useState } from "react";

const Donationqr = () => {
  const [qrData, setQrData] = useState(null);

  // LOAD DATA FROM LOCAL STORAGE
  useEffect(() => {
    const storedData = localStorage.getItem("donationData");

    if (storedData) {
      setQrData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="container-fluid mt-1">

      <table
        align="center"
        className="bg-light shadow border border-2 rounded-4"
        style={{
          borderRadius: "25px",
          overflow: "hidden",
          padding: "10px",
        }}
      >
        <tbody>

          {/* QR IMAGE */}
          <tr align="center">
            <td style={{ padding: "5px" }}>

              {qrData?.qr_image_base64 && (
                <img
                  src={`data:image/png;base64,${qrData.qr_image_base64}`}
                  alt="QR Code"
                  height="200px"
                  style={{
                    borderRadius: "15px",
                    border: "2px solid green",
                    padding: "5px",
                    backgroundColor: "white",
                  }}
                />
              )}

            </td>
          </tr>

          {/* TEXT */}
          <tr>
            <td
              style={{
                padding: "20px",
                textAlign: "center",
              }}
            >

              <span
                style={{
                  color: "green",
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                Scan this QR Code with any UPI App and Pay
              </span>

              <br />
              <br />

              <span
                style={{
                  color: "red",
                  fontSize: "16px",
                }}
              >
                Or You can Pay on
                <b> dhirajpatel08@okaxis </b>
                or
                <b> 7869527457 (Dhiraj Patel) </b>
                from G-pay, Phone-Pay and Amazon-Pay UPI
              </span>

              <br />
              <br />

              <span style={{ fontSize: "16px" }}>
                भुगतान हो जाने के बाद Whatsapp Group में नाम और पता के साथ
                भुगतान पर्ची भेजें, ताकि हम आपका अभिलेख (Record) सहेज सकें
              </span>

              <br />
              <br />

              <a
                href="https://chat.whatsapp.com/GlQpIdvAhgG4vyVUo0ZW0N"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "17px",
                  color: "blue",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Patel Smarak Whatsapp Group Link
              </a>

            </td>
          </tr>

          {/* PAY AGAIN BUTTON */}
          <tr>
            <td align="center" style={{ paddingBottom: "20px" }}>

              <button
                style={{
                  color: "green",
                  padding: "10px 25px",
                  fontSize: "18px",
                }}
                className="btn btn-outline-warning rounded-4"
                onClick={() => {
                  window.location.href = "donation";
                }}
              >
                Pay Again
              </button>

            </td>
          </tr>

        </tbody>
      </table>

    </div>
  );
};

export default Donationqr;
