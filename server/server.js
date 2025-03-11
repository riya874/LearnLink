// PACKAGES
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

// FILES
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes")
const tutorRoutes = require("./routes/tutorRoutes")
const parentRoutes = require("./routes/parentRoutes")
const sessionRoutes = require("./routes/sessionRoutes")
const messageRoutes = require("./routes/messageRoutes")
const adminRoutes = require("./routes/adminRoutes")

// DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

// REST OBJECT
const app = express();

// MIDDLEWARES
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
};
app.use(cors(corsOptions));
app.use(cookieParser()); // TO PARSE COOKIE
app.use(express.json());
app.use(morgan("dev")); // TO HAVE CONSOLE LOGS SUCCESS AND ERROR


// MAIN ROUTE
app.get("", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Learn Link Server!!"
    });
});

// API ROUTES
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/tutor", tutorRoutes)
app.use("/api/v1/parent", parentRoutes)
app.use("/api/v1/session", sessionRoutes)
app.use("/api/v1/messages", messageRoutes)
app.use("/api/v1/admin", adminRoutes)



// PORT
const PORT = process.env.PORT || 5000;

// LISTEN
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`.bgGreen.white);
})