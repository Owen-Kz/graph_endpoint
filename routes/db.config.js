import { config } from "dotenv"
import sql from "mysql2"
config();
const db = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
 
export {
    db
}