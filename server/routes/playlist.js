// 플레이리스트에 노래를 추가 할 때마다 한 줄씩 테이블에 추가됨

const express = require("express");
const conn = require("../config/mysql");
const { route } = require("./main");
const router = express.Router();


const mysql2 = require('mysql2/promise');
const pool =  mysql2.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
});



router.get("/", (req, res) => {
    console.log("routes => playlist.js => router.get('/')");
    const sql = 'select distinct userid from playlist';
    conn.query(sql, (err, row, fields) =>{
        if(err){
            console.log(err);
        }else{
            res.render("playlist", {title: "PLAYLIST", row});
        }
    })
});

router.post('/insert', (req, res) =>{
    const userid = req.body.userid
    const sql = `insert into playlist(userid, playlist_name) values('${userid}', '1')`;
    conn.query(sql, (err, row, fields) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/playlist')
        }
    })
})

router.get("/playlist_name_view/:userid", (req, res) =>{
    const {userid} = req.params;
    const sql = 'select distinct playlist_name from playlist where userid = ?'
    conn.query(sql, [userid], (err, row, fields) =>{
        if(err){
            console.log(err);
        }else{
            console.log(row);

            res.render('playlist_name_view', {title: userid, userid, row});
        }
    })
});

router.post('/playlist_name_view/insert', (req, res) =>{
    const {userid, playlist_name} = req.body;
    const sql = `insert into playlist(userid, playlist_name, music) values('${userid}', '${playlist_name}', 1) `;
    console.log('정상적으로 들어옴');
    conn.query(sql, (err, row) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/playlist/playlist_name_view/' + req.body.userid);
        }
    })
});

router.post('/playlist_name_view/delete/:playlist_name', (req, res) =>{
    const userid = req.body.userid;
    console.log(req.body);
    const {playlist_name} = req.params;    
    console.log(playlist_name);
    const sql = `delete from playlist where playlist_name = ? and userid = '${userid}'`
    conn.query(sql, [playlist_name], (err, row, fields) =>{
        if(err){
            console.log(err);
        }else{
            console.log(row);
            console.log('1');
            // const dummy_num_reset = `call playlist_reset;`;
            // conn.query(dummy_num_reset, (err) =>{
            //     console.log('playlist 테이블 - num값 재배열 완료')
            // })
            res.redirect('/playlist/playlist_name_view/' + req.body.userid);
        }
    })
})



router.get('/playlist_name_view/playlist_list_view/:playlist_name&:userid', (req, res) =>{
    console.log("router.get('/playlist_name_view/playlist_list_view/:playlist_name&:userid')");
    const {playlist_name, userid} = req.params;
    const sql = 'select music from playlist where playlist_name = ?';
    conn.query(sql, [playlist_name], (err, row, fields) =>{
        if(err){
            console.log(err);
        }else{
            console.log(playlist_name);
            res.render('playlist_list_view', {row, playlist_name});
        }
    })
});


router.post('/playlist_name_view/playlist_list_view/insert', (req, res) =>{
    const {playlist_name, music} = req.body;
    // const {music} = req.params
    // console.log(req.params);
    const sql = `insert into playlist(playlist_name, music) values('${playlist_name}', ?) `;
    console.log('정상적으로 들어옴');
    conn.query(sql, [music], (err, row) =>{
        if(err){
            console.log(err);
            console.log('여기냐');
        }else{
            console.log(row);
            res.redirect('/playlist/playlist_name_view/playlist_list_view/' + req.body.playlist_name);
        }
    })
});

router.post('/playlist_name_view/playlist_list_view/delete/:music', (req, res) =>{
    const {music} = req.params;
    const {playlist_name} = req.body;    
    console.log(playlist_name);
    const sql = `delete from playlist where music = ? and playlist_name = '${playlist_name}'`
    console.log('1');
    conn.query(sql, [music], (err, row, fields) =>{
        if(err){
            console.log(err);
        }else{
            console.log('1');
            // const dummy_num_reset = `call playlist_reset;`;
            // conn.query(dummy_num_reset, (err) =>{
            //     console.log('playlist 테이블 - num값 재배열 완료')
            // })
            res.redirect('/playlist/playlist_name_view/playlist_list_view/' + req.body.playlist_name);
        }
    })
})


// 클라이언트 단

router.get('/storage/mylist/:userid', (req, res) =>{
    console.log("routes => playlist.js => router.get('/storage/mylist/:userid')");
    const {userid} = req.params;
    console.log(userid)
    const sql = `select playlist_id, playlist_name, create_date, playlist, thumbnail_image from playlist where userid = ${userid} order by update_date desc`;
    conn.query(sql, (err, row) =>{
        if(err){
            console.log(err);
        }else{
            // console.log(row);
            res.send(row);
        }
    })
});




router.post(`/storage/mylist/`, (req, res) =>{
    console.log(`routes => playlist.js => router.post('/storage/mylist')`);
    const {userid} = req.body;
    let {date} = req.body;
    // console.log(req.body);
    const select_playlist_sql = `select playlist_name from playlist where userid = '${userid}'`;
    conn.query(select_playlist_sql, (err, select_playlist_result) =>{
        console.log(select_playlist_result);
        for(i = 0; i < select_playlist_result.length; i++){
            if(date == select_playlist_result[i].playlist_name){
                date = `${req.body.date}(${i + 1})`
                // date += `(${i + 1})` 
                console.log(date);
            }
        }
        let insert_playlist_sql = "insert into playlist(userid, playlist_name) values('" + userid + "', '" + date + "')";
        // console.log(insert_playlist_sql);
        conn.query(insert_playlist_sql, (err, insert_playlist_result) =>{
            console.log(insert_playlist_result);
            let select_playlist_sql2 = `select playlist_id from playlist where userid = '${userid}' order by playlist_id desc`;
            conn.query(select_playlist_sql2, (err, select_playlist_result2) =>{
                // console.log(select_playlist_result2);
                res.send(select_playlist_result2);
            })
        })
    })
});

router.get('/detail/detailmylist/:playlist_id', (req, res) =>{
    console.log("routes => playlist.js => router.get('/detail/detailmylist:userid')");
    const {playlist_id} = req.params;
    const sql = `select playlist_id, playlist_name, create_date, playlist, thumbnail_image from playlist where playlist_id = ${playlist_id}`;
    conn.query(sql, (err, row) =>{
        if(err){
            console.log(err);
        }else{
            // console.log(row);
            res.send(row);
        }
    })
});

router.post('/detail/detailmylist/changeplaylistname', (req, res) =>{
    console.log("routes => playlist.js => router.post('/detail/detailmylist/changeplaylistname')");
    const {playlist_id, playlist_name, userid} = req.body;
    // console.log(req.body);
    const sql = `select playlist_name from playlist where ?`;
    conn.query(sql, [{userid}], (err, row) =>{
        // console.log(row);
        for(i = 0; i < row.length; i++){
            if(req.body.playlist_name === row[i].playlist_name){
                res.json(1);
                return;
            }
        }
        const change_playlist_name_sql = `update playlist set ? where ?`;
        conn.query(change_playlist_name_sql, [{playlist_name}, {playlist_id}], (err, change_playlist_name_result) =>{
            // console.log(change_playlist_name_result);
            console.log('플레이리스트 제목 변경됨');
            res.json(2);
        })

    })
})








///////////////////////////////// MODAL /////////////////////////////////////////
// musiclistcard에서 내 리스트 버튼을 눌렀을 때 모달을 띄우는 라우터
router.post(`/browse/addplaylist/`, (req, res) =>{
    console.log(`routes => playlist.js => router.post('/browse/addplaylist')`);
    // console.log(req.body);
    // const {userid} = req.params;
    const select_playlist_sql = `select * from playlist where ?`
    conn.query(select_playlist_sql, [{userid: req.body.userid}], (err, select_playlist_sql_result) =>{
        if(err){
            console.log(err);
        }else{
            // console.log('11');
            // console.log(select_playlist_sql_result.length);
            if(select_playlist_sql_result.length === 0){
                res.json(-1);
            }
            else{
                let selected = "where playlist_id = " + select_playlist_sql_result[0].playlist_id;
                if(select_playlist_sql_result.length <= 1){
                    const select_playlistname_thumbnailimage_sql = `select playlist_id, playlist_name, thumbnail_image from playlist ${selected} order by update_date desc`;
                    conn.query(select_playlistname_thumbnailimage_sql, (err, row) =>{
                        res.send(row);
                        // console.log(row);
                    })
                }else{
                    for(i=1; i < select_playlist_sql_result.length; i++)(
                        selected += " or playlist_id = " + select_playlist_sql_result[i].playlist_id
                    )
                    const select_playlistname_thumbnailimage_sql = `select playlist_id, playlist_name, thumbnail_image from playlist ${selected} order by update_date desc`;
                    conn.query(select_playlistname_thumbnailimage_sql, (err, row) =>{
                        // console.log(select_playlistname_thumbnailimage_sql)
                        res.send(row);
                        console.log(row);
                    })
                }
                // console.log(selected);
            }

            // res.send(select_playlist_sql_result);
        }
    })
});

// playlistAdd 모달에서 이미 존재하는 플레이리스트에 음악을 추가하는 라우터
router.post('/browse/addmusictoplaylist/', async (req, res) =>{
    console.log(`routes => playlist.js => router.post('/browse/addmusictoplaylist')`);
    // console.log(req.body)
    const {userid, thumbnail_image, playlist_name, playlist_id} = req.body;
    let {music_id, album_title, album_id, playlist} = req.body;
    console.log("바디");
    console.log(req.body);

    let array = [];
    let client_array = [];
    
    console.log(req.body);

    // 페이지가 albumtrack 일 때 (music 리스트 전달 x) (albumtrack)
    try{
        const select_music_query = `select music.id from music inner join album on album.album_title = music.album_title where album.album_id = ${req.body.album_id}`;
        
        let [select_music_result] = await pool.query(select_music_query);
    
        for(let i=0; i<select_music_result.length; i++){
            // array.push(select_music_result[i].id);
            client_array.push(select_music_result[i].id);
        }
        console.log("### client Add ###");
        console.log(client_array);
        const sql = `select thumbnail_image, playlist from playlist where ? and ? and ?`
        conn.query(sql, [{userid}, {playlist_name}, {playlist_id}], (err, row) =>{
            if(err){
                console.error(err)
            }
            else{
                console.log("### playlist ###" );
                console.log(row[0].playlist);
                array = row[0].playlist;

                for(let i=0; i<client_array.length; i++){
                    for(let j=0; j<row[0].playlist.length; j++){
    
                        if(Number(client_array[i]) === row[0].playlist[j]){
    
                            array.splice(j, 1);
                            array.push(Number(client_array[i]));
                            break;
                        }
                        if(j === row[0].playlist.length - 1){
                            array.push(Number(client_array[i]));
                        }
    
                    }
                }
                console.log("### result ###");
                console.log(array);

                const update_playlist_query = `update playlist set playlist = "[?]", thumbnail_image = ? where ?`;
                conn.query(update_playlist_query, [array, thumbnail_image, {playlist_id: playlist_id}], (err, update_playlist_result, fields) => {
                    if(err){
                        console.error(err)
                    }
                    else{
                        res.json(1);
                    }
                })
            }
        })


    }
    catch(e){
        console.log(err);
    }

    // const sql = `select thumbnail_image, playlist from playlist where ? and ? and ?`
    // conn.query(sql, [{userid}, {playlist_name}, {playlist_id}], (err, row) =>{
    //     if(err){
    //         console.log(err);
    //     }else{
    //         if(album_title == (null || undefined) && playlist == (null || undefined)){
    //             if(row[0].thumbnail_image == null && row[0].playlist == null){
    //                 const sql1_1 = `update playlist set thumbnail_image = '${thumbnail_image}', playlist = '[${Number(music_id)}]' where playlist_id = ${playlist_id}`
    //                 conn.query(sql1_1, (err, row) =>{
    //                     res.send('플레이리스트 추가됨');
    //                 })
    //             }else{
    //                 let music_id_arr = []
    //                 music_id_arr.push(Number(music_id));

    //                 const newarr = new Set([...row[0].playlist, ...music_id_arr]); // returns [1, 4, 3, 2, 5, 6, 7]
    //                 console.log(Array.from(newarr));
    //                 const insert_arr = Array.from(newarr);
    //                 // console.log(insert_arr.length);
    //                 // console.log(row[0].playlist.length);
                    
    //                 if(insert_arr.length === row[0].playlist.length){
    //                     console.log('중복값 차단')
    //                     res.send('플레이리스트 중복됨')
    //                 }else{
    //                     const sql_2 = `update playlist set thumbnail_image = '${thumbnail_image}', playlist = '[${insert_arr}]' where  playlist_id = ${playlist_id}`;
    //                     console.log(sql_2);
    //                     conn.query(sql_2, (err, row) =>{
    //                         res.send('플레이리스트 추가됨');
    //                     })
    //                 }
    //             }

    //         }else if(music_id == (null || undefined) && playlist == (null || undefined)){
    //             const sql2_1 = `select id from music where album_id = "${album_id}"`
    //             conn.query(sql2_1, (err, row) =>{
    //                 console.log(row);
    //                 const album_title_playlist_arr = [];
    //                 for(i = 0; i < row.length; i++){
    //                     album_title_playlist_arr.push(Number(row[i].id));
    //                 }
    //                 console.log(album_title_playlist_arr);
    //                 const sql2_2 = `select thumbnail_image, playlist from playlist where playlist_id = ${playlist_id}`
    //                 conn.query(sql2_2, (err, row) =>{
    //                     console.log(row);

    //                     if(row[0].thumbnail_image == null && row[0].playlist == null){
    //                         const sql2_3 = `update playlist set thumbnail_image = '${thumbnail_image}', playlist = '[${album_title_playlist_arr}]' where playlist_id = ${playlist_id}`
    //                         conn.query(sql2_3, (err, result) =>{
    //                             console.log(sql2_3);
    //                             console.log(result);
    //                             res.send('플레이리스트 추가됨');
    //                         })
    //                     }else{
    //                         const newarr = new Set([...row[0].playlist, ...album_title_playlist_arr]); // returns [1, 4, 3, 2, 5, 6, 7]
    //                         console.log(Array.from(newarr));
    //                         const insert_arr = Array.from(newarr);
                            
    //                         console.log(insert_arr.length);
    //                         console.log(row[0].playlist.length);
                            
    //                         if(insert_arr.length === row[0].playlist.length){
    //                             console.log('중복값 차단')
    //                             res.send('플레이리스트 중복됨')
    //                         }else{
    //                             const sql2_4 = `update playlist set thumbnail_image = '${thumbnail_image}', playlist = '[${insert_arr}]' where  playlist_id = ${playlist_id}`;
    //                             conn.query(sql2_4, (err, row) =>{
    //                                 res.send('플레이리스트 추가됨');
    //                             })
    //                         }
    //                         // let array = [];
    //                         // for(i = 0; i < row[0].playlist.length; i++){
    //                         //     for(j = 0; j < album_title_playlist_arr[0].length; j++){
    //                         //         if(album_title_playlist_arr[i] == row[j].playlist){
    //                         //             array.push(row[i].playlist)
    //                         //         }
    //                         //     }
    //                         // }
    //                         // console.log(array);
    //                         // let array = row[0].playlist;
    //                         // for(let i=0; i<row[0].playlist.length; i++){
    //                         //     if( Number(music_id) === row[0].playlist.length ) {
    //                         //         array.splice(i, 1);
    //                         //     }
    //                         // }
    //                         // array.push(Number(music_id));
    //                     }
    //                 })
    //             })
    //         }else if(music_id == (null || undefined) && album_title == (null || undefined)){
        
    //         }
    //         }
    //     })


})


//  MBJ
// 플레이어 추가에 array 형태로 전달하는 경우
router.post("/playerAdd", async (req, res) => {
    console.log("routes => playerHandle.js => router.post('/checklistAdd')");

    try{    

        let array = [];
        let client_array = [];
        
        console.log(req.body);

        // 페이지가 albumtrack 일 때 (music 리스트 전달 x) (albumtrack)
        if(req.body.page === "albumtrack"){
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// playlistAdd 모달에서 새 플레이리스트를 만듦과 동시에 해당 플레이리스트에 곡을 추가하는 라우터
router.post('/browse/addnewmusicandplaylist/', (req, res) =>{
    console.log(`routes => playlist.js => router.post('/browse/addnewmusicandplaylist')`);
    const {userid, music_id, thumbnail_image} = req.body;
    let playlist_name = req.body.playlist_name;
    console.log(req.body);

    const sql = `select playlist_name from playlist where ?`;
    conn.query(sql, [{userid}], (err, row) =>{
        console.log(row);
        for(i = 0; i < row.length; i++){
            if(req.body.playlist_name == row[i].playlist_name){
                res.json(1);
                return;
            }
        }
        console.log(playlist_name);
        const insert_playlist_query = `insert into playlist (userid, playlist_name, thumbnail_image, playlist) values (?, ?, ?, "[?]")`;
        conn.query(insert_playlist_query, [userid, playlist_name, thumbnail_image, Number(music_id)], (err, insert_playlist_result, fields) => {
            if(err){
                console.error(err);
            }
            else{
                console.log(insert_playlist_query);
                res.json(2);
            }
        })
    })
})


router.post(`/detailmylist/addmusicmodal`, (req, res) =>{
    console.log(`routes => playlist.js => router.post('/detail/detailmylist/detailmylistaddmusicmodal')`);
    console.log(req.body);
    const {userid, playlist_id} = req.body;
    const sql = `select music_list from likey where division = 'liketrack' and ?`
    conn.query(sql, [{userid}], (err, row) =>{
        console.log(row);
    })
})

module.exports = router;