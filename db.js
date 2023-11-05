// const Pool = require("pg").Pool;
// const pool = new Pool({
// host:'postgresql://lisainyange:K57LXDxesN1W0lEivsmrX8t3NbPasCOf@dpg-cl1o210p2gis73fgo9qg-a/lisainyangedb',
// user:'lisainyange',
// password:'K57LXDxesN1W0lEivsmrX8t3NbPasCOf',
// port: 5432,
// database:'lisainyangedb'
// });
// module.exports = pool;

// const Pool = require("pg").Pool;
// const pool = new Pool({
//   user: 'lisainyange',
//   password: 'K57LXDxesN1W0lEivsmrX8t3NbPasCOf',
//   host: 'dpg-cl1o210p2gis73fgo9qg-a', // Just the hostname goes here
//   port: 5432,
//   database: 'lisainyangedb'
// });
// module.exports = pool;

// const Pool = require("pg").Pool;
// const connectionString = 'postgres://lisainyange:K57LXDxesN1W0lEivsmrX8t3NbPasCOf@dpg-cl1o210p2gis73fgo9qg-a.oregon-postgres.render.com/lisainyangedb&sslmode=require';
// const pool = new Pool({
//   connectionString: connectionString
// });
// module.exports = pool;


const { Pool } = require("pg");

// const connectionString = 'postgres://lisainyange:K57LXDxesN1W0lEivsmrX8t3NbPasCOf@dpg-cl1o210p2gis73fgo9qg-a.oregon-postgres.render.com/lisainyangedb?sslmode=require';
const connectionString = 'postgres://linyange:LcTxnl7KjtCLDGrkySOUD3TYa4kXG0ET@dpg-cl1pge0p2gis73fim56g-a.oregon-postgres.render.com/postgresdb_1wwf?sslmode=require';

const pool = new Pool({ connectionString });

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database:', res.rows[0].now);
  }
});

module.exports = pool;
