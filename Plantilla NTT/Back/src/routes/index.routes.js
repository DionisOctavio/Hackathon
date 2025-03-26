const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("API funcionando corectamente");
});

module.exports = router;
