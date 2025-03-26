// INICIALIZAMOS DEPENDENCIAS
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require('./src/config/db');
const port = 3000;
const routes = require('./src/routes/index.routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", routes);

// ESCUCHA DE PUERTO
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});