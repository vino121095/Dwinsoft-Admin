import React, { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import ReactQuill from "react-quill"; // Import ReactQuill
import axios from "axios"; // Import axios
import { baseUrl } from "../Urls";
import "./addapi.css";

const AddApi = () => {
  const [title, setTitle] = useState(""); // State to manage title
  const [link, setLink] = useState(""); // State to manage title
  const [shortDescription, setShortDescription] = useState(""); // State for short description
  const [description, setDescription] = useState(""); // State for description
  const [selectedFile, setSelectedFile] = useState(null); // State for banner image upload
  const [descriptionImage, setDescriptionImage] = useState(null); // State for description image upload

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("link", link);
    formData.append("short_desc", shortDescription);
    formData.append("description", description);

    if (selectedFile) {
      formData.append("bannerImage", selectedFile); // Attach the banner file
    }

    if (descriptionImage) {
      formData.append("descriptionImage", descriptionImage); // Attach the description image
    }

    console.log("Form data to be sent:", {
      title,
      link,
      short_desc: shortDescription,
      description,
      bannerImage: selectedFile,
      descriptionImage,
    });

    try {
      const response = await axios.post(`${baseUrl}/api/docs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API created successfully:", response.data);
      alert("API created successfully");
    } catch (error) {
      console.error("Error submitting API:", error);
      alert("Failed to create API. Please try again.");
    }
  };

  // Handle file changes for image uploads
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleDescriptionImageChange = (e) => setDescriptionImage(e.target.files[0]);

  return (
    <div className="addapi-parent">
      <Dashboard />
      <div className="addapi-form">
        <div className="api-form">
          <h1>Add API</h1>
          <div className="childform">
            <div className="left">
              <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title*</label> <br />
                <input
                  id="title"
                  type="text"
                  placeholder="Enter your title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                /> <br />
                <label htmlFor="title">API link*</label> <br />
                <input
                  id="title"
                  type="text"
                  placeholder="Enter your title"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                /> <br />
                <label htmlFor="shortDescription">Short Description</label> <br />
                <input
                  id="shortDescription"
                  type="text"
                  placeholder="Enter short description"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                /> <br />
                <label className="imagel">Banner Image:</label>
                <input
                  className="cf"
                  type="file"
                  onChange={handleFileChange}
                />
                <br />

                <br />
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
            </div>
            <div className="right">
              <div className="b-form">
                <label htmlFor="description">Description</label>
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline", "strike"], // Formatting options
                      [{ header: [1, 2, 3, false] }], // Heading options
                      [{ list: "ordered" }, { list: "bullet" }], // List options
                      ["link"], // Link option
                      [{ align: [] }], // Alignment options
                      ["clean"], // Remove formatting
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "link",
                    "align",
                  ]}
                  placeholder="Write the blog content here..."
                />
                <div className="d-flex descimage-container">
                  <label htmlFor="descriptionImage">Description Image:</label>
                  <input
                    className="cf"
                    type="file"
                    onChange={handleDescriptionImageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddApi;
