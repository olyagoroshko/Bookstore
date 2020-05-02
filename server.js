const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
 
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "shop",
  password: ""
});
 
app.use(express.static(path.join(__dirname, 'style')));

app.set("view engine", "hbs");
 
// получение списка пользователей
app.get("/", function(req, res){
    pool.query("SELECT * FROM books", function(err, rows) {
      if(err) return console.log(err);
      res.render("index.hbs", {
        books: rows
      });
    });
});

app.get("/single-product/:id", function(req, res){
  const id = req.params.id;
  pool.query("SELECT b.Title, b.idBook, b.Description, b.IsInStore, b.Price, b.Year, g.Genre, a.FName, a.LName, p.PubName, r.Summary, r.Text, r.Nickname FROM books b INNER JOIN genres g ON b.idGen=g.idGenre INNER JOIN authors a ON b.idAuth=a.idAuthor INNER JOIN publishers p ON b.idPub=p.idPublisher INNER JOIN reviews r ON b.idBook=r.idBook WHERE b.idBook=?;", [id], function(err, rows) {
    if(err) return console.log(err);
     res.render("single-product.hbs", {
        books: rows[0],
        genres: rows[0],
        authors: rows[0],
        publishers: rows[0], 
        reviews: rows
    });
  });
});
 
app.listen(3000, function(){
  console.log("Сервер ожидает подключения...");
});