// SearchSerialNo.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import JsBarcode from "jsbarcode";

const SearchSerialNo = () => {
  // USER STATE
  const [user, setUser] = useState(null);

  // SERIAL NUMBER
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

  // SEARCH SERIAL NUMBER
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!serialno.trim()) {
      alert("Please Enter Serial No");
      return;
    }

    try {
      setMessage("");

      const response = await axios.get(
        `https://pjkss.pythonanywhere.com/search_serial_api?serialno=${encodeURIComponent(
          serialno.trim()
        )}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const data = response.data.data || [];

        setSerialData(data);
        setMessage(
          data.length === 0 ? "Serial not found" : ""
        );
      } else {
        setSerialData([]);
        setMessage(
          response.data.message || "Serial not found"
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      setSerialData([]);
      setMessage("Unable to search serial number");
    }
  };

  // GENERATE BARCODE
  const generateBarcode = (code) => {
    try {
      const svg = document.getElementById(
        `barcode-${code}`
      );

      if (!svg) {
        alert("Barcode area not found");
        return;
      }

      JsBarcode(svg, String(code), {
        format: "CODE128",
        displayValue: true,
        height: 25,
        width: 1.3,
        margin: 0,
        fontSize: 12,
        textMargin: 2,
        font: "Arial",
        fontOptions: "",
        textAlign: "center",
        lineColor: "#000000",
        background: "#ffffff",
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

    if (
      !barcode ||
      !barcode.querySelector("rect, path")
    ) {
      alert("Please click Show Code before printing.");
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Letter Number</title>

          <style>
            @page {
              size: A4 portrait;
              margin: 5mm;
            }

            * {
              box-sizing: border-box;
              font-family: Arial, sans-serif !important;
              font-weight: 400 !important;
              font-style: normal !important;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              color: #000;
              background: #fff;
              font-size: 12px;
              font-weight: 400;
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
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              gap: 12px;
              width: 100%;
              margin-top: 5px;
              text-align: left;
              font-size: 12px;
              font-weight: 400;
            }

            .letter-number {
              flex: 0 0 auto;
              white-space: nowrap;
              margin: 0;
              font-size: 12px;
              font-weight: 400;
            }

            .barcode-box {
              flex: 0 1 auto;
              min-width: 0;
              text-align: left;
              margin: 0;
              padding: 0;
            }

            .barcode-box svg {
              display: block;
              width: auto;
              max-width: 100%;
              height: auto;
              margin: 0;
            }

            .letter-date {
              flex: 0 0 auto;
              white-space: nowrap;
              margin-left: auto;
              font-size: 12px;
              font-weight: 400;
            }

            @media print {
              html,
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              .letter-head {
                max-width: 100%;
              }
            }
          </style>
        </head>

        <body>
          <div class="print-container">
            ${divContents}
          </div>

          <script>
            function startPrint() {
              window.focus();
              window.print();
            }

            const logo = document.querySelector(".letter-head");

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

  // LOADING / NOT LOGGED IN
  if (!user) {
    return <h1>You are not logged in</h1>;
  }

  // ROLE PERMISSION
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
    <div className="container-fluid p-2 p-md-3">

      {/* BACK BUTTON */}
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>

      {/* SEARCH FORM */}
      <form
        onSubmit={handleSearch}
        className="d-flex flex-wrap align-items-center gap-2 mb-3"
      >
        <label
          htmlFor="serialno"
          className="form-label mb-0"
        >
          Serial No
        </label>

        <input
          id="serialno"
          type="text"
          name="serialno"
          value={serialno}
          onChange={(e) => setSerialno(e.target.value)}
          className="form-control"
          style={{
            width: "250px",
            maxWidth: "100%",
          }}
          placeholder="Enter Serial No"
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
          className="btn btn-outline-danger"
          style={{
            color: "black",
            fontSize: "15px",
          }}
          onClick={() => {
            window.location.href = "/searchserialnoall";
          }}
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
        <div key={i.code || index} className="mb-4">

          {/* RESPONSIVE DATA TABLE */}
          <div
            className="table-responsive"
            style={{
              width: "100%",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              border: "3px solid green",
            }}
          >
            <table
              className="table table-bordered mb-0"
              style={{
                width: "100%",
                minWidth: user.role === "Admin"
                  ? "1000px"
                  : "900px",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <colgroup>
                <col style={{ width: "140px" }} />
                <col style={{ width: "220px" }} />
                <col style={{ width: "180px" }} />
                <col style={{ width: "250px" }} />
                <col style={{ width: "120px" }} />
                {user.role === "Admin" && (
                  <col style={{ width: "100px" }} />
                )}
              </colgroup>

              <thead>
                <tr>
                  {[
                    "Serial No",
                    "Letter Head Person Name",
                    "Issue To",
                    "Subject",
                    "Date",
                    ...(user.role === "Admin" ? ["Action"] : []),
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "1px solid red",
                        textAlign: "center",
                        verticalAlign: "middle",
                        padding: "12px 8px",
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        fontWeight: 400,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={cellStyle}>
                    {i.code || "-"}
                  </td>

                  <td style={cellStyle}>
                    {i.issuername || "-"}
                  </td>

                  <td style={cellStyle}>
                    {i.issuedto || "-"}
                  </td>

                  <td style={cellStyle}>
                    {i.subject || "-"}
                  </td>

                  <td style={cellStyle}>
                    {i.issuedate || "-"}
                  </td>

                  {user.role === "Admin" && (
                    <td style={cellStyle}>
                      <button
                        type="button"
                        className="btn btn-success btn-outline-warning"
                        onClick={() => {
                          window.location.href =
                            `/editserialno?serialno=${encodeURIComponent(
                              i.code
                            )}`;
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>

          {/* PRINTABLE AREA - ADMIN ONLY */}
          {user.role === "Admin" && (
            <>
              <div
                id={`printableArea-${i.code}`}
                style={{
                  width: "100%",
                  margin: "0",
                  padding: "0",
                  textAlign: "left",
                }}
              >
                {/* LETTERHEAD IMAGE */}
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
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "12px",
                    width: "100%",
                    marginTop: "5px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: 400,
                  }}
                >
                  {/* LEFT: LETTER NUMBER */}
                  <div
                    className="letter-number"
                    style={{
                      flex: "0 0 auto",
                      whiteSpace: "nowrap",
                      fontSize: "12px",
                      fontWeight: 400,
                      margin: 10,
                    }}
                  >
                    पत्रांक संख्या:
                  </div>

                  {/* BARCODE */}
                  <div
                    className="barcode-box"
                    style={{
                      flex: "0 1 auto",
                      minWidth: 0,
                      textAlign: "left",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <svg
                      id={`barcode-${i.code}`}
                      style={{
                        display: "block",
                        width: "auto",
                        maxWidth: "100%",
                        height: "auto",
                        margin: 0,
                      }}
                    />
                  </div>

                  {/* RIGHT: DATE */}
                  <div
                    className="letter-date"
                    style={{
                      flex: "0 0 auto",
                      whiteSpace: "nowrap",
                      fontSize: "12px",
                      fontWeight: 400,
                      marginLeft: "auto",
                    }}
                  >
                    तारीख:………/………/……………
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

// COMMON TABLE CELL STYLE
const cellStyle = {
  border: "1px solid red",
  padding: "10px 8px",
  textAlign: "center",
  verticalAlign: "middle",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "normal",
};

export default SearchSerialNo;