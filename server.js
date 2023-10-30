const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routers/auth");
const verifyToken = require("./middleware");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/auth", authRoutes);

app.get("/home", verifyToken, (req, res) => {
  res.status(200).json({ message: "You have access to the home page" });
});

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctOption: 2
  },
  // Add more questions...
];

app.get('/api/questions', (req, res) => {
  res.json(questions);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
