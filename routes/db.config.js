
const { config } = require('dotenv');
const sql = require('mysql2'); // Use require instead of import


config();
const db = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
 
module.exports = { 
    db
}