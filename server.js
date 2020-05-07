const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());

const pool = mysql.createConnection({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "shop",
    password: ""
});

pool.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.use(express.static(path.join(__dirname, 'style')));

app.set("view engine", "hbs");

// получение списка пользователей
app.get("/", function(req, res) {
    pool.query("SELECT * FROM books", function(err, rows) {
        if (err) return console.log(err);
        res.render("index.hbs", {
            books: rows
        });
    });
});

app.get("/shop-grid", function(req, res) {
    res.render("shop-grid.hbs");
});

app.get("/single-product/:id", function(req, res) {
    const id = req.params.id;
    pool.query("SELECT b.Title, b.idBook, b.Description, b.IsInStore, b.Price, b.Year, g.Genre, a.FName, a.LName, p.PubName, r.Summary, r.Text, r.Nickname FROM books b INNER JOIN genres g ON b.idGen=g.idGenre INNER JOIN authors a ON b.idAuth=a.idAuthor INNER JOIN publishers p ON b.idPub=p.idPublisher INNER JOIN reviews r ON b.idBook=r.idBook WHERE b.idBook=?;", [id], function(err, rows) {
        if (err) return console.log(err);
        res.render("single-product.hbs", {
            books: rows[0],
            genres: rows[0],
            authors: rows[0],
            publishers: rows[0],
            reviews: rows
        });
    });
});

app.post('/single-product/:id', urlencodedParser, function(req, res) {
    if (!req.body) return res.sendStatus(400);
    const idBook = req.params.id;
    const idReview = null;
    const Nickname = req.body.nickname;
    const Summary = req.body.summary;
    const Text = req.body.text;
    console.log(idReview, idBook, Nickname, Summary, Text);
    pool.query("INSERT INTO reviews (idReview, idBook, Summary, Text, Nickname) VALUES (?, ?, ?, ?, ?)", [idReview, idBook, Summary, Text, Nickname], function(err, rows) {
        if (err) return console.log(err);
        res.redirect(idBook);
    });
});

app.get("/shop-grid", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    // console.log(from);
    // console.log(to);
    pool.query("SELECT * FROM BOOKS WHERE Price BETWEEN ? AND ? ;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});

app.get("/shop-grid-biography", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='biography' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});

app.get("/shop-grid-business", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='business' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-cooking", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='cooking' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-health", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='health' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-history", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='history' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-mystery", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='mystery' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-inspiration", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='inspiration' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-romance", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='romance' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-fiction", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='fiction' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-self-improvement", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='self-improvement' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-humor", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='humor' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});
app.get("/shop-grid-fairy-tale", function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    pool.query("SELECT b.idBook, b.Title, b.Price, g.Genre FROM books b INNER JOIN genres g ON b.idGen=g.idGenre WHERE g.Genre='fairy-tale' AND Price BETWEEN ? AND ?;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});


app.get('/admin_products', (req, res) => {
    pool.query('SELECT * FROM Books', [req.params.id], (err, rows, fields) => {
        if (err) return console.log(err);
        res.render("admin_products.hbs", {
            books: rows,
            genres: rows,
            authors: rows[0],
            publishers: rows

        });
    });
});

app.get('/add-product', (req, res) => {
    // res.render('D:/Bookstore-master/views/admin_add.hbs');
    res.render('admin_add.hbs');
});

app.get('/admin-edit/:id', (req, res) => {
    const id = req.params.id;
    pool.query("SELECT * FROM books WHERE books.idBook = ?", [id], (err, result) => {
        if (err) return console.log(err);
        res.render("admin_edit.hbs", {
            books: result[0]
        });
    });
});
app.post("/admin-edit/:id", urlencodedParser, function(req, res) {
    if (!req.body) return res.sendStatus(400);
    const idBook = req.params.id;
    const idAuth = req.body.author;
    const idGen = req.body.genre;
    const idPub = req.body.publisher;
    const Year = req.body.year;
    const Price = req.body.price;
    const Title = req.body.title;
    const Description = req.body.description;
    const IsInStore = req.body.IsInStore;
    pool.query("UPDATE books SET idAuth=?, idGen=?, idPub=?, Year=?, Price=?, Title=?, Description=?, IsInStore=? WHERE idBook=?;", [idAuth, idGen, idPub, Year, Price, Title, Description, IsInStore, idBook], function(err, data) {
        if (err) return console.log(err);
        res.redirect("/admin_products");
    });
});

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    pool.query("DELETE FROM books WHERE idBook = ?", [id], function(err, rows) {
        if (err) return console.log(err);
        res.redirect("/admin_products");
    });
});

app.post('/add-product', urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const idBook = null;
    const idAuth = req.body.author;
    const idGen = req.body.genre;
    const idPub = req.body.publisher;
    const Year = req.body.year;
    const Price = req.body.price;
    const Title = req.body.title;
    const Description = req.body.description;
    const IsInStore = req.body.IsInStore;
    //console.log(idBook, idAuth, idGen, idPub, Year, Price, Title, Description, IsInStore);
    pool.query("INSERT INTO books (idBook, idAuth, idGen, idPub, Year, Price, Title, Description, IsInStore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [idBook, idAuth, idGen, idPub, Year, Price, Title, Description, IsInStore], function(err, rows) {
        if (err) return console.log(err);
        res.redirect("/admin_products");
    });
});

app.get('/admin_users', (req, res) => {
    pool.query('SELECT * FROM customers', (err, rows, fields) => {
        if (err) return console.log(err);
        res.render("admin_users.hbs", {
            customers: rows
        });
    });
});

app.get('/delete_user/:id', (req, res) => {
    const id = req.params.id;
    pool.query("DELETE FROM customers WHERE idCustomer = ?", [id], function(err, rows) {
        if (err) return console.log(err);
        res.redirect("/admin_users");
    });
});

app.get('/wishlist', (req, res) => {
    res.render('wishlist.hbs');
});

app.get('/register', (req, res) => {
    res.render('register.hbs');
});

app.get('/my-account', (req, res) => {
    res.render('my-account.hbs');
});

app.get('/login', (req, res) => {
    res.render('login.hbs');
});

app.get('/error404', (req, res) => {
    res.render('error404.hbs');
});

app.get('/checkout', (req, res) => {
    res.render('checkout.hbs');
});

app.get('/cart', (req, res) => {
    res.render('cart.hbs');
});

app.get('/admin_orders', (req, res) => {
    res.render('admin_orders.hbs');
});

app.get('/about', (req, res) => {
    res.render('about.hbs');
});

app.listen(3000, function() {
    console.log("Сервер ожидает подключения...");
});