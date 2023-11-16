const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();

router.get('/info', (req,res)=>{
    const queryString = req.query;
    console.log(queryString);
    const dataFromClient = {
        userid: queryString.id
    }
    const sendDataToClient = {
        username: '',
        email: '',
        ticket_type: '',
        ticket_date: ''
    }
    const getUserInfoQuery = `select * from client where userid = '${dataFromClient.userid}'`;
    console.log(getUserInfoQuery);
    conn.query(getUserInfoQuery, (error, selectResult, fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(selectResult);
            
            res.send(selectResult[0]);
        }
    });
});

router.post('/info', (req,res)=>{
    const dataFromClient = {
        userid: req.body.userid
    }
    const sendDataToClient = {
        username: '',
        email: '',
        ticket_type: '',
        ticket_date: ''
    }
    const getUserInfoQuery = `select username, userid, email, ticket_date, ticket_num, ticket_type from client where userid = '${dataFromClient.userid}'`;
    console.log(getUserInfoQuery);
    conn.query(getUserInfoQuery, (error, selectResult, fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(selectResult);
            
            res.send(selectResult[0]);
        }
    });
});

router.post('/logout', (req,res)=>{
    const dataFromClient = {
        sessionID: req.body.token
    };
    console.log(`user session: ${dataFromClient.sessionID}`);
    const removeSessionQuery = `delete from sessions where session_id = '${dataFromClient.sessionID}' `;
    conn.query(removeSessionQuery, (error, rs, fields)=>{
        if(error){
            console.log(error);
        }else{
            res.send('ok');
        }
    })
});



router.post('/removeInvalidSessions', (req,res)=>{
    const sessionid = req.body.token;
    const clientsid = req.body.clientsid;

    const findInvalidSessionQuery = `select * from sessions where session_id = '${sessionid}' or data like '%${clientsid}%'`;
    conn.query(findInvalidSessionQuery, (error,invalidSessions,fields)=>{
        if(error){
            console.log(error);
        }else{
            if(invalidSessions){
                invalidSessions.forEach((data)=>{
                    const deleteInvalidSessionsQuery = `delete from sessions where session_id = '${data.session_id}'`;
                    conn.query(deleteInvalidSessionsQuery, (error,rs,fields)=>{
                        if(error){
                            console.log(error);
                        }else{
                            console.log('removeInvalidSessions');
                            console.log(`${data.session_id} has been deleted!`);
                        }
                    });
                });
                console.log('delete ok');
                // res.send('reset');
            }
        }
    });
    res.send('세션데이터 체크 완료');
});

router.post('/reissuance', (req,res)=>{
    console.log(req.body);
    res.send('1');
})

module.exports = router;