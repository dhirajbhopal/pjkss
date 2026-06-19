import React from "react";

const Gallery1 = () => {

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

  ];

  // VIDEO ARRAY
  const videos = [

    "v1.mp4",
    "v2.mp4",
    "v3.mp4",
    "v4.mp4",

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

            15th August 2025 Celebration

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

            15th August 2025

          </h3>

          <hr />

          {/* IMAGE SECTION */}
          <div className="row g-3 justify-content-center">

            {images.map(
              (img, index) => (

              <div
                className="col-lg-3 col-md-4 col-sm-6"
                key={index}
              >

                <a
                  href={`/images/15-August-25/${img}`}
                  target="_blank"
                  rel="noreferrer"
                >

                  <img
                    src={`/images/15-August-25/${img}`}
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

          {/* VIDEO SECTION */}
          <div className="row mt-4 g-4 justify-content-center">

            {videos.map(
              (video, index) => (

              <div
                className="col-lg-4 col-md-6"
                key={index}
              >

                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">

                  <video
                    controls
                    className="w-100"
                    style={{
                      height: "250px",
                      objectFit: "cover",
                    }}
                  >

                    <source
                      src={`/videos/15-August-25/${video}`}
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

export default Gallery1;