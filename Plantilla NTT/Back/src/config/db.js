require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log("✅ Conectado a PostgreSQL"))
    .catch(err => {
        console.error("❌ Error al conectar a PostgreSQL:", err);
        console.error("Detalles del error:", err.stack);
});

module.exports = pool;