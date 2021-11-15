const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const redis = require('redis');
const {
  redisHost,
  redisPort,
  mysqlHost,
  mysqlPort,
  mysqlUser,
  mysqlPassword,
  mysqlDatabase,
} = require('./config');

// Express App Setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MYSQL Setup
const mysqlClient = mysql.createConnection({
  host: mysqlHost,
  port: mysqlPort,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

mysqlClient.query(
  'CREATE TABLE IF NOT EXISTS fib_values ( number INT );',
  (err, result, fields) => {
    if (err) {
      console.error('[err]: ', err);
      console.error('[result]: ', result);
      console.error('[fields]: ', fields);
    }
  }
);

mysqlClient.on('error', (err) => {
  console.log('Lost MYSQL connection: ', err);
});

// Redis Client Setup
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000,
});

const pub = redisClient.duplicate();

// Express route handlers
app.get('/', (req, res) => {
  res.send('Welcome to Complex Api');
});

app.get('/fib_values/all', async (req, res) => {
  const fibValues = await mysqlClient
    .promise()
    .query('SELECT * from fib_values');

  res.send(fibValues[0]);
});

app.get('/fib_values/current', async (req, res) => {
  await redisClient.hgetall('fib_values', (err, reply) => {
    res.send(reply);
  });
});

app.post('/fib_values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  // redisClient.hset('fib_values', index, () => {});
  pub.publish('insert', index);
  mysqlClient.promise().query('INSERT INTO fib_values(number) VALUES(?)', [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log('Listen on port 5000');
});
