// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Import Firebase configuration
const serviceAccount = require("../firebaseConfig.js");

// Import database configuration
const db = require('./db');

// Import livereload modules for live reloading in development
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

// Setup livereload server for real-time updates during development
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Import routers for different endpoints
const analyticsRouter = require("./routers/analytics");
const usersRouter = require("./routers/users");
const chatsRouter = require("./routers/chats");

// Configure CORS (Cross-Origin Resource Sharing) options
var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // Compatibility with IE11 and some SmartTVs
};

// Initialize Express application
const app = express();

// Apply middleware
app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json()); // Parse JSON bodies

// Use routers for respective routes
app.use("/analytics", analyticsRouter);
app.use("/users", usersRouter);
app.use("/chats", chatsRouter);

// Apply livereload middleware in development environment
const env = process.env.NODE_ENV || "development";
if (env === "development") {
  app.use(connectLiveReload());
}

// Endpoint to run analytics
app.get("/run-analytics", async (req, res) => {
  res.status(200).send("hi");
});

// Default route
app.get("/", async (req, res) => {
  res.status(200).send("hi");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).send('Something went wrong!');
});

// Start the server and listen on the port from environment variables
app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
