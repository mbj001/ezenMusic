const passport = require("passport");

exports.login = (req,res,next) => {
    passport.authenticate('local', (authError, user, info)=>{ // localStrategy 이동 후 done() 호출되면 콜백 실행
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?error=${info.message}`);
        }
        console.log("auth.js => login middleware");
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect("/");
        })
    })(req,res,next);
}

exports.logout = (req,res) => {
    req.session.destroy();
    req.logout(()=>{
        res.redirect("/");
    })
}