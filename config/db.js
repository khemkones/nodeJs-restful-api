const mysql = require('mysql');
require('dotenv').config()
const env = process.env.NODE_ENV;
const config = require(__dirname + '/config.json')[env];

// console.log(configss);

const con = mysql.createPool({
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
});

query = (sql, values) => {
  return new Promise((resolve, reject) => {
    con.getConnection(function (err, connection) {
      connection.query(sql, values, (err, result) => {
        if (err) {
          return connection.rollback(function () {
            throw err
          })
        }
        connection.release();
        if (result) {
          resolve(result);
        } else {
          return connection.rollback()
        }
      });
    })

  })
}


module.exports = {
  query,
};