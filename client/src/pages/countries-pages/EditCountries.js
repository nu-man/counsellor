import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material"; // Import MUI components
import ReactQuill from "react-quill"; // React Quill for rich text editor
import "react-quill/dist/quill.snow.css"; // Quill CSS
import "./country.css"; // Import the CSS file

const EditCountries = () => {
  const { id } = useParams(); // Get the destination ID from URL params
  const [destinationData, setDestinationData] = useState(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(
          `https://campusroot.com/api/v1/public/destination/${id}`
        );
        console.log("API Response:", response); // Debugging the response
        const destination = response.data.data;
        if (!destination) {
          throw new Error("Destination data is missing");
        }
        setDestinationData({
          title: destination.title,

          coverImageSrc: destination.coverImageSrc,
          content: destination.content || "", // Ensure content is not null
        });
      } catch (error) {
        console.error("Error fetching destination data:", error);
        setError("Error loading destination data. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };
    fetchDestination();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://campusroot.com/api/v1/public/destination/${id}`,
        {
          ...destinationData,
        }
      );
      alert("Destination updated successfully!");
      navigate(`/destinations`); // Navigate back to destinations page
    } catch (error) {
      console.error("Error updating destination:", error);
      alert("Failed to update destination. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestinationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditorChange = (value) => {
    setDestinationData((prevData) => ({
      ...prevData,
      content: value, // Store the updated content in the state
    }));
  };

  const toggleEditContent = () => {
    setIsEditingContent((prev) => !prev); // Toggle the content edit mode
  };

  if (loading) {
    return <CircularProgress />; // Loading spinner
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    ); // Display error message
  }

  if (!destinationData) {
    return (
      <Typography variant="h6" color="error">
        Destination not found!
      </Typography>
    ); // If no destination data
  }

  return (
    <Grid container spacing={2} className="gridContainer">
      {/* Left side - Preview */}
      <Grid item xs={12} sm={6}>
        <Box className="previewContainer">
          <Typography variant="h5" className="title">
            Preview
          </Typography>
          <Box
            className="previewContent"
            dangerouslySetInnerHTML={{ __html: destinationData.content }}
          />
        </Box>
      </Grid>

      {/* Right side - Editor */}
      <Grid item xs={12} sm={6}>
        <Box className="editorContainer">
          <Typography variant="h5" className="title">
            Edit Destination
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <TextField
              label="Title"
              name="title"
              value={destinationData.title}
              onChange={handleChange}
              required
              className="formField"
            />
            <TextField
              label="Cover Image URL"
              name="coverImageSrc"
              value={destinationData.coverImageSrc}
              onChange={handleChange}
              required
              className="formField"
            />

            <Box className="editorBox">
              <Typography variant="h6">Content</Typography>
              {isEditingContent ? (
                <ReactQuill
                  value={destinationData.content}
                  onChange={handleEditorChange}
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["blockquote", "code-block"],
                      ["undo", "redo"],
                    ],
                  }}
                  style={{ height: "300px" }}
                />
              ) : (
                <div
                  className="editorContent"
                  dangerouslySetInnerHTML={{ __html: destinationData.content }}
                />
              )}
            </Box>
            <Box className="buttonContainer">
              <Button type="submit" variant="contained" color="primary">
                Update Destination
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={toggleEditContent}
              >
                {isEditingContent ? "Save" : "Edit Content"}
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default EditCountries;
