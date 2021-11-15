const { redisHost, redisPort } = require('./config');
const redis = require('redis');

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

// function fib(index) {
//   if (index === 0) {
//     return 0;
//   }

//   if (index < 2) {
//     return 1;
//   }

//   let i = 1;
//   let j = 1;
//   for (let k = 0; k < index - 2; k++) {
//     tmp = i + j;
//     i = j;
//     j = tmp;
//   }

//   return j;
// }

function fib(index) {
  if (index === 0) {
    return 0;
  }

  if (index < 2) {
    return 1;
  }

  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  console.log(
    "Subscriber received message in channel '" + channel + "': " + message
  );

  redisClient.hset('fib_values', message, fib(parseInt(message)));
});

sub.subscribe('insert');
