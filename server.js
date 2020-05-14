const mysql = require("mysql");
var express = require("express"),
    session = require("express-session"),
    MySQLStore = require("express-mysql-session")(session);
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var cookieParser = require("cookie-parser"),
    bcrypt = require("bcrypt");

const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
const saltRounds = 10;

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

var options = {
    host: "localhost",
    port: 3306,
    user: "root",
    database: "shop",
    password: ""
};

var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'keyboard cat',
    key: 'session',
    resave: false,
    store: sessionStore,
    saveUninitialized: false
    //cookie: { secure: true }
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(
      function(username, password, done) {
          console.log(username);
          console.log(password);
  
          pool.query('SELECT idCustomer, Passwd FROM customers WHERE Email=?', [username], 
          function (err, results, fields) {
              if (err) {done (err)};
  
              if (results.length === 0) {
                  done (null, false);
              } else {
                  const hash = results[0].Passwd.toString();
                  //console.log(hash);
      
                  bcrypt.compare(password, hash, function (err, response) {
                      if(response === true) {
                          return done (null, {user_id: results[0].idCustomer});
                      } else {
                          return done(null, false);
                      }
                  }); 
              }                       
          });
      }
  ));
  
  app.get("/error404", function(req, res) {
    res.render("error404.hbs");
})

// получение списка пользователей
app.get("/", function(req, res) {
    pool.query("SELECT * FROM books", function(err, rows) {
        if (err) return console.log(err);
        res.render("index.hbs", {
            books: rows
        });
    });
});

app.get("/single-product/:id", authenticationMiddleware(),
 function(req, res){
    const idBook = req.params.id;
    pool.query("SELECT b.Title, b.idBook, b.Description, b.IsInStore, b.Price, b.Year, g.Genre, a.FName, a.LName, p.PubName, r.Summary, r.Text, r.Nickname FROM books b LEFT JOIN genres g ON b.idGen=g.idGenre LEFT JOIN authors a ON b.idAuth=a.idAuthor LEFT JOIN publishers p ON b.idPub=p.idPublisher LEFT JOIN reviews r ON b.idBook=r.idBook WHERE b.idBook=?;", [idBook], function(err, rows) {
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

app.post('/single-product/:id', authenticationMiddleware(),
 urlencodedParser, function(req, res) {
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

app.get("/shop-grid", authenticationMiddleware(), function(req, res) {
    let from = req.query.from;
    let to = req.query.to;
    if (from == null) from = 0;
    if (to == null) to = 500;
    // console.log(from);
    // console.log(to);
    pool.query("SELECT * FROM books WHERE Price BETWEEN ? AND ? ;", [from, to], function(err, rows) {
        if (err) return console.log(err);
        res.render("shop-grid.hbs", {
            books: rows
        });
    });
});

app.get("/shop-grid-biography", authenticationMiddleware(), function(req, res) {
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

app.get("/shop-grid-business", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-cooking", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-health", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-history", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-mystery", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-inspiration", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-romance", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-fiction", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-self-improvement", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-humor", authenticationMiddleware(), function(req, res) {
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
app.get("/shop-grid-fairy-tale", authenticationMiddleware(), function(req, res) {
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
    var id = JSON.stringify(req.user);
    console.log('check')
    console.log(id);
    if (id === "{\"user_id\":40}") {
        pool.query('SELECT * FROM Books', [req.params.id], (err, rows, fields) => {
            if (err) return console.log(err);
            res.render("admin_products.hbs", {
                books: rows,
                genres: rows,
                authors: rows[0],
                publishers: rows
    
            });
        });
    } else {
        res.redirect("error404");
    } 
});

app.get('/add-product',
 (req, res) => {
    var id = JSON.stringify(req.user);
    console.log('check')
    console.log(id);
    if (id === "{\"user_id\":40}") {
        res.render('admin_add.hbs');
    } else {
        res.redirect("error404");
    } 
});

app.get('/admin-edit/:id',
 (req, res) => {
    var id = JSON.stringify(req.user);
    console.log('check')
    console.log(id);
    if (id === "{\"user_id\":40}") {
        const id = req.params.id;
        pool.query("SELECT * FROM books WHERE books.idBook = ?", [id], (err, result) => {
            if (err) return console.log(err);
            res.render("admin_edit.hbs", {
                books: result[0]
            });
        });
    } else {
        res.redirect("../error404");
    } 
});

app.post("/admin-edit/:id", urlencodedParser, function(req, res) {

    var id = JSON.stringify(req.user);
    console.log('check')
    console.log(id);
    if (id === "{\"user_id\":40}") {
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
    } else {
        res.redirect("error404");
    } 
});

app.get('/delete/:id', (req, res) => {
    var id = JSON.stringify(req.user);
    console.log('check')
    console.log(id);
    if (id === "{\"user_id\":40}") {
        const id = req.params.id;
        pool.query("DELETE FROM books WHERE idBook = ?", [id], function(err, rows) {
        if (err) return console.log(err);
        res.redirect("/admin_products");
    });
    } else {
        res.redirect("error404");
    }     
});

app.post('/add-product', urlencodedParser, (req, res) => {
    var id = JSON.stringify(req.user);
    console.log('check')
    console.log(id);
    if (id === "{\"user_id\":40}") {
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
    } else {
        res.redirect("error404");
    } 
});

app.get('/admin_users', (req, res) => {
    var id = JSON.stringify(req.user);
    console.log('check')
    console.log(id);
    if (id === "{\"user_id\":40}") {
        pool.query('SELECT * FROM customers', (err, rows, fields) => {
            if (err) return console.log(err);
            res.render("admin_users.hbs", {
                customers: rows
            });
        });
    } else {
        res.redirect("error404");
    } 
});

app.get('/delete_user/:id', (req, res) => {//поменять на ПОСТ
    var id = JSON.stringify(req.user);
    console.log('check')
    console.log(id);
    if (id === "{\"user_id\":40}") {
        const id = req.params.id;
        pool.query("DELETE FROM customers WHERE idCustomer = ?", [id], function(err, rows) {
            if (err) return console.log(err);
            res.redirect("/admin_users");
        });
    } else {
        res.redirect("error404");
    } 
});

app.get('/register', (req, res) => {
    res.render('register.hbs');
});

app.post('/register', urlencodedParser, (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const idCustomer = null;
    const FCustName = req.body.FCustName;
    const LCustName = req.body.LCustName;
    const Phone = req.body.Phone;
    const Email = req.body.Email;
    const CardNum = req.body.CardNum;
    const Passwd = req.body.Passwd;

    const Street = req.body.Street;
    const City = req.body.City;
    const HouseNum = req.body.HouseNum;
    const ApartmentNum = req.body.ApartmentNum;
    const Postcode = req.body.Postcode;

    bcrypt.hash(Passwd, saltRounds, function(err, hash) {
        pool.query("INSERT INTO customers (idCustomer, FCustName, LCustName, Address, Phone, Email, CardNum, Passwd) VALUES (?, ?, ?, concat(?,',',?,',',?,',',?,',',?), ?, ?, ?, ?)", [idCustomer, FCustName, LCustName, Street, City, HouseNum, ApartmentNum, Postcode, Phone, Email, CardNum, hash], function(err, rows) {
            if (err) return console.log(err);
    
            pool.query('SELECT LAST_INSERT_ID() AS user_id', function(error, results, fields) {
                if (error) return console.log(error);
    
                const user_id = results[0];
    
                console.log(user_id);
                req.login(user_id, function(err){
                    res.redirect('/');
                });
            });
        });
    });
});

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});
  
passport.deserializeUser(function(user_id, done) {
      done(null, user_id);
});

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login');
	}
}

app.get('/my-account', authenticationMiddleware(),
 (req, res) => {
    const id = req.user.user_id;
    pool.query("SELECT * FROM customers WHERE idCustomer = ?", [id], (err, result) => {
        if (err) return console.log(err);
        res.render("my-account.hbs", {
            customers: result[0]
        });
    });
});

app.post("/my-account", urlencodedParser, 
authenticationMiddleware(), function(req, res) {
    if (!req.body) return res.sendStatus(400);
    const idCustomer = req.user.user_id;
    const FCustName = req.body.FCustName;
    const LCustName = req.body.LCustName;
    const Phone = req.body.Phone;
    const Email = req.body.Email;
    const CardNum = req.body.CardNum;
    const Passwd = req.body.Passwd;
    const Address = req.body.Address;

    bcrypt.hash(Passwd, saltRounds, function(err, hash) {   
    pool.query("UPDATE customers SET FCustName=?, LCustName=?, Phone=?, Email=?, CardNum=?, Passwd=?, Address=? WHERE idCustomer=?;",
     [FCustName, LCustName, Phone, Email, CardNum, hash, Address, idCustomer],
      function(err, data) {
        if (err) return console.log(err);
        res.redirect("/");
        });
    });
});

app.post('/cart', authenticationMiddleware(), function(req, res) {
    let books = {};
    console.log(req.body.key);
    if (req.body.key.length != 0) {
        pool.query('SELECT idBook,Title,Price,idAuth FROM books WHERE idBook IN(' + req.body.key.join(',') + ')', function(err, result, fields) {
            if (err) throw err;
            console.log(result);
            for (let i = 0; i < result.length; i++) {
                books[result[i]["idBook"]] = result[i];
            }
            res.json(books);
        });
    } else {
        res.send('0');
    }
});


app.get('/wishlist', (req, res) => {
    res.render('wishlist.hbs');
});

app.get('/login', (req, res) => {
    res.render('login.hbs');
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' })
);

app.get('/logout', authenticationMiddleware(), function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
})

app.get('/checkout', authenticationMiddleware(), (req, res) => {
    res.render('checkout.hbs');
});

app.get('/cart', authenticationMiddleware(), (req, res) => {
    res.render('cart.hbs');
});

app.get('/admin_orders', (req, res) => {
    var id = JSON.stringify(req.user);
    console.log('check')
    console.log(id);
    if (id === "{\"user_id\":40}") {
        res.render('admin_orders.hbs');
    } else {
        res.redirect("error404");
    } 
});

app.get('/about', authenticationMiddleware(), (req, res) => {
    res.render('about.hbs');
});

app.listen(3000, function() {
    console.log("Сервер ожидает подключения...");
});