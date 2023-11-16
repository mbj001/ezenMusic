const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();

router.post('/initializeSessions',(req, res)=>{
    const selectAllSessionsQuery = `select * from sessions`;
    conn.query(selectAllSessionsQuery, (error,selectAllSessionsResult, fields)=>{
        if(error){
            console.log(error);
        }else{
            selectAllSessionsResult.forEach((session)=>{
                const sessionData = JSON.parse(session.data);
                const now = new Date();
                const sessionExpireDate = new Date(sessionData.cookie.expires);
                if(sessionExpireDate - now <= 0){
                    // 만료된 세션 존재 -> 삭제
                    const deleteExpiredSessionQuery = `delete from sessions where session_id = '${session.session_id}'`;
                    conn.query(deleteExpiredSessionQuery, (error,rs,fields)=>{
                        if(error){
                            console.log(error);
                        }else{
                            console.log('initializeSessions');
                            console.log(`${session.session_id} has been deleted!`);
                        }
                    });
                }else{
                    // 만료된 세션 없음
                }
            });
        }
    });
    res.send('removed all expired sessions !!');
});

module.exports = router;