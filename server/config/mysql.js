const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const mysqlConnect = {
    init: function(){
        return mysql.createConnection({
            host: process.env.MYSQL_HOST,
            database: process.env.MYSQL_DB,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            port: process.env.MYSQL_PORT,
            charset: process.env.MYSQL_CHARSET
        })
    },
    
    open: function(conn){
        conn.connect(function(err){
            if(err) {
                console.error('MYSQL connection failed');
                console.error('Error Code :' + err.code);
                console.error('Error Message : ' + err.message);
            }else{
                console.log("MYSQL Connect Complete!!!")
            }
        });
    }
}


// mysql 연결
// const mysqlConn = require("../config/mysql");
// const conn = mysqlConn.init();
// mysqlConn.open(conn); 
const conn = mysqlConnect.init();
mysqlConnect.open(conn);

module.exports = conn;