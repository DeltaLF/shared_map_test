const express = require("express");
const mapRouter = require("./routes/map.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const { socket } = require("./utils/socket");

const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/map", mapRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
socket(httpServer);
