const express = require("express");
const bodyParser = require("body-parser");
const handleAuthRoutes = require("./Routes/authRoutes");
const { connectToDatabase } = require("./db&token/db");
require("dotenv").config();
const message = require("./responses/message");

const app = express();
const PORT = process.env.PORT;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", handleAuthRoutes);
// Error handling middleware for invalid endpoints
app.use((req, res, next) => {
  const error = new Error("Invalid endpoint");
  error.status = 400;
  next(error);
});

// Error handling middleware
app.use((err, req, res) => {
  message.sendErrorResponse(res, err.status || 500, err.message || "Internal Server Error");
});

// Connect to database and start server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

module.exports = app;
