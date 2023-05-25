const express = require("express");
const path = require("path");
const app = express();
const port = 8080;

const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1248",
  database: "webpdb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected");
});

app.listen(port, () => console.log(`Server listening on port ${port} !!`));

app.use(express.json());
var cors = require("cors");
app.use(cors());
