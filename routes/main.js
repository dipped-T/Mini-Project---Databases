module.exports = function (app, shopData) {
const bcrypt = require('bcrypt');

const redirectLogin = (req, res, next) => {

       if (!req.session.userId ) {
                                                                                                                                                                                                                   
            res.redirect('./login')
                                                                                                                                                                                                                   
           } else { next (); }
}

    // Handle our routes
    app.get('/', function (req, res) {
        res.render('index.ejs', shopData)
    });
    app.get('/users-list', function (req, res) {
        res.render('listusers.ejs', shopData)
    });
    app.get('/about', function (req, res) {
        res.render('about.ejs', shopData);
    });
    app.get('/search', function (req, res) {
        res.render("search.ejs", shopData);
    });
    app.get('/login', function (req, res) {
        res.render('login.ejs', shopData);
    });

    app.get('/search-result', function (req, res) {
        //searching in the database
        res.send("You searched for: " + req.query.keyword);
    });
    app.get('/register', function (req, res) {
        res.render('register.ejs', shopData);
    });
    app.post('/registered', function (req, res) {
        // saving data in database
        const saltRounds = 10;
        const plainPassword = req.body.password;
        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
            let sqlquery = "INSERT INTO Users (Usernames, LastName, FirstName, Email, HashPass) VALUES (?,?,?,?,?)";
            let newrecord = [req.body.username, req.body.last, req.body.first, req.body.email, hashedPassword];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    res.redirect('./register');
                }
                res.render("register.ejs")
            });
        });
    });

    app.get('/addbook', function (req, res) {
        res.render('addbook.ejs', shopData);
    });

    app.post('/bookadded', function (req, res) {

        // saving data in database

        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";

        // execute sql query

        let newrecord = [req.body.name, req.body.price];

        db.query(sqlquery, newrecord, (err, result) => {

            if (err) {
                return console.error(err.message);
            }
            else
                res.send(' This book is added to database, name: ' + req.body.name + ' price: ' + req.body.price);
        });

    });

    app.get('/list', function (req, res) {

        let sqlquery = "SELECT * FROM Foodstore WHERE name LIKE '%" + req.query.keyword +"%'"; // query database to get all the foods 

        // execute sql query

        db.query(sqlquery, (err, result) => {

            if (err) {

                res.redirect('./');

            }

            let newData = Object.assign({}, shopData, { availableBooks: result });

            res.render("list.ejs", newData)

        });

    });

    app.get('/listusers', function (req, res) {
        let sqlquery = "SELECT * FROM Users ORDER BY Firstname";
        //execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            let newData = Object.assign({}, shopData, { listUsers: result });
            res.render("listusers.ejs", newData)
        });
    });

    app.get('/bargainbooks', function (req, res) {

        let sqlquery = "SELECT * FROM books WHERE price < 20"; // query database to get all the books

        // execute sql query

        db.query(sqlquery, (err, result) => {

            if (err) {

                res.redirect('./');

            }
            let newData = Object.assign({}, shopData, { availableBooks: result });

            res.render("bargainbooks.ejs", newData)


        });

    });

   app.get('/addfood', function (req, res){

            res.render("addbook.ejs")
        });


  app.post('/foodadded', function (req, res){
	let sqlquery = "INSERT INTO Foodstore(username, name, values, unit, carbs, fat, protein, sugar, salt)";
		
	// execute sql query
                                                                                                                                                                                                                   
        let newrecord = [req.body.username, req.body.name, req.body.values, req.body.unit, req.body.carbs, req.body.fat, req.body.protein, req.body.sugar, req.body.salt];
                                                                                                                                                                                                                   
        db.query(sqlquery, newrecord, (err, result) => {
                                                                                                                                                                                                                   
            if (err) {
                return console.error(err.message);
            }
            else
                res.send(' This has been added to database');
	})
})

  
   app.post('/loggedin', function (req, res){
       let sqlquery = "SELECT * FROM Users WHERE username ='"+req.body.username+"'";
       db.query(sqlquery, (err, result) => {
                                                                                                                                                                                                                   
            if (err) {
                                                                                                                                                                                                                  
                res.redirect('./');}                                                                                                                                                                                                             
            
            if (result[0] != undefined){
		hashpassword = result[0].hashpassword }
     
     // Compare the password supplied with the password in the database

        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {

         if (err) {

      // Handle error

      }

        else if (result == true) {
        req.session.userId=req.body.username;
	res.send("You have logged in");

        // Send success message

     }

        else {
	res.send("Incorrect username or password.");
       // Sends error  message
	   };
      	 })
      })
   })
}
