module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  mysqlHost: process.env.MYSQL_HOST,
  mysqlPort: process.env.MYSQL_PORT,
  mysqlUser: process.env.MYSQL_USER || 'root',
  mysqlPassword: process.env.MYSQL_PASSWORD || 'root',
  mysqlDatabase: process.env.MYSQL_DATABASE || 'test',
};
