const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const mysql2 = require("mysql2/promise");
require("dotenv").config();
const pool = require("../config/mysqlPool");

module.exports = () =>{
    passport.use( new LocalStrategy({
        usernameField: 'adminId',
        passwordField: 'adminPw',
        passReqToCallback: true,
        session: true
    }, async(req, inputAdminId, inputAdminPw, done)=>{
        const configLogin = {
            isAdmin: req.body.isAdmin
        };
        try{
            const verifiedUserInfo = {
                id: '',
                isAdmin: ''
            };
            if(configLogin.isAdmin === 'administrator'){
                const selectAdminQuery = `SELECT admin_id, admin_pw FROM administrator WHERE admin_id = '${inputAdminId}'`;
                const [selectedInfo] = await pool.query(selectAdminQuery);
                if(selectedInfo){
                    if(selectedInfo[0].admin_pw == inputAdminPw){ 
                        verifiedUserInfo.id = selectedInfo[0].admin_id;
                        verifiedUserInfo.isAdmin = 'admin';
                        done(null, verifiedUserInfo);
                    }else{
                        done(null, false, {message: "비밀번호가 일치하지 않습니다."});
                    }
                }else{
                    done(null, false, {message: "존재하지 않는 사용자입니다."});
                }
            }else if(configLogin.isAdmin === 'client'){
                const getClientDataQuery = `SELECT user_id, password FROM member WHERE user_id = '${inputAdminId}'`;
                const [clientData] = await pool.query(getClientDataQuery);
                if(clientData[0]?.user_id){
                    const doesMatch = await bcrypt.compare(inputAdminPw, clientData[0].password);
                    if(doesMatch){ 
                        verifiedUserInfo.id = clientData[0].user_id;
                        verifiedUserInfo.isAdmin = 'client';
                        done(null, verifiedUserInfo);
                    }else{
                        done(null, false, {message: "비밀번호가 일치하지 않습니다."});
                    }
                }else{
                    done(null, false, {message: "존재하지 않는 사용자입니다."});
                }
            }            
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
}