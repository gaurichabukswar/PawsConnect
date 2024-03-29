const express = require('express');
const mysql = require('mysql'); 
const app = express();
const pool = dbConnection();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect('login');
  });
  
  app.get('/login', (req, res) => {
    res.render('login');
  });

  app.get('/createAccount', (req, res) => {
    res.render('createAccount');
  });
  

app.get('/accountDetails',(req, res) => {
  res.render('accountDetails');
});

app.post("/updateAccount", async (req, res) => {
  let username = req.body.username;
  let displayname = req.body.displayname;
  let location = req.body.location;
  let language = req.body.language;
  let picture = req.body.picture;
  let sql = `UPDATE users
             SET displayname = ?, location = ?, language = ?, picture = ?
             WHERE username = ?`
   let params = [displayname, location, language, picture, username];
   let rows = await executeSQL(sql, params);
   res.redirect('/accountDetails');
});

  app.post("/createAccount", async (req, res) => {
    const { username, password, displayname, email, picture, location, language } = req.body;
  
        console.log(username, password);
      
        let sql = `INSERT INTO users (username, displayname, email, password, picture, location, language) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [username, displayname, email, password, picture, location, language];
        executeSQL(sql, values);
    
      
  
      console.log("signing up");
      res.redirect("/accountDetails");
    
  });

  async function executeSQL(sql, params) {
    return new Promise(function (resolve, reject) {
      pool.query(sql, params, function (err, rows, fields) {
        if (err) throw err;
        resolve(rows);
      });
    });
  } //executeSQL
  function dbConnection() {
    const pool = mysql.createPool({
      connectionLimit: 10,
      host: "localhost",
      user: "root",
      password: "password123",
      database: "pawsconnect",
      insecureAuth: true
    });
  
    return pool;
  } //dbConnection

  app.listen(3000, (err) => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log("App listening on port 3000");
    }
});
