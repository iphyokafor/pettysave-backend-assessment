import express from "express";
import logger from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import dotenv from "dotenv";
import router from "./routes/index";

require("./helpers/database/db");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", router);

app.get("/", (request, response) => {
  response.status(200).json({
    status: "success",
    message: "Welcome to pettysave-backend-assessment",
  });
});
app.all("*", (request, response) => {
  response.status(404).json({
    status: "error",
    error: "resource not found",
  });
});

module.exports = app;
