const express = require("express");
const router = express.Router();

const { isLoggedIn, isNotLoggedIn} = require("../middleWares/index");
const { login, logout } = require("../controller/auth");

router.use((req,res,next)=>{
    // console.log(req.body);
    res.locals.user = req.user;
    next();
});


router.get("/", (req, res) => {
    console.log("routes => main.js => router.get('/')");
    res.render("main", {title: "MAIN"});
})

//아래 두줄 추가
router.post('/login', isNotLoggedIn, login); 
// router.get('/logout', isLoggedIn, logout);

module.exports = router;