require("dotenv").config();

const express = require("express"); 
const cors = require("cors");
const port = 4000;
const pool = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});