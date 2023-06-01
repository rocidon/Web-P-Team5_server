const express = require("express");
const path = require("path");
const app = express();
const port = 8080;
const cors = require("cors");
const { v4 } = require("uuid");

const uuid = () => {
  const tokens = v4().split("-");
  return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
};

const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1248",
  database: "webp_db",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("오류 없이 연결 성공~ 오류 뜨면 정재승에게 문의");
  con.query(
    "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1248';",
    function (err, result) {
      if (err) throw err;
    }
  );
  // 아래 여러줄 주석 돼 있는 부분 최초 실행시 주석풀고 실행해주세요.
  // webp_db라는 Database 생성하는 쿼리문 입니다.
  // 1회 실행 이후 다시 주석처리 해주세요.
  // 더 아래 있는 여러줄 주석이랑 동시에 풀고 하면 안됩니다.
  /*
  con.query("CREATE DATABASE webp_db;", function(err,result){
    if(err) throw err;
  });
  */

  // 위에 주석 처리 된거 풀고 1회 실행 한 뒤 아래도 똑같이 실행해주세요.
  // 최초 실행 이후엔 다시 주석처리 해야 DB 초기화 되지 않습니다~
  /*
  const sql_drop_posts_table = "DROP TABLE IF EXISTS posts;";
  const sql_drop_comments_table = "DROP TABLE IF EXISTS comments;";
  const sql_create_posts_table =
    "CREATE TABLE posts (uuid VARCHAR(32) NOT NULL, creator VARCHAR(10) NOT NULL, email VARCHAR(32) NOT NULL, title VARCHAR(20) NOT NULL, text VARCHAR(200) NOT NULL, likecount INT NOT NULL, timestamp VARCHAR(13) NOT NULL, PRIMARY KEY (uuid), UNIQUE (uuid));";
  const sql_create_comments_table =
    "CREATE TABLE comments (uuid VARCHAR(32) NOT NULL, uuid2 VARCHAR(32) NOT NULL, creator VARCHAR(10) NOT NULL, email VARCHAR(32) NOT NULL, text VARCHAR(200) NOT NULL, likecount INT NOT NULL, timestamp VARCHAR(13) NOT NULL, PRIMARY KEY (uuid2), UNIQUE (uuid2));";

  con.query(sql_drop_posts_table, function (err, result) {
    if (err) throw err;
  });
  con.query(sql_drop_comments_table, function (err, result) {
    if (err) throw err;
  });
  con.query(sql_create_posts_table, function (err, result) {
    if (err) throw err;
  });
  con.query(sql_create_comments_table, function (err, result) {
    if (err) throw err;
  });
  console.log("posts, comments table 생성 됨");
  */
});

app.use(express.json());
app.use(cors());

app.listen(port, () =>
  console.log(`서버 포트 할당 됨~ 사용 포트: http://localhost:${port}`)
);

app.use(express.static(path.join(__dirname, "web-team-proj-5-front")));

app.get("/", function (request, response) {
  response.sendFile(
    path.join(__dirname, "web-team-proj-5-front/build/index.html")
  );
});

// posts table의 data를 timestamp 내림차순으로 가져오는 api
app.get(`/posts/all`, (req, res) => {
  const sql = `select * from posts order by timestamp desc;`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

// posts table의 data중 uuid를 가진 data를 가져오는 api
app.get(`/posts`, (req, res) => {
  const post_uuid = req.query.uuid;
  const sql = `select * from posts where uuid = ?;`;
  con.query(sql, post_uuid, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

// comments table의 data를 timestamp 내림차순으로 가져오는 api
app.get("/comments", (req, res) => {
  const sql = `select * from comments order by timestamp desc;`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

// posts table에 data를 삽입하는 api
app.post("/posts", (req, res) => {
  let post_uuid = uuid();
  let post_creator = req.body.params.post_creator;
  let post_email = req.body.params.post_email;
  let post_title = req.body.params.post_title;
  let post_text = req.body.params.post_text;
  let post_likecount = 0;
  let post_timestamp = new Date().getTime();
  let values = [
    post_uuid,
    post_creator,
    post_email,
    post_title,
    post_text,
    post_likecount,
    post_timestamp,
  ];

  const sql =
    "INSERT INTO posts (uuid, creator, email, title, text, likecount, timestamp) VALUES(?, ?, ?, ?, ?, ?, ?)";
  con.query(sql, values, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
  console.log("UUID:" + post_uuid + " 로 게시글 생성됨.");
});

// comments table에 data를 삽입하는 api
app.post("/comments", (req, res) => {
  let post_uuid = req.body.params.post_uuid;
  let comment_uuid = uuid();
  let comment_creator = req.body.params.comment_creator;
  let comment_email = req.body.params.comment_email;
  let comment_text = req.body.params.comment_text;
  let comment_likecount = 0;
  let comment_timestamp = new Date().getTime();
  let values = [
    post_uuid,
    comment_uuid,
    comment_creator,
    comment_email,
    comment_text,
    comment_likecount,
    comment_timestamp,
  ];

  const sql =
    "INSERT INTO comments (uuid, uuid2, creator, email, text, likecount, timestamp) VALUES(?, ?, ?, ?, ?, ?, ?)";
  con.query(sql, values, (err, result) => {
    if (err) console.log(err);
    else res.send(result);
  });
  console.log("UUID:" + comment_uuid + " 로 댓글 생성됨.");
});

// posts table의 특정 uuid를 가진 게시물의 text를 update하는 api
app.post("/posts/update", (req, res) => {
  const post_uuid = req.body.params.post_uuid;
  const post_text = req.body.params.post_text;

  /*
  const post_email = req.body.params.post_email;

  const sql_email = "SELECT COUNT(*) AS result FROM user WHERE email =?";

  con.query(sql_email, post_email, (err, data) => {
    if (!err) {
      if (data.result < 1) {
        res.send("아이디가 존재하지 않습니다.");
      } else {
        //Update
      }
    } else {
      res.send(err);
    }
  });
  */

  const sql_update_post = "UPDATE posts SET text = ? where uuid = ?";
  con.query(sql_update_post, [post_text, post_uuid], (err, data) => {
    if (!err) {
      res.send("성공");
    } else {
      res.send(err);
    }
  });
});

// comments table의 특정 uuid를 가진 게시물의 text를 수정하는 api
app.post("/comments/update", (req, res) => {
  const comments_uuid2 = req.body.params.comments_uuid2;
  const comments_text = req.body.params.comments_text;

  /*
  const comments_email = req.body.params.comments_email;

  const sql_email = "SELECT COUNT(*) AS result FROM user WHERE email =?";

  con.query(sql_email, comments_email, (err, data) => {
    if (!err) {
      if (data.result < 1) {
        res.send("아이디가 존재하지 않습니다.");
      } else {
        //Update
      }
    } else {
      res.send(err);
    }
  });
  */

  const sql_update_comments = "UPDATE comments SET text = ? where uuid2 = ?";
  con.query(
    sql_update_comments,
    [comments_text, comments_uuid2],
    (err, data) => {
      if (!err) {
        res.send("성공");
      } else {
        res.send(err);
      }
    }
  );
});

// posts table의 특정 uuid를 가진 게시물 + comments table의 특정 uuid를 가진 게시물 들을 삭제하는 api
app.post("/posts/delete", (req, res) => {
  const post_uuid = req.body.params.post_uuid;
  /*
  const post_email = req.query.post_email;

  const sql_email =
    "SELECT COUNT(*) AS result FROM 유저db WHERE email = '?'";
  con.query(sql_email, post_email, (err, data) => {
    if (!err) {
      if (data.result < 1) {
        res.send("실패");
      } else {
        //Delete문
      }
    } else {
      res.send(err);
    }
  });
  */

  const sql_delete_post = "DELETE FROM webp_db.posts WHERE uuid = ?";
  const sql_delete_all_comments = "DELETE FROM webp_db.comments WHERE uuid = ?";
  con.query(sql_delete_post, post_uuid, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
  con.query(sql_delete_all_comments, post_uuid, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send("true");
  });
});

// comments table의 특정 uuid2를 가진 게시물을 삭제하는 api
app.post("/comments/delete", (req, res) => {
  const comment_uuid = req.body.params.comment_uuid;
  /*
  const comment_email = req.query.comment_email;

  const sql_email =
    "SELECT COUNT(*) AS result FROM 유저db WHERE email = '?'";
  con.query(sql_email, comment_email, (err, data) => {
    if (!err) {
      if (data.result < 1) {
        res.send("실패");
      } else {
        //Delete문
      }
    } else {
      res.send(err);
    }
  });
  */

  const sql_delete_comment = "DELETE FROM webp_db.comments WHERE uuid2 = ?";
  con.query(sql_delete_comment, comment_uuid, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send("true");
  });
});

/*

app.get(`/populars`, (request, response) => {
  const sql = `select * from webpdb order by likecount desc`;
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    response.json(result);
  });
});


*/

app.get("*", function (request, response) {
  response.sendFile(
    path.join(__dirname, "web-team-proj-5-front/build/index.html")
  );
});
