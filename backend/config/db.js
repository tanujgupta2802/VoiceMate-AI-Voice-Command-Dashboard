const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log("Error is coming:", err);
  });
