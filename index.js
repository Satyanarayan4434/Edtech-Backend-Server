// Import express
const express = require("express");

// Create app
const app = express();

// Import Routes
const userRoutes = require("./routes/User"); // Fixed variable name typo
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");

// Import Database
const database = require("./config/database");

// Import cookie-parser
const cookieParser = require("cookie-parser");

// Import CORS
const cors = require("cors");

// Import cloudinary connect function
const { cloudinaryConnect } = require("./config/cloudinary");

// Import express file-upload
const fileUpload = require("express-fileupload");

// Import dot-env and config dot-env
const dotenv = require("dotenv");
dotenv.config();

// Import port from environment
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // Fixed: app.use instead of app.json
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary connect
cloudinaryConnect();

// Define routes
app.use("/api/v1/auth", userRoutes); // Fixed variable name if corrected
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseRoutes);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: `Your server is running`,
  });
});

// Connect to database and start server
database.connect()

app.listen(PORT, () => {
  console.log(`App is running on Port no: ${PORT}`);
});