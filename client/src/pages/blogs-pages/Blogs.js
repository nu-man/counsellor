import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import './blog.css'; // Import the CSS file

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.post(
          "https://campusroot.com/api/v1/public/listings/blogs",
          { page: 1, perPage: 50 } // Adjust the parameters as needed
        );
        setBlogs(response.data.data.list);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        alert("Failed to fetch blogs. Please try again later.");
      }
    };
    fetchBlogs();
  }, []);

  const handleEdit = (_id) => {
    navigate(`/edit-blog/${_id}`); // Navigate to the edit page with the blog _id
  };

  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`https://campusroot.com/api/v1/public/blogs/${_id}`);
        alert("Blog deleted successfully.");
        setBlogs(blogs.filter((blog) => blog._id !== _id)); // Use _id to filter out the deleted blog
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete the blog. Please try again.");
      }
    }
  };

  return (
    <div className="blogContainer">
      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item lg={4} md={6} sm={12} key={blog._id}>
            <div className="blogCard">
              <img
                src={blog.coverImageSrc}
                alt={blog.title}
                className="blogImage"
              />
              <h5 className="blogTitle">{blog.title}</h5>
              <button
                onClick={() => handleEdit(blog._id)} // Use _id for editing
                className="blogButton editButton"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog._id)} // Use _id for deleting
                className="blogButton deleteButton"
              >
                Delete
              </button>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Blogs;
