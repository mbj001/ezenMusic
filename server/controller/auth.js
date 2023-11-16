const passport = require("passport");

exports.login = (req,res,next) => {
    passport.authenticate('local', (authError, user, info)=>{ // localStrategy 이동 후 done() 호출되면 콜백 실행
        const loginResultToClient = {
            clientID: '',
            sessionID: '',
            loginSucceed: false
        };
        if(authError){
            console.log('if autherror');
            if(req.body.isAdmin === 'client'){
                loginResultToClient.loginSucceed = false;
                return res.send(loginResultToClient);
            }
            console.error(authError);
            return next(authError);
        }
        console.log(user);
        if(!user){
            console.log('if not user');
            if(req.body.isAdmin === 'client'){
                loginResultToClient.loginSucceed = false;
                return res.send(loginResultToClient);
            }
            console.log(info.message);
            return res.redirect(`/?error=${info.message}`);
        }
        console.log("auth.js => login middleware");
        if(user.isAdmin === 'admin'){
            return req.login(user, (loginError)=>{
                if(loginError){
                    console.error(loginError);
                    return next(loginError);
                }
                return res.redirect("/");
            })
        }else if(user.isAdmin === 'client'){
            req.login(user, (loginError)=>{
                if(loginError){
                    console.error(loginError);
                    return next(loginError);
                }
                loginResultToClient.sessionID = req.sessionID;
                loginResultToClient.clientID = user.id;
                loginResultToClient.loginSucceed = true;
                console.log(loginResultToClient);
                return res.send(loginResultToClient);
            });
        }
    })(req,res,next);
}

exports.logout = (req,res) => {
    req.session.destroy();
    req.logout(()=>{
        res.redirect("/");
    })
}