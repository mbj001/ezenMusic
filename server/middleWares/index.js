exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.send("로그인이 필요합니다.");
        // res.send(`<script>alert("세션이 만료되어 자동 로그아웃됩니다."); location.href='/';</script>`);
    }
};

exports.isNotLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        console.log("isNotLoggined 통과");
        // console.log(req.body);
        next();
    }else{
        const message = encodeURIComponent("로그인한 상태입니다.");
        res.redirect(`/?error=${message}`);
    }
};