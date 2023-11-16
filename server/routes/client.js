const express = require("express");
const conn = require("../config/mysql");
const { fields } = require("../upload/upload");
const router = express.Router();

/**
 * 추가할 컬럼 있으면 ? 
 */

router.get("/", (req, res) => {
    let SelectClientQuery = `SELECT username, userid, userpw, date_format(birth, '%Y-%m-%d') as birth, email, phone,date_format(ticket_date, '%Y-%m-%d') as ticket_date, ticket_num, ticket_type FROM client`;
    conn.query(SelectClientQuery, (error,selectResult,fields)=>{
        if(error){
            console.log(error);
        }else{
            res.render("client", {title: "CLIENT", sqlData: selectResult});
            // res.send('ok');
        }
    })
});
router.post('/',(req,res)=>{
    console.log('post ok');
    res.send('1');
})

//******************************* INSERT *******************************/
router.post('/insert', (req,res)=>{
    const insertQueryData = {
        username: req.body.username,
        userid: req.body.userid,
        userpw: req.body.userpw,
        birth: req.body.birth,
        email: req.body.email,
        phone: req.body.phone,
        ticket_date: req.body.ticket_date,
        ticket_num: req.body.ticket_num,
        ticket_type: req.body.ticket_type
    };
    const insertQueryString = `INSERT INTO client (username, userid, userpw, birth, email, phone, ticket_date, ticket_num, ticket_type) VALUES ('${insertQueryData.username}','${insertQueryData.userid}','${insertQueryData.userpw}','${insertQueryData.birth}','${insertQueryData.email}','${insertQueryData.phone}','${insertQueryData.ticket_date}','${insertQueryData.ticket_num}','${insertQueryData.ticket_type}')`;
    
    conn.query(insertQueryString,(error,insertResult,fields)=>{
        if(error){
            console.log(error);
            res.send("0");
        }else{
            console.log('insert ok');
            res.send("1");
        }
    });
});
//******************************* UPDATE *******************************/
router.post('/update', (req,res)=>{
    const updateQueryData = {
        username: req.body.username,
        userid: req.body.userid,
        userpw: req.body.userpw,
        birth: req.body.birth,
        email: req.body.email,
        phone: req.body.phone,
        ticket_date: req.body.ticket_date,
        ticket_num: req.body.ticket_num,
        ticket_type: req.body.ticket_type
    };
    const updateQueryString = `UPDATE client SET username = '${updateQueryData.username}', userpw = '${updateQueryData.userpw}',birth = '${updateQueryData.birth}', email= '${updateQueryData.email}', phone= '${updateQueryData.phone}', ticket_date= '${updateQueryData.ticket_date}', ticket_num= '${updateQueryData.ticket_num}', ticket_type= '${updateQueryData.ticket_type}' WHERE userid = '${req.body.userid}'`;
    conn.query(updateQueryString, (error,updateResult,fields)=>{
        if(error){
            console.log(error);
            res.send("0");
        }else{
            console.log(updateResult);
            res.send("1");
        }
    });
});
//******************************* DELETE *******************************/
router.post('/delete', (req,res)=>{
    const userid = req.body.userid;
    const deleteQueryString = `DELETE FROM client WHERE userid = '${userid}';`;
    conn.query(deleteQueryString, (error,deleteResult,fields)=>{
        if(error){
            console.log(error);
            res.send("0");
        }else{
            console.log('delete ok');
            res.send("1");
        }
    });
});

//******************************* CLIENT REQUEST *******************************/
// get : querystring 이용
// router.get('/find', (req,res)=>{
//     console.log("get ok");
//     const queryString = req.query;
//     const dataFromClient = {
//         phoneData: queryString.phone,
//         nameData: queryString.name
//     }
//     const sendDataToClient = {
//         userid: '',
//         ticket_type: '',
//         emptyData: true,
//         databaseError: false,
//         databaseErrorLog: ''
//     }
//     const findQuery = `select userid, ticket_type from client where phone = '${dataFromClient.phoneData}' and username = '${dataFromClient.nameData}'`;
//     conn.query(findQuery, (error, findResult, fields)=>{
//         if(error){
//             console.log(error.message);
//             sendDataToClient.databaseError = true;
//             sendDataToClient.databaseErrorLog = error?.message;
//             res.send(sendDataToClient);
//         }else{
//             sendDataToClient.userid = findResult[0]?.userid;
//             sendDataToClient.ticket_type = findResult[0]?.ticket_type;
//             if(sendDataToClient.userid && sendDataToClient.ticket_type){
//                 sendDataToClient.emptyData = false;
//             }
//             res.send(sendDataToClient);
//         }
//     });
// });

router.post('/find', (req,res)=>{
    console.log("post ok");
    const dataFromClient = {
        phoneData: req.body.phone,
        nameData: req.body.name
    }
    const sendDataToClient = {
        userid: '',
        ticket_type: '',
        emptyData: true,
        databaseError: false,
        databaseErrorLog: ''
    }
    const findQuery = `select userid, ticket_type from client where phone = '${dataFromClient.phoneData}' and username = '${dataFromClient.nameData}'`;
    conn.query(findQuery, (error, findResult, fields)=>{
        if(error){
            console.log(error.message);
            sendDataToClient.databaseError = true;
            sendDataToClient.databaseErrorLog = error?.message;
            res.send(sendDataToClient);
        }else{
            console.log(findResult);
            
            sendDataToClient.userid = findResult[0]?.userid;
            sendDataToClient.ticket_type = findResult[0]?.ticket_type;

            if(sendDataToClient.userid && sendDataToClient.ticket_type){
                sendDataToClient.emptyData = false;
            }
            res.send(sendDataToClient);
            
        }
    });
});

router.post('/validate', (req,res)=>{
    const dataFromClient = {
        useridData: req.body.userid,
        emailData: req.body.email,
        birthData: req.body.birth
    };
    const sendDataToClient = {
        valid: false,
        databaseError: false,
        databaseErrorLog: ''
    };
    const validateQuery = `select username from client where userid = '${dataFromClient.useridData}' and email = '${dataFromClient.emailData}' and birth = '${dataFromClient.birthData}'`;
    conn.query(validateQuery, (error, result, fields)=>{
        if(error){
            console.log(error.message);
            sendDataToClient.databaseError = true;
            sendDataToClient.databaseErrorLog = error?.message;
            res.send(sendDataToClient);
        }else{
            console.log(result);
            result[0]?.username ? sendDataToClient.valid = true : sendDataToClient.valid = false;
            console.log(sendDataToClient);
            res.send(sendDataToClient);
            
        }
    });
});
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
    const getUserInfoQuery = `select * from client where userid = '${dataFromClient.userid}'`;
    conn.query(getUserInfoQuery, (error, selectResult, fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(selectResult);
            res.send(selectResult);
        }
    });
});


module.exports = router;