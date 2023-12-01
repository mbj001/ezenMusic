const express = require("express");
const conn = require("../config/mysql")
// const cors = require("cors");

const router = express.Router();

const mysql2 = require('mysql2/promise');
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Qudwns12!',
    connectionLimit: 10,
    database: 'flodb'
});

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
    // console.log(req.body);
    const select_playerlist_query = `select * from playerlist where ?`;
    conn.query(select_playerlist_query, [{userid: req.body.userid}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // player 테이블에 정보가 없을 때
            if(select_playerlist_result.length == 0){
                const insert_playerlist_query = `insert into playerlist (userid, now_play_music, music_list) values (?, ?, "[?]")`;
                conn.query(insert_playerlist_query, [req.body.userid, req.body.id, Number(req.body.id)], (err, insert_playerlist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.json(1);
                    }
                })
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
    
                // 듣기 버튼 클릭
                if(req.body.play_now === 1){
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
    
                // 재생목록 버튼 클릭
                else if(req.body.play_now === -1){
                    const update_playerlist_query = `update playerlist set music_list = "[?]" where ?`;         
                    conn.query(update_playerlist_query, [array, {userid: req.body.userid}], (err, update_playerlist_result, fields) => {
                        if(err){
                            console.error(err);
                        }
                        else{
                            res.json(1);
                        }
                    })                
           
                }
            
            }
        }
    })
})

router.post("/delplayerlist", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/delplayerlist')");
    // console.log(req.body);
    const select_playerlist_query = `select music_list, now_play_music from playerlist where ?`;
    conn.query(select_playerlist_query, [{userid: req.body.userid}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            let now_play_music = select_playerlist_result[0].now_play_music;
            let array = select_playerlist_result[0].music_list;

            for(let i=0; i<array.length; i++){
                if(array[i] === Number(req.body.id) && req.body.id === now_play_music){
                    if(i == 0){
                        now_play_music =  String(array[1]);
                        array.splice(i, 1);
                        break;
                    }
                    else{
                        now_play_music = array[i-1];
                        array.splice(i, 1);
                        break;
                    }
                }
                else if(array[i] === Number(req.body.id)){
                    array.splice(i, 1);
                    break;
                }
            }
            if(array.length === 0){
                const delete_playerlist_query = `delete from playerlist where ?`;
                conn.query(delete_playerlist_query, [{userid: req.body.userid}], (err, delete_playerlist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.json(1);
                    }
                })
            }
            else{
                const update_playerlist_query = `update playerlist set music_list = "[?]", now_play_music = ? where ?`;
                conn.query(update_playerlist_query, [array, now_play_music, {userid: req.body.userid}], (err, update_playerlist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.json(1);
                    }
                })                
            }
        }
    })
})

router.post("/checklistAdd", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/checklistAdd')");

    let array = [];

    const select_musiclist_query = `select * from playerlist where ?`;
    conn.query(select_musiclist_query, [{userid: req.body.userid}], (err, select_musiclist_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            
            if(select_musiclist_result.length === 0){
                for(let i=0; i<req.body.music_list.length; i++){
                    array.push(Number(req.body.music_list[i]));
                }

                const insert_playerlist_query = `insert into playerlist(userid, now_play_music, music_list) values (?, ?, "[?]")`;
                conn.query(insert_playerlist_query, [req.body.userid, String(array[0]), array], (err, insert_playerlist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.json(1);
                    }
                })

            }
            
            else{
                array = select_musiclist_result[0].music_list;

                for(let i=0; i<req.body.music_list.length; i++){
                    for(let j=0; j<select_musiclist_result[0].music_list.length; j++){
    
                        if(Number(req.body.music_list[i]) === select_musiclist_result[0].music_list[j]){
    
                            console.log( "i : " + i + ", j : " + j + "   " + Number(req.body.music_list[i]) + " & " + select_musiclist_result[0].music_list[j]);
                            array.splice(j, 1);
                            array.push(Number(req.body.music_list[i]));
                            break;
                        }
                        if(j === select_musiclist_result[0].music_list.length - 1){
                            array.push(Number(req.body.music_list[i]));
                        }
    
                    }
                }

                if(req.body.change_now_play === true){
                    const select_playerlist_query = `update playerlist set now_play_music = ?, music_list = "[?]" where ?`;
                    conn.query(select_playerlist_query, [String(req.body.music_list[0]), array, {userid: req.body.userid}], (err, select_playerlist_result, fields) => {
                        if(err){
                            console.error(err);
                        }
                        else{
                            res.json(1);
                        }
                    })
                }
                else{
                    const select_playerlist_query = `update playerlist set music_list = "[?]" where ?`;
                    conn.query(select_playerlist_query, [array, {userid: req.body.userid}], (err, select_playerlist_result, fields) => {
                        if(err){
                            console.error(err);
                        }
                        else{
                            res.json(1);
                        }
                    })
                }

            }


        }
    })

})


// 건우 참고하면 됨
// 플레이어 추가에 array 형태로 전달하는 경우
router.post("/playerAdd", async (req, res) => {
    console.log("routes => playerHandle.js => router.post('/checklistAdd')");

    try{    

        let array = [];
        let client_array = [];
        
        console.log(req.body);

        // 페이지가 albumtrack 일 때 (music 리스트 전달 x) (albumtrack)
        if(req.body.page === "albumtrack" ){
            const select_music_query = `select music.id from music inner join album on album.album_title = music.album_title where album.album_id = ${req.body.album_id}`;
            
            let [select_music_result] = await pool.query(select_music_query);
        
            for(let i=0; i<select_music_result.length; i++){
                // array.push(select_music_result[i].id);
                client_array.push(select_music_result[i].id);
            }
        
            console.log(array);
        }


        // client 에서 music 리스트를 보내줄 때 (channel, browse)
        if(req.body.music_list){
            for(let i=0; i<req.body.music_list.length; i++){
                // array.push(select_music_result[i].id);
                client_array.push(req.body.music_list[i]);
            }
        }

        const select_musiclist_query = `select * from playerlist where ?`;
        conn.query(select_musiclist_query, [{userid: req.body.userid}], (err, select_musiclist_result, fields) => {

            if(err){
                console.error(err);
            }
            else{
                
                if(select_musiclist_result.length === 0){
                    for(let i=0; i<client_array.length; i++){
                        array.push(Number(req.body.music_list[i]));
                    }
    
                    const insert_playerlist_query = `insert into playerlist(userid, now_play_music, music_list) values (?, ?, "[?]")`;
                    conn.query(insert_playerlist_query, [req.body.userid, String(array[array.length-1]), array], (err, insert_playerlist_result, fields) => {
                        if(err){
                            console.error(err);
                        }
                        else{
                            res.json(1);
                        }
                    })
    
                }
                
                else{
                    array = select_musiclist_result[0].music_list;
    
                    for(let i=0; i<client_array.length; i++){
                        for(let j=0; j<select_musiclist_result[0].music_list.length; j++){
        
                            if(Number(client_array[i]) === select_musiclist_result[0].music_list[j]){
        
                                array.splice(j, 1);
                                array.push(Number(client_array[i]));
                                break;
                            }
                            if(j === select_musiclist_result[0].music_list.length - 1){
                                array.push(Number(client_array[i]));
                            }
        
                        }
                    }
    
                    const select_playerlist_query = `update playerlist set now_play_music = ?, music_list = "[?]" where ?`;
                    conn.query(select_playerlist_query, [String(array[array.length-1]), array, {userid: req.body.userid}], (err, select_playerlist_result, fields) => {
                        if(err){
                            console.error(err);
                        }
                        else{
                            res.json(1);
                        }
                    })
    
                }
    
    
            }
        })
    }
    catch(e){
        console.log(e);
    }
})

// router.post("/playerAdd/notarray", async (req, res) => {
//     console.log("routes => playerHandle.js => router.post('/checklistAdd')");

//     let array = [];
//     let client_array = [];
    
//     console.log(req.body);
//     // 페이지가 albumtrack 일 때
//     if(req.body.page === "albumtrack"){
//         const select_music_query = `select music.id from music inner join album on album.album_title = music.album_title where album.album_id = ${req.body.album_id}`;
        
//         let [select_music_result] = await pool.query(select_music_query);
    
//         for(let i=0; i<select_music_result.length; i++){
//             array.push(select_music_result[i].id);
//             client_array.push(select_music_result[i].id);
//         }
    
//         console.log(array);
//     }
// })



module.exports = router;