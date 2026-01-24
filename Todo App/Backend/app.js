const ENV = process.env.NODE_ENV || 'production'


require('dotenv').config({
  path: `.env.${ENV}`
});

// Core Modules


// External Module
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");



// Local Module

const errorController = require("./controllers/errorController");
const itemsRouter = require('./routers/itemsRouter');


const MONGO_DB_URL =
  `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@airbnb.zr7xw53.mongodb.net/${process.env.MONGO_DB_DATABASE}`;


const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());


app.use(itemsRouter);


app.use(errorController.get404);

const PORT = process.env.PORT || 3001;
mongoose.connect(MONGO_DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
  });
});