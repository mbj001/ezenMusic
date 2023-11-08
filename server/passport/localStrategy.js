const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const mysql2 = require("mysql2/promise");
require("dotenv").config();

module.exports = () =>{
    passport.use( new LocalStrategy({
        // LocalStategy 객체에 input에서 받아온 정보 전달 => client 로그인할 경우 input name값 따라서 바뀌어야 하는듯
        usernameField: 'adminId',
        passwordField: 'adminPw',
        passReqToCallback: false,
        session: true
    }, async(inputAdminId, inputAdminPw, done)=>{ // 객체 전달 뒤에 콜백함수 실행
        try{
            let pool = mysql2.createPool({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASS,
                database: process.env.MYSQL_DB,
            });
            const adminTable = "administrator";
            const clientTable = "client" // table이 client로 바뀌면 뽑아오는 컬럼명도 userid, userpw로 
            const selectAdminQuery = `SELECT adminid, adminpw FROM ${adminTable} WHERE adminid = '${inputAdminId}'`;
            const [selectedInfo] = await pool.query(selectAdminQuery);
            if(selectedInfo){
                if(selectedInfo[0].adminpw == inputAdminPw){ 
                    done(null, selectedInfo);
                }else{
                    done(null, false, {message: "비밀번호가 일치하지 않습니다."});
                }
            }else{
                done(null, false, {message: "존재하지 않는 사용자입니다."});
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }));
}