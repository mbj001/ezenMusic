const express = require("express");
const conn = require("../config/mysql");
const { route } = require("./main");
const router = express.Router();

const mysql2 = require('mysql2/promise');
// const pool = mysql2.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'Qudwns12!',
//     connectionLimit: 10,
//     database: 'flodb'
// });
const pool = require("../config/mysqlPool");



router.get("/", (req, res) => {
    const sql = "select * from likey"
    conn.query(sql, (err, row) =>{
        // console.log(req.query);
        res.render("likey", {title: "LIKEY", row});
        // console.log(id);
    })


    console.log("routes => likey.js => router.get('/')");
});

router.get("/likey_view/:character_id", (req, res) =>{
    const {character_id} = req.params;
    const sql = "select music_list from likey where character_id = ?"
    conn.query(sql, [character_id], (err, row)=>{
        // const k_likey_username = character_id;
        if(err){
            console.log(err);
        }else{
            // console.log(row[0].music_list.length);
            console.log(req.body);
            
            const music_list = row[0].music_list
            let a;
            for(i=0; i < music_list.length; i++){
                music_list[i]
            }
            // const k_music_title = (Object.values(row[0].title));
            // console.log(k_music_title);
            // let a;
            // for(i = 0; i < k_music_title.length; i++){
            //     console.log(k_music_title[i]);
            // }
            res.render("likey_view", {title: character_id, row, music_list});
        }
    });
});
// 좋아요를 여러개 눌렀을 때 어떤 로직으로 컬럼에 담겨야 하나

router.get('/likey_insert/:character_id', (req, res) =>{
    const {character_id} = req.params;
    // const select_musicNo_sql = "select music_list from likey where character_id = ?";
    // conn.query(select_musicNo_sql, [character_id])
    res.render('likey_insert', {title: character_id});
});

router.post('/likey_insert/:character_id', (req, res) =>{
    const {character_id} = req.params;
    let aa;
    const select_musicNo_sql = "select music_list from likey where character_id = ?";

    conn.query(select_musicNo_sql, [character_id], (err, row, fields) => {
        if(err){
            console.error(err)
        }
        else{
            aa = row[0].music_list;
            console.log(req.body);
            aa.push(Number(req.body.add_list));
            console.log(aa);
            const insert_musicNo_sql = `update likey set music_list = "[${aa}]" where character_id = ?`;

            conn.query(insert_musicNo_sql, [character_id], (err, row, fields) => {
                if(err){
                    console.error(err);
                }
                else{
                    res.redirect("/likey");
                }
            });
        }
    });
});

router.get("/likey_view/likey_delete/:character_id", (req, res) => {
    let aa;
    const {character_id} = req.params;
    const sql = 'select music_list from likey where character_id = ?'
    conn.query(sql, [character_id], (err, row) =>{
        if(err){
            console.log(err)
        }else{
            aa = row[0].music_list;
            // console.log(aa);
            // for(i=0; i < aa.length; i++){
            //     aa.splice(i, 1);
            // }
            console.log(aa);
            res.render("likey_delete" , {title: character_id, num: aa});
        }
    })
});

router.post('/likey_view/likey_delete/:character_id', (req, res) =>{
    // console.log(req.body);
    const {character_id} = req.params;
    let aa;
    const select_musicNo_sql = "select music_list from likey where character_id = ?";
    conn.query(select_musicNo_sql, [character_id], (err, row, fields) =>{
        if(err){
            console.error(err)
        }
        else{
            console.log(req.body);
            aa = row[0].music_list;
            // aa.push(Number(req.body.del_num));
            console.log("1");
            console.log(aa.length);

            for(let i = 0; i < aa.length; i++){
                console.log(aa.length);
                if(aa[i] == Number(req.body.del_num)){
                    console.log("i(1): " + i);
                    aa.splice(i, 1);
                    // console.log("****");
                    // continue;
                }
                console.log("i(2): " + i);
            }
            console.log("2");
            console.log(aa);
            const insert_query = `update likey set music_list = "[${aa}]" where character_id = ?`;

            conn.query(insert_query, [character_id], (err, row, fields) => {
                if(err){
                    console.log('1');
                    console.error(err);
                    console.log('2');
                }
                else{
                    // console.log('3');
                    res.redirect("/likey", row, {title: character_id});
                    // console.log('4');
                }
            });
        }
    })
});

// router.get('/storage/likey/:character_id', async(req, res) =>{
//     try{
//         console.log('1');
//         const {character_id} = req.params;
//         const sql = `select music_list from likey where character_id = ${character_id}`
//         let [result] = await pool.query(sql);
//         console.log(result);
//         res.send(result);
//         return result;
//     }catch(err){
//         return err;
//     }
// })




module.exports = router;

/* 

router.post("/test_minus_form", (req, res) => {
    console.log("routes => main.js => app.post('/test_minus_form')");

    console.log(req.body);
    let aa;
    const select_main_query = "select * from test where num=10";

    conn.query(select_main_query, (err, select_main_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            aa = select_main_result[0].singer;
            // aa.push(Number(req.body.test));
            console.log(aa);
            for(let i=0; i<aa.length; i++){
                if(aa[i] == Number(req.body.test)){
                    aa.splice(i, 1);
                }
            }
            console.log(aa);
            const insert_query = `update test set singer="[${aa}]" where num=10`;

            conn.query(insert_query, (err, insert_result, fields) => {
                if(err){
                    console.error(err);
                }
                else{
                    res.render("main", {title: "메인페이지", client_info: select_main_result[0]});
                }
            });
        }
    })
})
*/