
import React, {
  useState,
  useEffect,
} from "react";

import axios from "axios";

import JsBarcode from "jsbarcode";

const SearchSerialNo = () => {

  // USER STATE
  const [user, setUser] =
    useState(null);

  // SERIAL NO
  const [serialno, setSerialno] =
    useState("");

  // SERIAL DATA
  const [serialData, setSerialData] =
    useState([]);

  // MESSAGE
  const [message, setMessage] =
    useState("");

  // LOAD USER
  useEffect(() => {

    const loggedInUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (loggedInUser) {
      setUser(loggedInUser);
    }

  }, []);

  // SEARCH SERIAL
  const handleSearch = async (e) => {

    e.preventDefault();

    if (serialno === "") {

      alert(
        "Please Enter Serial No"
      );

      return;
    }

    try {

      const response =
        await axios.get(
          `https://pjkss.pythonanywhere.com/search_serial_api?serialno=${serialno}`,
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {

        setSerialData(
          response.data.data
        );

        setMessage("");

      } else {

        setMessage(
          response.data.message
        );
      }

    } catch (error) {


      setMessage(
        "Serial not found"
      );
    }
  };

  // GENERATE BARCODE
  const generateBarcode =
    (code) => {

    JsBarcode(
      `#barcode-${code}`,
      code,
      {
        format: "CODE128",
        displayValue: true,
        height: 40,
        width: 1,
      }
    );
  };

  // PRINT DIV
  const printDiv = (id) => {

    const divContents =
      document.getElementById(id)
        .innerHTML;

    const printWindow =
      window.open(
        "",
        "",
        "height=600,width=800"
      );

    printWindow.document.write(`
      <html>
      <head>
        <title>Letter Head</title>
      </head>
      <body style="margin-top:200px; text-align:center;">
        ${divContents}
      </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.print();
  };

  // NOT LOGGED IN
  if (!user) {

    return (
      <h1>
        You are not logged in
      </h1>
    );
  }

  // NO PERMISSION
  if ( user.role !== "Admin" && user.role !== "Coremember" &&  user.role !== "Member") 
  {

    return (
      <h1>
        You Do Not Have permission
        to access this page
      </h1>
    );
  }

  return (

    <div className="container-fluid">

      {/* BACK BUTTON */}
      <button
        className="btn btn-outline-danger m-3"
        onClick={() =>
          window.history.back()
        }
      >
        Go Back
      </button>

      {/* SEARCH FORM */}
      <form onSubmit={handleSearch}>

        <span
          style={{ margin: "20px" }}
        >
          Serial No
        </span>

        <input
          type="text"
          name="serialno"
          value={serialno}
          onChange={(e) =>
            setSerialno(
              e.target.value
            )
          }
          style={{ margin: "10px" }}
        />

        <button
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
            window.location.href =
            "/searchserialnoall"
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

      {/* TABLE */}
      {serialData.map(
        (i, index) => (

        <div key={index}>

          <table
            className="table table-bordered"
            style={{
              border:
                "3px solid green",
            }}
          >

            <thead
              style={{
                backgroundColor:
                  "black",
                color: "white",
                textAlign:
                  "center",
              }}
            >

              <tr>

                <th>Serial No</th>

                <th>
                  Letter Head Person
                  Name
                </th>

                <th>Issue To</th>

                <th>Subject</th>

                <th>Date</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              <tr
                style={{
                  textAlign:
                    "center",
                }}
              >

                <td>

                  <input
                    type="text"
                    value={i.code}
                    disabled
                    style={{
                      backgroundColor:
                        "transparent",
                      border: "none",
                    }}
                  />

                </td>

                <td>
                  {i.issuername}
                </td>

                <td>
                  {i.issuedto}
                </td>

                <td>
                  {i.subject}
                </td>

                <td>
                  {i.issuedate}
                </td>
      { user.role === "Admin" && (
      <>
      <td>
                  <button
                    className="btn btn-success btn-outline-warning"
                    onClick={() =>
                      window.location.href =
                      `/editserialno?serialno=${i.code}`
                    }
                  >
                    Edit
                  </button>
                </td>
                    </>
                  )
                }
                

              </tr>

            </tbody>

          </table>
       { user.role === "Admin" && (
      <>
          {/* BARCODE AREA */}
          <div
            id={`printableArea-${i.code}`}
          >

            <svg
              id={`barcode-${i.code}`}
            ></svg>

          </div>

          {/* BUTTONS */}
          <button
            className="btn btn-success btn-outline-warning m-2"
            onClick={() =>
              printDiv(
                `printableArea-${i.code}`
              )
            }
          >
            Print
          </button>

          <button
            className="btn btn-success btn-outline-warning m-2"
            onClick={() =>
              generateBarcode(
                i.code
              )
            }
          >
            Show Code
          </button>
          </>
            )
            }

        </div>
          

      ))}

    </div>
  );
};

export default SearchSerialNo;