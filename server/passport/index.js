const passport = require("passport");
const local = require("./localStrategy");
const mysql2 = require("mysql2/promise");
const pool = require("../config/mysqlPool");

module.exports = () =>{
    //? req.login(user, ...) 가 실행되면, serializeUser가 실행된다.
    passport.serializeUser((user, done)=>{  // -> user는 localStrategy의 인증부분에서 인증받아 넘어온 값
        console.log(user);
        done(null, user.id); // done의 첫번째 인자 : 에러 발생할 경우 실행 , 두번째 인자 : 로그인 성공하면 session에 저장할 값
    });

    passport.deserializeUser(async (req, id, done)=>{ // id : admin
        try{
            // let pool = mysql2.createPool({
            //     host: process.env.MYSQL_HOST,
            //     user: process.env.MYSQL_USER,
            //     password: process.env.MYSQL_PASS,
            //     database: process.env.MYSQL_DB
            // });
            console.log("deserializeUser");
            
            if(req.body?.clientLogin){
                const selectClientQuery = `SELECT * FROM member WHERE user_id = '${req.body.userid}'`;
                const [clientInfo] = await pool.query(selectClientQuery);
                done(null, clientInfo);
            }else{
            }
            const selectAdminQuery = `SELECT * FROM administrator WHERE admin_id = '${id}'`;
            const [adminInfo] = await pool.query(selectAdminQuery);
            done(null, adminInfo);
        }catch(error){
            console.log(error);
        }
    });
    local();
}