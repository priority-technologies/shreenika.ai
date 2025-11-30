const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://shreenika-ai-drab.vercel.app",
    "https://shreenika-ai.onrender.com",
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Basic middleware
app.use(express.json());

// 👉 Import your auth routes
const authRoutes = require("./routes/auth");

// 👉 MongoDB Connection FIRST (IMPORTANT)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("🔥 MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// 👉 Use them with a base path
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend API is working fine!");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
