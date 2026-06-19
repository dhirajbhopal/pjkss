import React from "react";

const Gallery2 = () => {

  // IMAGE ARRAY
  const images = [

    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "10.jpg",
    "11.jpg",
    "12.jpg",
    "13.jpg",
    "14.jpg",
    "15.jpg",
    "16.jpg",
    "17.jpg",
    "18.jpg",
    "19.jpg",
    "20.jpg",
    "21.jpg",
    "22.jpg",
    "23.jpg",
    "24.jpg",

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

            31 Jan 2025 Brahman Bhoj

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

            31-Jan-2025

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
                  href={`/images/31jan_BrahmanBhoj/${img}`}
                  target="_blank"
                  rel="noreferrer"
                >

                  <img
                    src={`/images/31jan_BrahmanBhoj/${img}`}
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

        </div>

      </div>

    </div>
  );
};

export default Gallery2;