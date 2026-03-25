// useState = holds our data 
// useEffect = runs code when the page opens
import { useEffect, useState } from "react";

// this is our App (our whole page)
function App() {
  // this is where we will keep our planets
  // we start with an empty list
  const [planets, setPlanets] = useState([]);

  // this function goes to the server and gets planets
  async function getAllPlanets() {
    // ask the server: "give me all the planets"
    const response = await fetch("/api/get-all-planets");

    // open the data we got back
    const data = await response.json();

    // put the planets into our box (state)
    setPlanets(data);
  }

  // this runs when the page first opens
  useEffect(() => {
    // go get the planets right away
    getAllPlanets();
  }, []);

  // this is what we show on the screen
  return (
    // this holds everything on the page
    <div>
      {/* this is the title */}
      <h1>Planets in Order from the Sun</h1>

      {/* go through each planet one by one */}
      {planets.map((planet) => (
        // show each planet
        <p key={planet.name}>
          {/* show the planet name and number */}
          {planet.name} -  {planet.order_from_sun}
        </p>
      ))}
    </div>
  );
}

// let React use this App
export default App;
