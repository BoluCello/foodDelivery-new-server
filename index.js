import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import FoodRoutes from "./routes/Food.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:8462',
  'https://food-delivery-new-client.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow curl/Postman requests
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/user/", UserRoutes);
app.use("/api/food/", FoodRoutes);

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Hello developers from GFG" });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  console.error(`Error: ${message}`);
  return res.status(status).json({ success: false, status, message });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect with MongoDB", error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    app.listen(8462, () => console.log("Server started on port 8462"));
  } catch (error) {
    console.error("Server failed to start", error);
  }
};

startServer();
