// 플레이리스트에 노래를 추가 할 때마다 한 줄씩 테이블에 추가됨

const express = require("express");
const conn = require("../config/mysql");
const { route } = require("./main");
const router = express.Router();

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
    const sql = `select playlist_id, playlist_name, playlist from playlist where userid = ${userid}`;
    conn.query(sql, (err, row) =>{
        if(err){
            console.log(err);
        }else{
            // console.log(row);
            res.send(row);
        }
    })
});

router.get('/detail/detailmylist/:playlist_id', (req, res) =>{
    console.log("routes => playlist.js => router.get('/detail/detailmylist:userid')");
    const {playlist_id} = req.params;
    const sql = `select playlist_name, playlist, thumbnail_image from playlist where playlist_id = ${playlist_id}`;
    conn.query(sql, (err, row) =>{
        if(err){
            console.log(err);
        }else{
            // console.log(row);
            res.send(row);
        }
    })
})

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
                date = `${date}(${i + 1})` 
            };
        }
        let insert_playlist_sql = "insert into playlist(userid, playlist_name) values('" + userid + "', '" + date + "')";
        // console.log(insert_playlist_sql);
        conn.query(insert_playlist_sql, (err, insert_playlist_result) =>{
            // console.log(insert_playlist_result);
            let select_playlist_sql2 = `select playlist_id from playlist where userid = '${userid}'`
            conn.query(select_playlist_sql2, (err, select_playlist_result2) =>{
                // console.log(select_playlist_result2);
                res.send(select_playlist_result2);
            })
        })
    })
});


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
            let selected = "where playlist_id = " + select_playlist_sql_result[0].playlist_id;
            if(select_playlist_sql_result.length <= 1){
                const select_playlistname_thumbnailimage_sql = `select playlist_name, thumbnail_image from playlist ${selected}`;
                conn.query(select_playlistname_thumbnailimage_sql, (err, row) =>{
                    res.send(row);
                    // console.log(row);
                })
            }else{
                for(i=1; i < select_playlist_sql_result.length; i++)(
                    selected += " or playlist_id = " + select_playlist_sql_result[i].playlist_id
                )
                const select_playlistname_thumbnailimage_sql = `select playlist_name, thumbnail_image from playlist ${selected}`;
                conn.query(select_playlistname_thumbnailimage_sql, (err, row) =>{
                    // console.log(select_playlistname_thumbnailimage_sql)
                    res.send(row);
                    console.log(row);
                })
            }
            // console.log(selected);

            // res.send(select_playlist_sql_result);
        }
    })
});

router.post('/browse/addmusictoplaylist/', (req, res) =>{
    console.log(`routes => playlist.js => router.post('/browse/addmusictoplaylist')`);
    // console.log(req.body)
    const {userid, music_id, thumbnail_image, playlist_name} = req.body;

    const sql = `select thumbnail_image, playlist from playlist where ? and ?`
    conn.query(sql, [{userid}, {playlist_name}], (err, row) =>{
        if(err){
            console.log(err);
        }else{
            // console.log(playlist_name)
            // console.log(row);

            // 만약 재생목록이 방금 생성되어 데이터가 없을 때는 push가 안돼서 나타나는 오류를 위한 if문
            if(row[0].thumbnail_image == null && row[0].playlist == null){
                // console.log('여기냐?')
                const sql2 = `update playlist set thumbnail_image = '${thumbnail_image}', playlist = '[${Number(music_id)}]' where userid = '${userid}' and playlist_name = '${playlist_name}'`;

                conn.query(sql2, (err, row) =>{
                    // console.log(row)
                    res.send('플레이리스트 추가됨');
                })
            }else{
                
                let array = row[0].playlist;

                for(let i=0; i<row[0].playlist.length; i++){

                    if( Number(music_id) === row[0].playlist.length ) {
                        array.splice(i, 1);
                    }
                }

                array.push(Number(music_id));

                // console.log(row);
                // const sql2 = `update playlist set thumbnail_image = '${thumbnail_image}', playlist = '[${row[0].playlist}]' where userid = '${userid}' and playlist_name = '${playlist_name}'`;
                const sql2 = `update playlist set thumbnail_image = '${thumbnail_image}', playlist = '[${array}]' where userid = '${userid}' and playlist_name = '${playlist_name}'`;
                // console.log(sql2);
                conn.query(sql2, (err, row) =>{
                    // console.log(row)
                    res.send('플레이리스트 추가됨');
                })
            }

        }
    })
})

router.post('/browse/addnewmusicandplaylist/', (req, res) =>{
    console.log(`routes => playlist.js => router.post('/browse/addnewmusicandplaylist')`);
    const {userid, playlist_name, music_id, thumbnail_image} = req.body;
    // console.log(req.body);

    const insert_playlist_query = `insert into playlist (userid, playlist_name, thumbnail_image, playlist) values (?, ?, ?, "[?]")`
    conn.query(insert_playlist_query, [userid, playlist_name, thumbnail_image, Number(music_id)], (err, insert_playlist_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            // console.log(insert_playlist_query);
            res.json(1);
        }
    })
})

module.exports = router;