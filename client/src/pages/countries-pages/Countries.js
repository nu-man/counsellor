import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import "./country.css"

const Countries = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.post(
          "https://campusroot.com/api/v1/public/listings/destinations",
          { page: 1, perPage: 50 } // Adjust the parameters as needed
        );
        setDestinations(response.data.data.list);
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching destinations:", error);
        alert("Failed to fetch destinations. Please try again later.");
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const handleEdit = (_id) => {
    navigate(`/edit-country/${_id}`); // Navigate to the edit page with the destination _id
  };

  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      try {
        // Optimistic UI: Remove the destination from the UI before making the API request
        setDestinations(destinations.filter((destination) => destination._id !== _id));
        
        await axios.delete(`https://campusroot.com/api/v1/public/destinations/${_id}`);
        alert("Destination deleted successfully.");
      } catch (error) {
        console.error("Error deleting destination:", error);
        alert("Failed to delete the destination. Please try again.");
        // Revert the optimistic UI change if delete fails
        setDestinations([...destinations]);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  return (
    <div className="destinationContainer">
      <Grid container spacing={3}>
        {destinations.map((destination) => (
          <Grid item lg={4} md={6} sm={12} key={destination._id}>
            <div className="destinationCard">
              <img
                src={destination.coverImageSrc}
                alt={destination.title}
                className="destinationImage"
              />
              <h5 className="destinationTitle">{destination.title}</h5>
              <button
                onClick={() => handleEdit(destination._id)} // Use _id for editing
                className="destinationButton editButton"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(destination._id)} // Use _id for deleting
                className="destinationButton deleteButton"
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

export default Countries;
