import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import "react-quill/dist/quill.snow.css"; // Import Quill CSS
import ReactQuill from "react-quill"; // Import ReactQuill
import axios from "axios"; // Import axios
import { baseUrl } from "../Urls";
import { useParams } from "react-router-dom"; // For handling dynamic route params
import "./addapi.css";

const UpdateApi = () => {
  const { id } = useParams(); // Get the ID from the URL params
  const [title, setTitle] = useState("");
  const [api, setApi] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [descriptionImage, setDescriptionImage] = useState(null);

  useEffect(() => {
    // Fetch data from backend when component mounts
    const fetchApiDoc = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/docs/${id}`);
        const apiDoc = response.data;
        setTitle(apiDoc.title);
        setApi(apiDoc.link);
        setShortDescription(apiDoc.short_desc);
        setDescription(apiDoc.description);
        // Set other necessary state values, e.g., images
      } catch (error) {
        console.error("Error fetching API document:", error);
        alert("Error fetching data");
      }
    };

    fetchApiDoc();
  }, [id]); // Trigger on component mount or ID change

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Ensure each value is being appended
    formData.append("title", title);
    formData.append("link", api);
    formData.append("short_desc", shortDescription);
    formData.append("description", description);

    // Append files only if they are selected
    if (selectedFile) {
      formData.append("bannerImage", selectedFile);
    }

    try {
      const response = await axios.put(`${baseUrl}/api/docs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API updated successfully:", response.data);
      alert("API updated successfully");
    } catch (error) {
      console.error("Error updating API:", error.response?.data || error.message);
      alert("Failed to update API. Please try again.");
    }
  };

  return (
    <div className="addapi-parent">
      <Dashboard />
      <div className="addapi-form">
        <div className="api-form">
          <h1>Update API</h1>
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
                <label htmlFor="api">Api Link*</label> <br />
                <input
                  id="api"
                  type="text"
                  placeholder="Enter API link"
                  value={api}
                  onChange={(e) => setApi(e.target.value)}
                /> <br />
                <div className="d-flex l text-center">
                  <label className="imagel">Image:</label>
                  <input
                    className="cf"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="d-flex">
                  <label htmlFor="shortDescription">Short Description</label> <br />
                  <input
                    id="shortDescription"
                    type="text"
                    placeholder="Enter short description"
                    className="input2"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  /> <br />
                </div>

                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
            </div>
            <div className="right">
              <div className="b-form">
                <label htmlFor="description" style={{ marginTop: "10px" }}>
                  Description
                </label>
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline", "strike"],
                      [{ header: [1, 2, 3, false] }],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      [{ align: [] }],
                      ["clean"],
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
                    "image",
                    "align",
                  ]}
                  placeholder="Write the blog content here..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateApi;
