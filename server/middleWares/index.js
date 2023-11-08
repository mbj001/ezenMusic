exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        console.log("********isAuthenticated in middleware/index.js********");
        console.log(req.isAuthenticated());
        res.status(403).send("로그인이 필요합니다.");
    }
};

exports.isNotLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        console.log("isNotLoggined 통과");
        next();
    }else{
        const message = encodeURIComponent("로그인한 상태입니다.");
        res.redirect(`/?error=${message}`);
    }
};