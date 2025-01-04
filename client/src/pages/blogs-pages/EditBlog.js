import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";  // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import the Quill CSS
import { Grid, Box, Typography, Button, TextField } from "@mui/material"; // Import MUI components
import './blog.css'; // Import the CSS file

const EditBlog = () => {
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://campusroot.com/api/v1/public/blog/${id}`
        );
        const blog = response.data.data;
        setBlogData({
          title: blog.title,
          coverImageSrc: blog.coverImageSrc,
          summary: blog.summary,
          content: blog.content || "", // Ensure content is not null
        });
      } catch (error) {
        console.error("Error fetching blog data:", error);
        alert("Error loading blog data. Please try again later.");
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://campusroot.com/api/v1/public/blog/${id}`, {
        ...blogData,
      });
      alert("Blog updated successfully!");
      navigate(`/blogs`);
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditorChange = (value) => {
    setBlogData((prevData) => ({
      ...prevData,
      content: value, // Store the updated content in the state
    }));
  };

  const toggleEditContent = () => {
    setIsEditingContent((prev) => !prev); // Toggle the content edit mode
  };

  if (blogData === null) {
    return <div>Loading...</div>; // Loading state
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
            dangerouslySetInnerHTML={{ __html: blogData.content }}
          />
        </Box>
      </Grid>

      {/* Right side - Editor */}
      <Grid item xs={12} sm={6}>
        <Box className="editorContainer">
          <Typography variant="h5" className="title">
            Edit Blog
          </Typography>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              label="Title"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              required
              className="formField"
            />
            <TextField
              label="Cover Image URL"
              name="coverImageSrc"
              value={blogData.coverImageSrc}
              onChange={handleChange}
              required
              className="formField"
            />
            <TextField
              label="Summary"
              name="summary"
              value={blogData.summary}
              onChange={handleChange}
              required
              multiline
              rows={4}
              className="formField"
            />
            <Box className="editorBox">
              <Typography variant="h6">Content</Typography>
              {isEditingContent ? (
                <ReactQuill
                  value={blogData.content}
                  onChange={handleEditorChange}
                  modules={{
                    toolbar: [
                      ["bold", "italic", "link"],
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
                  dangerouslySetInnerHTML={{ __html: blogData.content }}
                />
              )}
            </Box>
            <Box className="buttonContainer">
              <Button type="submit" variant="contained" color="primary">
                Update Blog
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

export default EditBlog;
