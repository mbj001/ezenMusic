const passport = require("passport");
const local = require("./localStrategy");
const mysql2 = require("mysql2/promise");

module.exports = () =>{
    //? req.login(user, ...) 가 실행되면, serializeUser가 실행된다.
    passport.serializeUser((user, done)=>{  // -> user는 localStrategy의 인증부분에서 인증받아 넘어온 값
        done(null, user[0].adminid); // done의 첫번째 인자 : 에러 발생할 경우 실행 , 두번째 인자 : 로그인 성공하면 session에 저장할 값
    });

    passport.deserializeUser(async (id,done)=>{
        try{
            let pool = await mysql2.createPool({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASS,
                database: process.env.MYSQL_DB
            });
            const selectAdminQuery = `SELECT * FROM administrator WHERE adminid = '${id}'`;
            const [adminInfo] = await pool.query(selectAdminQuery);
            done(null, adminInfo);
        }catch(error){
            console.log(error);
        }
    });
    local();
}