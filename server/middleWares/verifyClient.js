// const conn = require("../config/mysql");
const mysql2 = require("mysql2/promise");
const pool = require("../config/mysqlPool");

exports.verify = async( req, res, next) => {
    // const pool =  mysql2.createPool({
    //     host: process.env.MYSQL_HOST,
    //     user: process.env.MYSQL_USER,
    //     password: process.env.MYSQL_PASS,
    //     database: process.env.MYSQL_DB
    // });
    var sendMessage = {
        valid: false,
        message: '유효하지 않은 토큰입니다.'
    }
    var token;
    token = req.query?.token;
    if(token == undefined){
        token = req.body?.token;
    }
    try{
        const query =  `SELECT * FROM sessions WHERE session_id = '${token}'`;
        const [result, fields] = await pool.query(query);
        if(result[0] != undefined && result[0] != null){
            // console.log('next');
            next();
        }else{
            res.send(sendMessage);
        }
    }catch(error){
        console.log(error);
    }    
};