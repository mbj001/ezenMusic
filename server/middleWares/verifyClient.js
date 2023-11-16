// const conn = require("../config/mysql");
const mysql2 = require("mysql2/promise");

exports.verify = async( req, res, next) => {
    // 들어오는 모든 요청에 대해 post 일 경우 req.body로 connect.sid 받아옴
    const pool =  mysql2.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB
    });
    var token;
    var sendMessage = {
        valid: false,
        message: '유효하지 않은 토큰입니다.'
    }
    token = req.query?.token;
    if(token == undefined){
        token = req.body?.token;
    }
    // if(req.query){
    //     token = req.query.token;
    // }else if(req.body){
    //     token = req.body.token;
    // }
    try{
        const query =  `select * from sessions where session_id = '${token}'`;
        console.log('미들웨어에서 받은 토큰');
        console.log(token);
        console.log('미들웨어 쿼리문');
        console.log(query);
        const [result, fields] = await pool.query(query);
        if(result[0] != undefined && result[0] != null){
            console.log('next');
            next();
        }else{
            res.send(sendMessage);
        }
    }catch(error){
        console.log(error);
    }    
};

/**
 * 미들웨어에서 체크해야 할 요청
 * 1. 내 정보 열람
 * 2. 보관함/ 내 리스트, 좋아요, 최근감상
 */