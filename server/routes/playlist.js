const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("routes => playlist.js => router.get('/')");

    res.render("playlist", {title: "PLAYLIST"});
})

module.exports = router;