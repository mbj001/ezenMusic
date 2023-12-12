const express = require("express");
const conn = require("../config/mysql")
// const cors = require("cors");

const router = express.Router();

const mysql2 = require('mysql2/promise');
// const pool =  mysql2.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASS,
//     database: process.env.MYSQL_DB
// });
const pool = require("../config/mysqlPool");


router.post("/changeNowMusic", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/playerHandle')");

    const select_playerlist_query = `update playerlist set now_play_music = ? where ?`;
    conn.query(select_playerlist_query, [req.body.music_id, {character_id: req.body.character_id}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.json(1);
        }
        return ;
    })
    

});


router.post("/addplayerlist", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/addplayerlist')");
    // console.log(req.body);
    const select_playerlist_query = `select * from playerlist where ?`;
    conn.query(select_playerlist_query, [{character_id: req.body.character_id}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // player 테이블에 정보가 없을 때
            if(select_playerlist_result.length === 0){
                const insert_playerlist_query = `insert into playerlist (character_id, now_play_music, music_list) values (?, ?, "[?]")`;
                conn.query(insert_playerlist_query, [req.body.character_id, req.body.music_id, Number(req.body.music_id)], (err, insert_playerlist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.json(1);
                    }
                })
            }
            // player character 는 있지만 music_list 길이가 0일 때
            else if(select_playerlist_result[0].music_list.length === 0){
                const insert_playerlist_query = `update playerlist set ?, ? where ?`;
                conn.query(insert_playerlist_query, [{now_play_music: req.body.music_id}, {music_list: "["+Number(req.body.music_id)+"]"}, {character_id: req.body.character_id}], (err, insert_playerlist_result, fields) => {
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
                    if(Number(req.body.music_id) === array[i]){
                        // 중복 곡 있으면
                        // res.json(-1);
                        array.splice(i, 1);
                    }
                }
                array.push(Number(req.body.music_id));
    
                // 듣기 버튼 클릭
                if(req.body.play_now === 1){
                    const update_playerlist_query = `update playerlist set music_list = "[?]", now_play_music = ? where ?`;
                    conn.query(update_playerlist_query, [array, req.body.music_id, {character_id: req.body.character_id}], (err, update_playerlist_result, fields) => {
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
                    conn.query(update_playerlist_query, [array, {character_id: req.body.character_id}], (err, update_playerlist_result, fields) => {
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
        return ;
    })
})

router.post("/delplayerlist", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/delplayerlist')");
    // console.log(req.body);
    const select_playerlist_query = `select music_list, now_play_music from playerlist where ?`;
    conn.query(select_playerlist_query, [{character_id: req.body.character_id}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            let now_play_music = select_playerlist_result[0].now_play_music;
            let array = select_playerlist_result[0].music_list;

            for(let i=0; i<array.length; i++){
                if(array[i] === Number(req.body.music_id) && req.body.music_id === now_play_music){
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
                else if(array[i] === Number(req.body.music_id)){
                    array.splice(i, 1);
                    break;
                }
            }
            if(array.length === 0){
                const delete_playerlist_query = `delete from playerlist where ?`;
                conn.query(delete_playerlist_query, [{character_id: req.body.character_id}], (err, delete_playerlist_result, fields) => {
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
                conn.query(update_playerlist_query, [array, now_play_music, {character_id: req.body.character_id}], (err, update_playerlist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.json(1);
                    }
                })                
            }
        }
        return ;
    })
})

router.post("/checklistAdd", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/checklistAdd')");

    let array = [];
    const select_musiclist_query = `select * from playerlist where ?`;
    conn.query(select_musiclist_query, [{character_id: req.body.character_id}], (err, select_musiclist_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            if(select_musiclist_result.length === 0){
                for(let i=0; i<req.body.music_list.length; i++){
                    array.push(Number(req.body.music_list[i]));
                }

                const insert_playerlist_query = `insert into playerlist(character_id, now_play_music, music_list) values (?, ?, "[?]")`;
                conn.query(insert_playerlist_query, [req.body.character_id, String(array[0]), array], (err, insert_playerlist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.json(1);
                    }
                })

            }
            else if(select_musiclist_result[0].music_list.length === 0){
                for(let i=0; i<req.body.music_list.length; i++){
                    array.push(Number(req.body.music_list[i]));
                }
                const insert_playerlist_query = `update playerlist set ?, ? where ?`;
                conn.query(insert_playerlist_query, [{now_play_music: String(array[0])}, {music_list: "["+array+"]"}, {character_id: req.body.character_id}], (err, insert_playerlist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.json(1);
                        return ;
                    }
                })
            }
            else{

                array = select_musiclist_result[0].music_list;

                for(let i=0; i<req.body.music_list.length; i++){
                    if(select_musiclist_result[0].music_list.length === 0){
                        for(let i=0; i<req.body.music_list.length; i++){
                            array.push(Number(req.body.music_list[i]));
                        }
                        break;
                    }
                    else{
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
                }
                console.log(array);
                if(req.body.change_now_play === true){
                    const select_playerlist_query = `update playerlist set now_play_music = ?, music_list = "[?]" where ?`;
                    conn.query(select_playerlist_query, [String(req.body.music_list[0]), array, {character_id: req.body.character_id}], (err, select_playerlist_result, fields) => {
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
                    conn.query(select_playerlist_query, [array, {character_id: req.body.character_id}], (err, select_playerlist_result, fields) => {
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
        return ;
    })

})

router.post("/checklistDel", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/checklistDel')");

    const select_playerlist_query = `select * from playerlist where ?`;
    conn.query(select_playerlist_query, [{character_id: req.body.character_id}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            let array = [];
            for(let i=0; i<select_playerlist_result[0].music_list.length; i++){
                for(let j=0; j<req.body.list.length; j++){
                    if(select_playerlist_result[0].music_list[i] === Number(req.body.list[j])){
                        if(select_playerlist_result[0].now_play_music === req.body.list[j]){
                            select_playerlist_result[0].now_play_music = String(select_playerlist_result[0].music_list[i+1]);
                        }
                        break;
                    }
                    if(j === req.body.list.length -1){
                        array.push(select_playerlist_result[0].music_list[i])
                    }
                }
            }
            // console.log(array);

            const update_playerlist_query = `update playerlist set now_play_music = ?, music_list = "[?]" where ?`;
            conn.query(update_playerlist_query, [select_playerlist_result[0].now_play_music, array, {character_id: req.body.character_id}], (err, update_playerlist_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    console.log(update_playerlist_query);
                    res.json(1);
                }
            })
        }
    })
})



// 건우 참고하면 됨
// 플레이어 추가에 array 형태로 전달하는 경우
router.post("/playerAdd", async (req, res) => {
    console.log("routes => playerHandle.js => router.post('/playerAdd')");

    try{    
        let array = [];
        let client_array = [];        
        // 페이지가 albumtrack 일 때 (music 리스트 전달 x) (albumtrack)
        if(req.body.page === "albumtrack" ){
            const select_music_query = `select music.music_id from music inner join album on album.album_id = music.album_id where album.album_id = ${req.body.album_id}`;
            
            let [select_music_result] = await pool.query(select_music_query);
        
            for(let i=0; i<select_music_result.length; i++){
                // array.push(select_music_result[i].id);
                client_array.push(Number(select_music_result[i].music_id));
            }
        }

        if(req.body.page === "liketheme"){
            const select_themeplaylist_query = `select music_list from themeplaylist where ?`;
            // console.log(req.body);
            let [select_themeplaylist_result] = await pool.query(select_themeplaylist_query, [{themeplaylist_id: Number(req.body.themeplaylist_id)}]);
            for(let i=0; i<select_themeplaylist_result[0].music_list.length; i++){
                // array.push(select_music_result[i].id);
                client_array.push(Number(select_themeplaylist_result[0].music_list[i]));
            }
        }

        if(req.body.page === "mainbanner_prefer_playlist"){
            const select_prefer_playlist_query = `select music_list from prefer_playlist where ?`;
            console.log(req.body);
            let [select_prefer_playlist_result] = await pool.query(select_prefer_playlist_query, [{character_id: req.body.character_id}]);
            for(let i=0; i<select_prefer_playlist_result[0].music_list.length; i++){
                // array.push(select_music_result[i].id);
                client_array.push(Number(select_prefer_playlist_result[0].music_list[i]));
            }
        }

        if(req.body.page === "artist"){
            const select_artist_music_query = `select music_id from music where ?`;
            let [select_artist_music_result] = await pool.query(select_artist_music_query, [{artist_id: Number(req.body.artist_id)}]);
            for(let i=0; i<select_artist_music_result.length; i++){
                // array.push(select_music_result[i].id);
                client_array.push(Number(select_artist_music_result[i].music_id));
            }
        }

        if(req.body.page === "mylist"){
            const select_playlist_music_query = `select music_list from playlist where ?`;
            let [select_playlist_music_result] = await pool.query(select_playlist_music_query, [{playlist_id: Number(req.body.playlist_id)}]);

            for(let i=0; i<select_playlist_music_result[0].music_list.length; i++){
                // array.push(select_music_result[i].id);
                client_array.push(Number(select_playlist_music_result[0].music_list[i]));
            }
        }

        // client 에서 music 리스트를 보내줄 때 (channel, browse)
        if(req.body.music_list){
            for(let i=0; i<req.body.music_list.length; i++){
                // array.push(select_music_result[i].id);
                client_array.push(req.body.music_list[i]);
            }
        }

        const select_musiclist_query = `select * from playerlist where ?`;
        conn.query(select_musiclist_query, [{character_id: req.body.character_id}], (err, select_musiclist_result, fields) => {

            if(err){
                console.error(err);
            }
            else{
                // userid row 없을 때
                if(select_musiclist_result.length === 0){
                    for(let i=0; i<client_array.length; i++){
                        array.push(Number(req.body.music_list[i]));
                    }
                    
                    const insert_playerlist_query = `insert into playerlist(character_id, now_play_music, music_list) values (?, ?, "[?]")`;
                    conn.query(insert_playerlist_query, [req.body.character_id, String(array[0]), array], (err, insert_playerlist_result, fields) => {
                        if(err){
                            console.error(err);
                        }
                        else{
                            res.json(1);
                        }
                    })
                }
                // row 는 있지만 music_list 가 없을 때
                else if(select_musiclist_result[0].music_list.length === 0){
                    // react 에서 저장 할 music_list 보내줬을 때
                    if(req.body.music_list){
                        for(let i=0; i<client_array.length; i++){
                            array.push(Number(req.body.music_list[i]));
                        }
                        
                        const update_playerlist_query = `update playerlist set now_play_music = ?, music_list = "[?]" where ?`;
                        conn.query(update_playerlist_query, [String(array[0]), array, {character_id: req.body.character_id}], (err, update_playerlist_result, fields) => {
                            if(err){
                                console.error(err);
                            }
                            else{
                                res.json(1);
                            }
                        })
                    }
                    // albumtrack 이고 보내주는 music_list가 없을 때

                    else{
                        const update_playerlist_query = `update playerlist set now_play_music = ?, music_list = "[?]" where ?`;
                        conn.query(update_playerlist_query, [String(client_array[0]), client_array, {character_id: req.body.character_id}], (err, update_playerlist_result, fields) => {
                            if(err){
                                console.error(err);
                            }
                            else{
                                res.json(1);
                            }
                        })
                    }
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
                    if(req.body.change_now_play === true){
                        const select_playerlist_query = `update playerlist set now_play_music = ?, music_list = "[?]" where ?`;
                        conn.query(select_playerlist_query, [String(client_array[0]), array, {character_id: req.body.character_id}], (err, select_playerlist_result, fields) => {
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
                        conn.query(select_playerlist_query, [array, {character_id: req.body.character_id}], (err, select_playerlist_result, fields) => {
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
            return ;
        })
    }
    catch(e){
        console.log(e);
    }
})


router.post("/playerNext", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/playerNext')");

    const select_nowmusic_query = `select now_play_music, music_list from playerlist where ?`;
    conn.query(select_nowmusic_query, [{character_id: req.body.character_id}], (err, select_nowmusic_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            // music_list 의 길이가 1일 때 (0일 때는 어차피 버튼 활성화 x)
            if(select_nowmusic_result[0].music_list.length === 1){
                res.json(1);
            }
            else{
                let change_now_music;
                for(let i=0; i<select_nowmusic_result[0].music_list.length; i++){
                    if(select_nowmusic_result[0].music_list[i] === Number(select_nowmusic_result[0].now_play_music)){
                        // 현재 노래가 마지막노래일 때
                        if(i === select_nowmusic_result[0].music_list.length-1){
                            change_now_music = select_nowmusic_result[0].music_list[0];
                        }
                        else{
                            change_now_music = String(select_nowmusic_result[0].music_list[i + 1]);
                            break;
                        }
                        
                    }
                }

                const update_playerlist_query = `update playerlist set ? where ?`;
                conn.query(update_playerlist_query, [{now_play_music: change_now_music}, {character_id: req.body.character_id}], (err, update_playerlist_result, fields) => {
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

router.post("/playerBefore", (req, res) => {
    console.log("routes => playerHandle.js => router.post('/playerNext')");

    const select_nowmusic_query = `select now_play_music, music_list from playerlist where ?`;
    conn.query(select_nowmusic_query, [{character_id: req.body.character_id}], (err, select_nowmusic_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            // music_list 의 길이가 1일 때
            if(select_nowmusic_result[0].music_list.length === 1){
                res.json(1);
            }
            else{
                let change_now_music;
                for(let i=0; i<select_nowmusic_result[0].music_list.length; i++){
                    if(select_nowmusic_result[0].music_list[i] === Number(select_nowmusic_result[0].now_play_music)){
                        // 현재 노래가 첫 번째 노래일 때
                        if(i === 0){
                            change_now_music = select_nowmusic_result[0].music_list[select_nowmusic_result[0].music_list.length - 1];
                        }
                        else{
                            change_now_music = String(select_nowmusic_result[0].music_list[i - 1]);
                            break;
                        }
                        
                    }
                }

                const update_playerlist_query = `update playerlist set ? where ?`;
                conn.query(update_playerlist_query, [{now_play_music: change_now_music}, {character_id: req.body.character_id}], (err, update_playerlist_result, fields) => {
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
module.exports = router;