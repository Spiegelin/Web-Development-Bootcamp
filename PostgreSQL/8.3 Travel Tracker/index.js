import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";

// Import PostgreSQL module
import pg from "pg";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// DB connection
const db = new pg.Client({
  user: process.env.DB_USER,
  host: "localhost",
  database: "world",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

// Function to check which countries have been visited
const checkVisited = async () => {
  // Get all countries from DB as an array of objects
  const result = await db.query("SELECT country_code FROM visited_countries");

  // Create an array of country codes
  let countries = [];

  // Loop through the array of objects and push each country code to the array
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });

  return countries;
};

// GET home page using async/await because we are using PostgreSQL and we have to wait for the query to finish
app.get("/", async (req, res) => {
  // Get all countries from DB as an array of objects
  const countries  = await checkVisited();

  // Render the index.ejs file and pass the array of country codes
  res.render("index.ejs", { 
    countries: countries,
    total: countries.length
  });
});

// POST route to add a new country to the DB
app.post("/add", async (req, res) => {
  // Get the country name from the form
  const countryName = req.body["country"];

  // Get the country code from the DB and try/catch in case the country name doesn't exist
  try {
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';", 
      [countryName.toLowerCase()]
    );
  
    const countryCode = result.rows[0].country_code;

    try {
      // Insert the country code into the DB
      await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
        countryCode,
      ]);

      // Redirect to the home page
      res.redirect("/");

    } catch (error) {
      console.log(error);
      const countries = await checkVisited();
      res.render("index.ejs", { 
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again" 
      });
    }
  } catch (error) {
    console.log(error);
    const countries = await checkVisited();
    res.render("index.ejs", { 
      countries: countries,
      total: countries.length,
      error: "Country doesn't exist, try again" 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
