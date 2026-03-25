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

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


// -------------------------
// HELPER FUNCTION
// -------------------------

// this function is used to add a planet into the database
async function addPlanet(name, order, rings) {

  // we are running a SQL command
  await db.query(

    // this says: put a new planet into the planets table
    "INSERT INTO planets (name, order_from_sun, has_rings) VALUES ($1, $2, $3)",

    // these are the values we are putting into the table
    // $1 = name, $2 = order, $3 = rings
    [name, order, rings],
  );
}


// -------------------------
// POST ENDPOINT
// -------------------------

// this runs when we send data to /add-planet
app.post("/add-planet", async (req, res) => {

  // we take the planet name from what was sent
  const name = req.body.name;

  // we take the order number from what was sent
  const order = req.body.order_from_sun;

  // we take if it has rings (true or false)
  const rings = req.body.has_rings;

  // now we send that data to the helper function
  // this will save it in the database
  await addPlanet(name, order, rings);

  // we send back a message to say it worked
  res.send("Planet added!");
});


// -------------------------
// GET ENDPOINT
// -------------------------

// this runs when we go to /get-all-planets
app.get("/get-all-planets", async (req, res) => {

  // we ask the database: "give me all the planets"
  const result = await db.query("SELECT * FROM planets");

  // we send the planets back so we can see them
  res.json(result.rows);
});