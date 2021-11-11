const pg = require('pg');

let connection;
exports.connect = function (connectionString) {
  if (connection) {
    const oldConnection = connection;
    connection = null;
    return oldConnection.end().then(() => exports.connect(connectionString));
  }
  // TODO: Use Pool instead of Client (Ref: https://node-postgres.com/features/pooling)
  //connection = new pg.Client({
  connection = new pg.Pool({
    connectionString,
  });
  return connection.connect().catch(function (error) {
    connection = null;
    throw error;
  });
};

// TODO: Add a new function queryPromise which returns a Promise instead of using a callback function
exports.query = function (text, params, callback) {
  if (!connection) {
    return callback(new Error('Not connected to database'));
  }
  const start = Date.now();
  return connection.query(text, params, function (error, result) {
    const duration = Date.now() - start;
    console.log('executed query', { text, duration });
    callback(error, result);
  });
};

exports.queryPromise = function (text, params) {
  if (!connection) {
    return Promise.reject(new Error('Not connected to database'));
  }
  const start = Date.now();
  return connection.query(text, params).then(function (result) {
    const duration = Date.now() - start;
    console.log('executed query', { text, duration });
    return result;
  });
};
