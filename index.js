//Heroku Link
//https://cs-3083.herokuapp.com/

const express = require('express'); // init express app
const app = express(); // calls the app
//Setting up port dynaically with Heroku
const port = process.env.PORT || 4000; // defines what port to use (most likely gonna be 4000)
const cors = require('cors'); // prevents CORS error
const pool = require('./db'); // stores the db credentials

app.use(cors());
app.use(express.json());

console.log('Running index.js');
// Routes

// CREATE A CUSTOMER
app.post('/customers', async (req, res) => {
  try {
    const user = req.body; // body input must be in SQL form
    console.log(user);
    const newUser = await pool.query(
      'INSERT INTO public."customer" VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user.name, user.email, user.password, user.phone, user.birth_date]
    );

    res.json(newUser);
  } catch (error) {
    console.log(error.message);
  }
});

// CREATE A AIRPLANE
app.post('/airplanes', async (req, res) => {
  try {
    const airplane = req.body;
    const airplaneQuery = await pool.query(
      'INSERT INTO public."airplane" VALUES ($1, $2, $3) RETURNING *',
      [airplane.plane_ID, airplane.airline, airplane.num_of_seats]
    );

    res.json(airplaneQuery);
  } catch (error) {
    console.log(error.message);
  }
});

// GET ALL CUSTOMERS
app.get('/customers', async (req, res) => {
  try {
    const users = await pool.query('SELECT * from public.customer');
    res.json(users.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// GET ALL CUSTOMERS
app.get('/staff', async (req, res) => {
  try {
    const staff = await pool.query('SELECT * from public.staff');
    res.json(staff.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// GET ALL FLIGHTS
app.get('/flights', async (req, res) => {
  try {
    const flight = await pool.query('SELECT * from public.flight');
    res.json(flight.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// GET ALL AIRPLANES
app.get('/airplanes', async (req, res) => {
  try {
    const airplane = await pool.query('SELECT * from public.airplane');
    res.json(airplane.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// GET A SPECIFIC CUSTOMER
app.get('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await pool.query(
      'SELECT * from public.customer WHERE name = $1',
      [id]
    );
    res.json(users.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// GET A SPECIFIC STAFF
app.get('/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await pool.query(
      'SELECT * from public.staff WHERE username = $1',
      [id]
    );
    res.json(staff.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// GET AIRLINE-SPECIFIC AIRPLANES
app.get('/airplanes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const airplanes = await pool.query(
      'SELECT * from public.airplane WHERE airline = $1',
      [id]
    );
    res.json(airplanes.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// GET AIRLINE-SPECIFIC FLIGHTS
app.get('/flights/:airline', async (req, res) => {
  try {
    const { airline } = req.params;
    console.log(airline);
    const flights = await pool.query(
      'SELECT * from public.flight WHERE airline = $1',
      [airline]
    );
    res.json(flights.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// GET SEARCHED FLIGHTS
app.get('/flights/from/:from/to/:to', async (req, res) => {
  try {
    const id = req.params;
    const from = id['from'] || '';
    const to = id['to'] || '';
    // const depart = id['depart'];
    // const arrival = id['arrival'];
    const flights = await pool.query(
      'SELECT * from public.flight WHERE "from" = $1 and "to" = $2',
      [from, to]
    );
    res.json(flights.rows);
  } catch (error) {
    console.log('hello');
    console.log(error.message);
  }
});

// UPDATE A CUSTOMER
app.put('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    // Make sure to edit the SQL
    const users = await pool.query(
      'UPDATE public.customer SET name = $1 WHERE name = $2',
      [name, id]
    );
    res.json('User was updated!');
  } catch (error) {
    console.log(error.message);
  }
});

// DELETE A CUSTOMER
app.delete('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await pool.query(
      'DELETE from public.customer WHERE name = $1',
      [id]
    );
    res.json(users.rows);
  } catch (error) {
    console.log(error.message);
  }
});

//Purchase a ticket
app.post('/tickets/customer/:customer/flight/:flightNum/airline/:airline/ ', async (req, res) => {
    try {
      const {id} = req.params;
      const ticket= req.body;
      const ticketQuery = await pool.query(
        'INSERT INTO public.ticket VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [ticket.ticket_ID, ticket.sold_price, ticket.date, ticket.time, ticket.time, ticket.card_type, ticket.card_number, ticket.name_on_card, ticket.exp_date]
      );
  
      res.json(ticketQuery);
    } catch (error) {
      console.log(error.message);
    }
  });

// Selecting all flights from a customer 
app.get('/customers/flights/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const flightsQuery = await pool.query(
      'SELECT * from public.purchase WHERE email = $1',
      [id]
    );
    res.json(flightsQuery.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// Calculating the total amount of money a customer spent on flights
app.get('/customers/flights/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const priceQuery = await pool.query(
      'SELECT sum(sold_price) from public.purchase WHERE email = $1',
      [id]
    );
    res.json(priceQuery);
  } catch (error) {
    console.log(error.message);
  }
});

// Grabbing the most frequent customer for a specific airline
app.get('/customers/airlines/:airline', async (req, res) => {
  try {
    const {airline} = req.params;
    const frequentFlyerQuery = await pool.query(
      'SELECT name FROM public.purchase natural join public.customer WHERE airline = $1 and email NOT IN\
      (SELECT A.email FROM public.purchase as A and public.purchase as B WHERE \
      COUNT(distint A.email) < COUNT(distint B.email));',
      [airline]
    );
    res.json(frequentFlyerQuery);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
