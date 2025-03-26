const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("API funcionando corectamente");
});

const peliculasRouter = require('./peliculas.routes');
router.use("/peliculas", peliculasRouter);

module.exports = router;
