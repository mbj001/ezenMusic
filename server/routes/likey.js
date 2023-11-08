const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("routes => likey.js => router.get('/')");

    res.render("likey", {title: "LIKEY"});
})

module.exports = router;