const express = require("express");
const router = express.Router();
const db = require('../config/db');

router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM pelicula;"); 
        res.json(result.rows); 
    } catch (error) {
        console.error("Error al obtener películas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;