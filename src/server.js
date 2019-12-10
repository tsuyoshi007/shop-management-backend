require("dotenv").config();

const express = require("express");
const helmet = require("helmet"); // creates headers that protect from attacks (security)
const bodyParser = require("body-parser"); // turns response into usable format
const cors = require("cors"); // allows/disallows cross-site communication
const morgan = require("morgan"); // logs requests

const whitelist = ["http://localhost:3001"];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan("combined"));

const controller = require("./controller");

app.get("/", (req, res, next) => {
  res.sendFile("./build/index.html", { root: __dirname });
});

app.get("/api/product", (req, res, next) => {
  controller.getTable(req, res);
});

app.post("/api/product", (req, res) => {
  controller.insertRow(req, res);
});

app.put("/api/product", (req, res) => {
  controller.editRow(req, res);
});

app.delete("/api/product", (req, res) => {
  controller.deleteRow(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
});
