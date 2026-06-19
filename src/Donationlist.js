import React, { useEffect, useState } from "react";
import axios from "axios";

const DonationDetail = () => {

  // DONATION DATA
  const [donationdetails, setDonationdetails] =
    useState([]);

  // SEARCH
  const [search, setSearch] =
    useState("");

  // TOTAL AMOUNT
  const [totalAmount, setTotalAmount] =
    useState(0);

  // MESSAGE
  const [message, setMessage] =
    useState("");

  // LOADING
  const [loading, setLoading] =
    useState(true);

  // FETCH DATA
  useEffect(() => {

    fetchDonationData();

  }, []);

// USER STATE
  const [user, setUser] =
    useState(null);

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

  // API CALL
  const fetchDonationData = async () => {

    try {

      const response = await axios.get(
        "https://pjkss.pythonanywhere.com/donation_list_api/",
        {
          withCredentials: true,
        }
      );


      if (response.data.success) {

        setDonationdetails(
          response.data.data
        );

        setTotalAmount(
          response.data.total_amount
        );

      } else {

        setMessage(
          response.data.message
        );

      }

    } catch (error) {


      setMessage(
        "Failed To Load Data"
      );

    } finally {

      setLoading(false);

    }

  };


  // NOT LOGGED IN
  if (!user) {

    return (
      <h1>
        You are not logged in
      </h1>
    );
  }

  // SEARCH FILTER
  const filteredData =
    donationdetails.filter((item) => {

      const fullname =
        `${item.name} ${item.lastname}`;

      return fullname
        .toLowerCase()
        .includes(search.toLowerCase());

    });

  // DOWNLOAD CSV
  const downloadCSV = () => {

    let csv =
      "Name,Address,Amount\n";

    filteredData.forEach((item) => {

      csv +=
        `${item.name} ${item.lastname},${item.address},${item.Amount}\n`;

    });

    csv +=
      `Total Amount,,${totalAmount}`;

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const link =
      document.createElement("a");

    const url =
      URL.createObjectURL(blob);

    link.setAttribute("href", url);

    link.setAttribute(
      "download",
      "Donation_Detail.csv"
    );

    link.style.visibility = "hidden";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };

  // LOADING
  if (loading) {

    return (
      <div className="text-center mt-5">
        <h3>Loading Donation Data...</h3>
      </div>
    );

  }

  return (
    <>

      <div className="container mt-4">

        {/* SEARCH BOX */}
        <input
          type="text"
          placeholder="Search Name..."
          className="form-control mb-3"
          style={{
            width: "40%",
            borderRadius: "10px",
          }}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* TABLE */}
        <div className="table-responsive">

          <table
            className="table table-bordered text-center"
            style={{
              border: "3px solid green",
            }}
          >

            <thead
              style={{
                backgroundColor: "black",
                color: "white",
              }}
            >

              <tr>

                <th>Name</th>

                <th>Address</th>

                <th>Amount</th>

              </tr>

            </thead>

            <tbody>

              {filteredData.length > 0 ? (

                filteredData.map((item, index) => (

                  <tr
                    key={index}
                  >

                    <td>
                      {item.name}{" "}
                      {item.lastname}
                    </td>

                    <td>
                      {item.address}
                    </td>

                    <td>
                      {item.Amount}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="3"
                  >
                    No Data Found
                  </td>

                </tr>

              )}

              {/* TOTAL */}
              <tr>

                <td
                  colSpan="2"
                  style={{
                    color: "red",
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}
                >
                  Total Amount
                </td>

                <td
                  style={{
                    color: "red",
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}
                >
                  {totalAmount}
                </td>

              </tr>

            </tbody>

          </table>

        </div>

        {/* DOWNLOAD BUTTON */}
        <button
          onClick={downloadCSV}
          className="btn btn-success"
        >
          Download Excel Sheet
        </button>

        {/* MESSAGE */}
        {message && (

          <div
            className="alert alert-danger mt-3"
          >
            {message}
          </div>

        )}

      </div>

    </>
  );

};

export default DonationDetail;