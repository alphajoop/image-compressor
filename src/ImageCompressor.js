import React, { useState } from "react";
import imageCompression from "browser-image-compression";
import "./ImageCompressor.css";

function ImageCompressor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError(null);
  }

  async function handleCompress() {
    if (!selectedFile) return;

    const isImage = selectedFile.type.startsWith("image/");
    if (!isImage) {
      setError("The selected file is not a valid image.");
      return;
    }

    // Vérifier si la taille du fichier est déjà petite
    const maxSizeMB = 1; // Taille maximale souhaitée pour la compression (1 Mo)
    if (selectedFile.size / 1024 / 1024 <= maxSizeMB) {
      setError("The image is already quite small!");
      return;
    }

    try {
      const options = {
        maxSizeMB,
        maxWidthOrHeight: 800,
      };

      const compressedFile = await imageCompression(selectedFile, options);

      if (compressedFile.size === selectedFile.size) {
        setError("The image is already quite small!");
      } else {
        setCompressedImage(compressedFile);
        setError(null);
      }
    } catch (error) {
      console.error("Error during image compression :", error);
      setError("Something went wrong during the compression!");
    }
  }

  function handleDownload() {
    if (!compressedImage) return;

    const originalFileName = selectedFile.name;

    const downloadLink = URL.createObjectURL(compressedImage);
    const a = document.createElement("a");
    a.href = downloadLink;
    a.download = `compressed_${originalFileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="container-fluid">
      <h3 className="text-center text-uppercase fw-bold">Image Compressor</h3>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-md-12 offset-0">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
          <button
            className="btn btn-primary btn-block mt-3 mb-3"
            onClick={handleCompress}
          >
            compress image
          </button>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {compressedImage && (
            <div className="image-container mt-3">
              <h5 className="text-uppercase">Compressed image</h5>
              <img
                src={URL.createObjectURL(compressedImage)}
                alt="Compressed"
                className="img-thumbnail"
              />
              <button
                className="btn btn-success btn-block mt-3"
                onClick={handleDownload}
              >
                Download compressed image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCompressor;