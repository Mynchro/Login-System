const express = require("express");
const pasth = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();
const PORT = 5000;

//middleware um daten in json zu formatieren
app.use(express.json());

app.use(express.urlencoded({ extended: false })); // middleware um Daten zu parsen, die von HTML-Formularen gesendet werden -> url-encoded formulardaten werden in js-objekte umgewandelt, die dann im req.body zugänglich sind; extended false setzt die Standardbibliothek (es werden nur einfache datentypen wie strings oder arrays verarbeitet)
// hier ganz speziell: Login/Signup Formular nutzen post methode -> urlencoded greift auf name-attribut des Input-Felds zurück und parst die Daten -> macht sie im req.body als JS-Objekt zugänglich, daher weiter unten der Zugriff auf req.body.username und req.body.password

// use EJS as the view engine
app.set("view engine", "ejs"); // view engine bestimmt, wie HTML oder andere Vorlagen mit Daten kombiniert werden, um die HTML-Seite zu generieren
// EJS ist eine beliebte View-Engine für Node.js, ermöglicht Javascript in HTML-Dateien einzubetten -> HTML-Code wird serverseitig generiert! (nicht wie bei React client-seitig!): Server generiert HTML-Code -> schickt diesen vollständig an Browser

//static file
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

//register user
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  //check if user already exists

  const existingUser = await collection.findOne({ name: data.name });

  if (existingUser) {
    res.send("User already exists. Please choose another username!");
  } else {
    //hash the password with bcrypt

    const saltRounds = 10; //number of salt round for bcrypt -> Salt = zufälliger Wert, der dem PW hinzugefügt wird, bevor es gehashed wird
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; // Replace hash password with original password

    const userdata = await collection.insertMany(data);
    console.log(userdata);
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("Username not found");

      //compare hash password from database with entered password
    }
    const isPasswordMatch = await bcrypt.compare(
      // vergleich vom PW (Klartext im Formular) mit dem gehashten PW in der DB -> der Salt wird intern gespeichert, somit können die PWs verglichen werden
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render("home");
    } else {
      res.send("Wrong password!");
    }
  } catch (error) {
    res.send("Wrong Details");
  }
});

app.listen(PORT, () => {
  console.log(`Server hört auf Port ${PORT}`);
});
