import express from "express";
import pg from "pg";
import config from "./config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

const app = express();
app.use(express.json());

const port = 3000;

// start the server on port 3000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// -------------------------
// HELPER FUNCTION
// -------------------------

// create a function that adds a planet to the database
async function addPlanet(name, order, rings) {
  // run a SQL query
  await db.query(
    // SQL command to insert a new row into the planets table
    "INSERT INTO planets (name, order_from_sun, has_rings) VALUES ($1, $2, $3)",

    // replace $1, $2, $3 with these values
    [name, order, rings],
  );
}

// -------------------------
// POST ENDPOINT
// -------------------------

// create a POST route at /add-planet
app.post("/add-planet", async (req, res) => {
  // get the planet name from the request body
  const name = req.body.name;

  // get the order from the request body
  const order = req.body.order_from_sun;

  // get whether the planet has rings
  const rings = req.body.has_rings;

  // call the helper function to add the planet to the database
  await addPlanet(name, order, rings);

  // send a response back to confirm it worked
  res.send("Planet added!");
});

// -------------------------
// GET ENDPOINT
// -------------------------

// create a GET route at /get-all-planets
app.get("/get-all-planets", async (req, res) => {
  // run SQL to get all planets from the database
  const result = await db.query("SELECT * FROM planets");

  // send the data back as JSON
  res.json(result.rows);
});
