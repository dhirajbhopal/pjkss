import React, { useState, useEffect } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";

const SearchSerialNo = () => {
  // USER STATE
  const [user, setUser] = useState(null);

  // SERIAL NO
  const [serialno, setSerialno] = useState("");

  // SERIAL DATA
  const [serialData, setSerialData] = useState([]);

  // MESSAGE
  const [message, setMessage] = useState("");

  // LOAD USER
  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (loggedInUser) {
        setUser(loggedInUser);
      }
    } catch (error) {
      console.error("Unable to load user:", error);
    }
  }, []);

  // SEARCH SERIAL
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!serialno.trim()) {
      alert("Please Enter Serial No");
      return;
    }

    try {
      const response = await axios.get(
        `https://pjkss.pythonanywhere.com/search_serial_api?serialno=${encodeURIComponent(
          serialno.trim()
        )}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSerialData(response.data.data || []);
        setMessage("");
      } else {
        setSerialData([]);
        setMessage(
          response.data.message || "Serial not found"
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      setSerialData([]);
      setMessage("Serial not found");
    }
  };

  // GENERATE SMALL BARCODE
  const generateBarcode = (code) => {
    try {
      JsBarcode(`#barcode-${code}`, code, {
        format: "CODE128",
        displayValue: true,
        height: 25,
        width: 1.3,
        margin: 0,
        fontSize: 15,
        textMargin: 2,
        fontStyle: "normal",
      });
    } catch (error) {
      console.error("Barcode generation error:", error);
      alert("Unable to generate barcode");
    }
  };

  // PRINT A4 AREA
  const printDiv = (id) => {
    const printableArea = document.getElementById(id);

    if (!printableArea) {
      alert("Printable area not found");
      return;
    }

    const barcode = printableArea.querySelector("svg");

    if (!barcode || !barcode.innerHTML.trim()) {
      alert("Please click Show Code before printing.");
      return;
    }

    const printWindow = window.open(
      "",
      "",
      "width=794,height=1123"
    );

    if (!printWindow) {
      alert("Please allow pop-ups to print.");
      return;
    }

    const divContents = printableArea.innerHTML;

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Letter Number</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              color: #000;
            }

            .print-container {
              width: 100%;
              margin: 0;
              padding: 0;
              text-align: left;
            }

            .letter-head {
              display: block;
              width: 100%;
              height: auto;
              margin: 0;
              padding: 0;
            }

            .barcode-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 8px;
              width: 100%;
              margin-top: 5px;
              font-size: 10px;
            }

            .letter-number,
            .letter-date {
              flex: 0 0 auto;
              white-space: nowrap;
              font-size: 10px;
            }

            .barcode-box {
              flex: 0 1 auto;
              min-width: 0;
              text-align: left;
            }

            .barcode-box svg {
              display: block;
              width: auto;
              max-width: 100%;
              height: auto;
              margin: 0;
            }

            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>

        <body>
          <div class="print-container">
            ${divContents}
          </div>

          <script>
            const logo = document.querySelector(".letter-head");

            function startPrint() {
              window.focus();
              window.print();
            }

            if (logo && !logo.complete) {
              logo.onload = startPrint;
              logo.onerror = startPrint;
            } else {
              window.onload = startPrint;
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // NOT LOGGED IN
  if (!user) {
    return <h1>You are not logged in</h1>;
  }

  // NO PERMISSION
  if (
    user.role !== "Admin" &&
    user.role !== "Coremember" &&
    user.role !== "Member"
  ) {
    return (
      <h1>
        You Do Not Have permission to access this page
      </h1>
    );
  }

  return (
    <div className="container-fluid">
      {/* BACK BUTTON */}
      <button
        className="btn btn-outline-danger m-3"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>

      {/* SEARCH FORM */}
      <form onSubmit={handleSearch}>
        <span style={{ margin: "20px" }}>
          Serial No
        </span>

        <input
          type="text"
          name="serialno"
          value={serialno}
          onChange={(e) => setSerialno(e.target.value)}
          style={{ margin: "10px" }}
        />

        <button
          type="submit"
          className="btn btn-info btn-outline-danger"
          style={{
            color: "black",
            fontSize: "15px",
          }}
        >
          Search
        </button>

        <button
          type="button"
          className="btn btn-outline-danger m-3"
          style={{
            color: "black",
            fontSize: "15px",
          }}
          onClick={() =>
            (window.location.href = "/searchserialnoall")
          }
        >
          View All
        </button>
      </form>

      {/* MESSAGE */}
      {message && (
        <div className="alert alert-danger mt-3">
          {message}
        </div>
      )}

      {/* SEARCH RESULTS */}
      {serialData.map((i, index) => (
        <div key={i.code || index}>
          {/* DATA TABLE */}
          <table
            className="table table-bordered"
            style={{
              border: "3px solid green",
            }}
          >
            <thead
              style={{
                backgroundColor: "black",
                color: "white",
                textAlign: "center",
              }}
            >
              <tr>
                <th>Serial No</th>
                <th>Letter Head Person Name</th>
                <th>Issue To</th>
                <th>Subject</th>
                <th>Date</th>
                {user.role === "Admin" && (
                  <th>Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              <tr style={{ textAlign: "center" }}>
                <td>
                  <input
                    type="text"
                    value={i.code || ""}
                    readOnly
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      width: "100%",
                    }}
                  />
                </td>

                <td>{i.issuername}</td>
                <td>{i.issuedto}</td>
                <td>{i.subject}</td>
                <td>{i.issuedate}</td>

                {user.role === "Admin" && (
                  <td>
                    <button
                      className="btn btn-success btn-outline-warning"
                      onClick={() =>
                        (window.location.href =
                          `/editserialno?serialno=${encodeURIComponent(
                            i.code
                          )}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            </tbody>
          </table>

          {/* PRINTABLE AREA - ADMIN ONLY */}
          {user.role === "Admin" && (
            <>
              <div
                id={`printableArea-${i.code}`}
                style={{
                  padding: "0px",
                  margin: "0px",
                  textAlign: "left",
                }}
              >
                {/* LETTER HEAD IMAGE */}
                <img
                  className="letter-head"
                  src="/images/Letter_Head.png"
                  alt="Letter Head"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    margin: "0",
                    padding: "0",
                  }}
                />

                {/* LETTER NUMBER + BARCODE + DATE */}
                <div
                  className="barcode-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    width: "100%",
                    marginTop: "5px",
                    fontSize: "10px",
                  }}
                >
                  {/* LEFT: LETTER NUMBER */}
                  <div
                    className="letter-number"
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "15px",
                      margin:"10px",
                    }}
                  >
                   पत्रांक संख्या:
                  

                  {/* CENTER: BARCODE */}
                 
                    <svg
                      id={`barcode-${i.code}`}
                      style={{
                        display: "block",
                        width: "auto",
                        height: "auto",
                        margin: "0",
                      }}
                    />
                  </div>

                  {/* RIGHT: DATE */}
                  <div
                    className="letter-date"
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "12px",
                      margin:"5px"
                    }}
                  >
                    तारीख:………/………/………
                  </div>
                </div>
              </div>

              {/* PRINT BUTTON */}
              <button
                type="button"
                className="btn btn-success btn-outline-warning m-2"
                onClick={() =>
                  printDiv(`printableArea-${i.code}`)
                }
              >
                Print A4
              </button>

              {/* SHOW BARCODE BUTTON */}
              <button
                type="button"
                className="btn btn-success btn-outline-warning m-2"
                onClick={() => generateBarcode(i.code)}
              >
                Show Code
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchSerialNo;