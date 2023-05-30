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

app.use(express.static(path.join(__dirname, "web-team-proj-5-front")));

app.get("/", function (request, response) {
  response.sendFile(
    path.join(__dirname, "web-team-proj-5-front/build/index.html")
  );
});
app.get(`/posts`, (request, response) => {
  const sql = `select * from webpdb order by timestamp desc`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    response.json(result);
  });
});

app.get(`/populars`, (request, response) => {
  const sql = `select * from webpdb order by likecount desc`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    response.json(result);
  });
});

app.get("/comments", (request, response) => {
  const sql = `select * from webpdb2`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    response.json(result);
  });
});

app.get("*", function (request, response) {
  response.sendFile(
    path.join(__dirname, "web-team-proj-5-front/build/index.html")
  );
});
