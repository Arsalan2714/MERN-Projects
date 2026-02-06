const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `.env.${ENV}` });

//external modules
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// Local modules
const errorController = require("./controllers/errorController");
const conversationRouter = require("./routers/conversationRouter");

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
mongoose.connect(MONGO_DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
})

