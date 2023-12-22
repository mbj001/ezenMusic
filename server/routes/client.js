const express = require("express");
const conn = require("../config/mysql");
const { fields } = require("../upload/upload");
const router = express.Router();

router.get("/", (req, res) => {
    // let SelectClientQuery = `SELECT username, userid, userpw, date_format(birth, '%Y-%m-%d') as birth, email, phone,date_format(ticket_date, '%Y-%m-%d') as ticket_date, ticket_num, ticket_type FROM client`;
    const selectClientQuery = `select user_id, name, date_format(birth, '%Y-%m-%d') as birth, email, phone, purchase from member`;
    conn.query(selectClientQuery, (error, selectResult, fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(selectResult)
            res.render("client", {title: "CLIENT", sqlData: selectResult});
            // res.send('ok');
        }
    })
});


//******************************* INSERT *******************************/
router.post('/insert', (req,res)=>{
    const insertQueryData = {
        name: req.body.name,
        user_id: req.body.user_id,
        password: req.body.password,
        birth: req.body.birth,
        email: req.body.email,
        phone: req.body.phone,
        purchase: req.body.purchase
        // ticket_date: req.body.ticket_date,
        // ticket_num: req.body.ticket_num,
        // ticket_type: req.body.ticket_type
    };
    const insertQueryString = `INSERT INTO member (name, user_id, password, birth, email, phone, purchase) VALUES ('${insertQueryData.name}','${insertQueryData.user_id}','${insertQueryData.password}','${insertQueryData.birth}','${insertQueryData.email}','${insertQueryData.phone}', '${insertQueryData.purchase}')`;
    
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
        name: req.body.name,
        user_id: req.body.user_id,
        // password: req.body.userpw,
        birth: req.body.birth,
        email: req.body.email,
        phone: req.body.phone,
        purchase: req.body.purchase   
        // ticket_date: req.body.ticket_date,
        // ticket_num: req.body.ticket_num,
        // ticket_type: req.body.ticket_type
    };
    const updateQueryString = `UPDATE member SET name = '${updateQueryData.name}', birth = '${updateQueryData.birth}', email= '${updateQueryData.email}', phone= '${updateQueryData.phone}' WHERE user_id = '${req.body.user_id}'`;
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
    const deleteQueryString = `DELETE FROM member WHERE user_id = '${req.body.user_id}';`;
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

//******************************* voucher *******************************/
router.post('/showVoucher', (req,res)=>{
    console.log(req.body);
    const selectVoucherQuery = `select user_id, date_format(purchase_date, '%Y-%m-%d') as purchase_date, date_format(renewal_date, '%Y-%m-%d') as renewal_date, plan_type, remaining_number from voucher where user_id = '${req.body.user_id}'`;
    conn.query(selectVoucherQuery, (error, voucher, fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(voucher);
            if(voucher.length === 0){
                let sendData = {
                    haveVoucher: false,
                    user_id: req.body.user_id,
                    plan_type: 'none'
                }
                return res.send([sendData]);
            }else{
                voucher[0].haveVoucher = true;
                return res.send(voucher)
            }
        }
    });
});

router.post('/updateVoucher', (req, res)=>{
    if(req.body.remaining_number === ''){
        req.body.remaining_number = null;
    }
    if(req.body.plan_type === 'none'){
        
    }

    // update or insert
    let updateVoucherQuery = '';
    if(JSON.parse(req.body.haveVoucher)){
        updateVoucherQuery = `update voucher set plan_type = '${req.body.plan_type}', purchase_date = '${req.body.purchase_date}', renewal_date = '${req.body.renewal_date}', remaining_number = ${req.body.remaining_number} where user_id = '${req.body.user_id}'`;
    }else{
        updateVoucherQuery = `insert into voucher (user_id, plan_type, purchase_date, renewal_date, remaining_number) values ('${req.body.user_id}', '${req.body.plan_type}', '${req.body.purchase_date}', '${req.body.renewal_date}', ${req.body.remaining_number})`;
    }
    console.log(updateVoucherQuery)
    conn.query(updateVoucherQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(result);
            conn.query(`update member set purchase = 1 where user_id = '${req.body.user_id}'`, (error, result, fields)=>{
                if(error){
                    console.log(error);
                }else{
                    console.log(result);
                    res.send("1");
                }
            });
        }
    });
});


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