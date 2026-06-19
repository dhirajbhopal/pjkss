// Gallery3.js

import React from "react";

const Gallery3 = () => {

  // IMAGE ARRAY
  const images = [

    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
    "8.jpeg",
    "9.jpeg",
    "10.jpeg",
    "11.jpeg",
    "12.jpeg",
    "13.jpeg",
    "14.jpeg",
    "15.jpeg",
    "16.jpeg",
    "17.jpeg",
    "18.jpeg",
    "19.jpeg",
    "20.jpeg",
    "21.jpeg",
    "22.jpeg",
    "23.jpeg",
    "24.jpeg",
    "25.jpeg",
    "26.jpeg",
    "27.jpeg",
    "28.jpeg",
    "29.jpeg",
    "30.jpeg",
    "31.jpeg",

  ];

  // VIDEO ARRAY
  const videos = [

    "1.mp4",
    "2.mp4",

  ];

  return (

    <div className="container-fluid py-4">

      {/* MAIN CARD */}
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
      >

        {/* HEADER */}
        <div
          className="text-white text-center p-3"
          style={{
            background:
              "linear-gradient(135deg,#0d6efd,#0dcaf0)",
          }}
        >

          <h2 className="fw-bold mb-1">

            Gallery

          </h2>

          <p className="mb-0">

            Patel Jayanti Celebration

          </p>

        </div>

        {/* BODY */}
        <div className="card-body">

          <h3
            className="text-center mb-4"
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >

            Patel Jayati 31-Oct-2025

          </h3>

          <hr />

          {/* IMAGE GALLERY */}
          <div className="row g-3 justify-content-center">

            {images.map(
              (img, index) => (

              <div
                className="col-lg-3 col-md-4 col-sm-6"
                key={index}
              >

                <a
                  href={`/images/31-Oct-25_Patel_Jyanti/${img}`}
                  target="_blank"
                  rel="noreferrer"
                >

                  <img
                    src={`/images/31-Oct-25_Patel_Jyanti/${img}`}
                    alt={`gallery-${index}`}
                    className="img-fluid rounded-4 shadow-sm"
                    style={{
                      height: "180px",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />

                </a>

              </div>

            ))}

          </div>

          {/* VIDEO GALLERY */}
          <div className="row mt-4 g-4 justify-content-center">

            {videos.map(
              (video, index) => (

              <div
                className="col-lg-4 col-md-6"
                key={index}
              >

                <div className="card border-0 shadow rounded-4 overflow-hidden">

                  <video
                    controls
                    className="w-100"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  >

                    <source
                      src={`/images/31-Oct-25_Patel_Jyanti/${video}`}
                      type="video/mp4"
                    />

                  </video>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Gallery3;