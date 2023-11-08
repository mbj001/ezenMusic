const express = require("express");
const conn = require("../config/mysql");
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
        }
    })
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
            // console.log(updateResult);
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

module.exports = router;