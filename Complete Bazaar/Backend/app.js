import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

// Local modules
import * as errorController from "./controllers/errorController.js";
import conversationRouter from "./routers/conversationRouter.js";
import * as chatgptService from "./service/chatgptService.js";



dotenv.config();

const MONGO_DB_URL = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@airbnb.zr7xw53.mongodb.net/${process.env.MONGO_DB_DATABASE}`;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", conversationRouter);

// 404 handler
app.use(errorController.get404);

const PORT = process.env.PORT || 3001;

mongoose
  .connect(MONGO_DB_URL)
  .then(() => {
    chatgptService.initAIAssistant((err, assistant) => {
      if (err) {
        console.error("Failed to initialize AI assistant:", err);
        process.exit(1);
      }

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });