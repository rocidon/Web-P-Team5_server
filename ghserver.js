const express = require("express");
const path = require("path");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");
const ejs = require("ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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
  /*con.query("CREATE DATABASE express_db", function (err, result) {
    if (err) throw err;
    console.log("database created");
  }); //데이터베이스 생성(한번만)
  const sql =
    "CREATE TABLE users(id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table created");
  }); //테이블 생성(한번만)
  const sql = "INSERT INTO users(name,email) VALUES('kevin','kevin@test.com')";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });*/
});

app.listen(port, () => console.log(`Server listening on port ${port} !!`));

/*app.get("/", (request, response) =>
  response.sendFile(path.join(__dirname, "ghserver html/ghserver.html"))
); //메인화면*/

/*app.post("/", (req, res) => res.send(req.body));*/
//form입력하고 버튼누르면 정보보여준다. app.post는 두개쓰면 안됨.

app.get("/", (req, res) => {
  const sql = "select * from users";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render("index", { users: result });
  });
});

app.get("/delete/:id", (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.redirect("/");
  });
});

app.post("/update/:id", (req, res) => {
  const sql = "UPDATE users SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect("/");
  });
}); //갱신 라우팅

app.get("/edit/:id", (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render("edit", { users: result });
  });
});

/*app.post("/", (req, res) => {
  const sql = "INSERT INTO users SET ?";

  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    //res.send("등록이 완료 되었습니다.");
    res.redirect("/"); // '/'루트로 초기화된다.
  });
});*/

/*
{
  const sql = "select * from webpdb";
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    response.send(result);
  });
});*/
//app.get("/", (req, res) => res.send("Hello World!"));
