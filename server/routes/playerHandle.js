const express = require("express");
const conn = require("../config/mysql")
// const cors = require("cors");

const router = express.Router();

router.post("/changeNowMusic", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/playerHandle')");

    const select_playerlist_query = `update playerlist set now_play_music = ? where ?`;
    conn.query(select_playerlist_query, [req.body.id, {userid: req.body.userid}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.json(1);
        }
    })
    

});


router.post("/addplayerlist", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/addplayerlist')");

    const select_playerlist_query = `select music_list from playerlist where ?`;
    conn.query(select_playerlist_query, [{userid: req.body.userid}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            let array = select_playerlist_result[0].music_list;
            for(let i=0; i<array.length; i++){
                if(Number(req.body.id) === array[i]){
                    // 중복 곡 있으면
                    // res.json(-1);
                    array.splice(i, 1);
                }
            }
            array.push(Number(req.body.id));
            const update_playerlist_query = `update playerlist set music_list = "[?]", now_play_music = ? where ?`;
            conn.query(update_playerlist_query, [array, req.body.id, {userid: req.body.userid}], (err, update_playerlist_result, fields) => {
                if(err){
                    console.error(err);
                }
                else{
                    res.json(1);
                }
            })
        }
    })
})
module.exports = router;