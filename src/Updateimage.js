import React, {
  useRef,
  useState,
  useEffect,
} from "react";

import axios from "axios";

const Updateimage = () => {

  // USER FROM LOCAL STORAGE
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const videoRef = useRef(null);

  const streamRef = useRef(null);

  const [preview, setPreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // OPEN CAMERA
  const openCamera = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
        });

      streamRef.current = stream;

      if (videoRef.current) {

        videoRef.current.srcObject =
          stream;
      }

    } catch (error) {


      alert(
        "Camera access denied"
      );
    }
  };

  // STOP CAMERA
  const stopCamera = () => {

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );
    }
  };

  // CAPTURE IMAGE
  const captureImage = () => {

    if (!videoRef.current) {
      return;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width = 400;

    canvas.height = 300;

    const ctx =
      canvas.getContext("2d");

    ctx.drawImage(
      videoRef.current,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // CONVERT TO FILE
    canvas.toBlob(
      (blob) => {

        const file = new File(
          [blob],
          "camera.png",
          {
            type: "image/png",
          }
        );

        setImageFile(file);

        setPreview(
          URL.createObjectURL(file)
        );

        stopCamera();

      },
      "image/png"
    );
  };

  // FILE SELECT
  const handleFile = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // SAVE IMAGE
  const saveImage = async () => {

    if (!imageFile) {

      alert(
        "Please capture or upload image"
      );

      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "user_id",
        user?.id
      );

      formData.append(
        "image",
        imageFile
      );

      const response =
        await axios.post(
          "https://pjkss.pythonanywhere.com/imageupload/",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
            withCredentials: true,
          }
        );


      if (
        response.data.success
      ) {

        alert(
          "Image Uploaded Successfully"
        );

      } else {

        alert(
          response.data.error
        );
      }

    } catch (error) {


      alert("Server Error");

    } finally {

      setLoading(false);
    }
  };

  // CLEANUP CAMERA
  useEffect(() => {

    return () => {
      stopCamera();
    };

  }, []);

  return (

    <div
      className="container w-100 mt-2"
    >

      <div
        className="container py-1 d-flex justify-content-center"
      >

        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden w-100"
          style={{
            background:
              "#ffffff",
          }}
        >

          {/* HEADER */}
          <div
            className="text-white text-center p-2"
            style={{
              background:
                "linear-gradient(135deg,#0d6efd,#0dcaf0)",
            }}
          >

            <h2
              className="fw-bold mb-1"
            >
              Update Image
            </h2>

            <p className="mb-0">
              Capture or Upload
              your image
            </p>

          </div>

          <div className="container mt-2">

            {/* CAMERA + PREVIEW */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent:
                  "center",
                flexWrap: "wrap",
                alignItems:
                  "flex-start",
              }}
            >

              {/* CAMERA */}
              <div
                className="card p-3 shadow-sm"
                style={{
                  width: "250px",
                  textAlign:
                    "center",
                }}
              >

                <h5>
                  📷 Camera
                </h5>

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    maxHeight:
                      "250px",
                    borderRadius:
                      "12px",
                    background:
                      "#000",
                    objectFit:
                      "cover",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent:
                      "center",
                    marginTop:
                      "10px",
                    flexWrap:
                      "wrap",
                  }}
                >

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={
                      openCamera
                    }
                  >
                    Open Camera
                  </button>

                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={
                      captureImage
                    }
                  >
                    Capture
                  </button>

                </div>

              </div>

              {/* PREVIEW */}
              <div
                className="card p-3 shadow-sm"
                style={{
                  width: "250px",
                  textAlign:
                    "center",
                }}
              >

                <h5>
                  🖼 Preview
                </h5>

                {preview ? (

                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width:
                        "200px",
                      height:
                        "200px",
                      objectFit:
                        "cover",
                      borderRadius:
                        "12px",
                      border:
                        "2px solid #ddd",
                      margin:
                        "auto",
                    }}
                  />

                ) : (

                  <p>
                    No Image Selected
                  </p>

                )}

              </div>

            </div>

            {/* FILE UPLOAD */}
            <div
              className="container card p-3 mt-3 shadow-sm text-center"
              style={{
                maxWidth:
                  "300px",
              }}
            >

              <h5>
                📁 Upload Image
              </h5>

              <input
                type="file"
                accept="image/*"
                className="form-control form-control-sm"
                onChange={
                  handleFile
                }
              />

            </div>

            {/* SAVE BUTTON */}
            <div className="text-center mt-3 mb-4">

              <button
                className="btn btn-success"
                onClick={
                  saveImage
                }
                disabled={
                  loading
                }
              >

                {loading
                  ? "Saving..."
                  : "Save Image"}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Updateimage;