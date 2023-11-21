const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const mysql2 = require("mysql2/promise");
require("dotenv").config();

module.exports = () =>{
    passport.use( new LocalStrategy({
        // LocalStategy 객체에 input에서 받아온 정보 전달 => client 로그인할 경우 input name값 따라서 바뀌어야 하는듯
        usernameField: 'adminId',
        passwordField: 'adminPw',
        passReqToCallback: true,
        session: true
    }, async(req, inputAdminId, inputAdminPw, done)=>{ // 객체 전달 뒤에 콜백함수 실행
        const configLogin = {
            isAdmin: req.body.isAdmin
        };
        try{
            const verifiedUserInfo = {
                id: '',
                isAdmin: ''
            };
            const pool = mysql2.createPool({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASS,
                database: process.env.MYSQL_DB,
            });
            console.log(configLogin);
            if(configLogin.isAdmin === 'administrator'){
                const selectAdminQuery = `SELECT adminid, adminpw FROM administrator WHERE adminid = '${inputAdminId}'`;
                const [selectedInfo] = await pool.query(selectAdminQuery);
                console.log("*");
                if(selectedInfo){
                    
                    if(selectedInfo[0].adminpw == inputAdminPw){ 
                        console.log(selectedInfo);
                        verifiedUserInfo.id = selectedInfo[0].adminid;
                        verifiedUserInfo.isAdmin = 'admin';
                        console.log(verifiedUserInfo);
                        done(null, verifiedUserInfo);
                    }else{
                        done(null, false, {message: "비밀번호가 일치하지 않습니다."});
                    }
                }else{
                    done(null, false, {message: "존재하지 않는 사용자입니다."});
                }
            }else if(configLogin.isAdmin === 'client'){
                console.log('localstrategy -> client login');
                // console.log(inputAdminId);
                const selectClientQuery = `SELECT userid, userpw FROM client WHERE userid = '${inputAdminId}'`;
                const [selectedInfo] = await pool.query(selectClientQuery);
                console.log(selectedInfo);
                if(selectedInfo[0]?.userid){
                    if(selectedInfo[0]?.userpw == inputAdminPw){ 
                        verifiedUserInfo.id = selectedInfo[0].userid;
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