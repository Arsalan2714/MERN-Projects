const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `.env.${ENV}` });

const express = require("express");

//external modules
const cors = require("cors");

// Local modules
const errorController = require("./controllers/errorController");
const exchangeRouter = require("./routers/exchangeRouter");
const exchangeRateService = require("./service/exchangeRateService");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Test route (IMPORTANT)
app.get("/test", (req, res) => {
  res.send("Server is running");
});

// API routes
app.use("/api", exchangeRouter);

// 404 handler
app.use(errorController.get404);

const PORT = process.env.PORT || 3001;

async function init() {
  try {
    await exchangeRateService.getRates();
    app.listen(PORT, () => {
      console.log(`Server running at: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
}

init();
