const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("routes => artist.js => router.get('/')");

    res.render("artist", {title: "ARTIST"});
})

module.exports = router;