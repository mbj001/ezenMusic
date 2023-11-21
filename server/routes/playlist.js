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
            // console.log(row[0].playlist_name);
            // console.log(userid);
            // const playlist = Object.values(row[0].playlist_name);
            // // string 타입으로 반환되어 comma로 구분한 배열로 변경
            // console.log(typeof(playlist[0]));
            // const arr = playlist[0].split(',');

            // console.log(Array.isArray(arr));
            // console.log(arr);
            // console.log(typeof(arr));
            let playlist;
            // for(i = 0; i < ; i++){
            //     row[0].playlist_name;
            //     console.log(row);
            // }
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

// router.get('/playlist_name_view/playlist_list_view/:playlist_name', (req, res) =>{
//     const {playlist_name} = req.params;
//     console.log(playlist_name)
    
//     const finding_playlist_name_sql = `select playlist_list from playlist where playlist_name = ?`;
    
//     conn.query(finding_playlist_name_sql, [playlist_name], (err, row, fields) =>{
//         if(err){
//             console.log(error);
//         }else{
//             console.log(row[0].playlist_name[1] );
//             list = row[0].playlist_name;
//             for(i = 0; i < list.length; i ++){
//                 console.log(list[i]);
//             }
//             const finding_playlist_list_sql = `select playlist from playlist where playlist_name = ${list}`;
//         }
//     })
//     res.render('playlist_list_view', {title: 'userid', row});

// })


router.get('/storage/mylist/:userid', (req, res) =>{
    console.log("routes => playlist.js => router.get('/storage/mylist/:userid')");
    const {userid} = req.params;
    const sql = `select num, playlist_name, playlist from playlist where userid = ${userid}`;
    conn.query(sql, (err, row) =>{
        if(err){
            console.log(err);
        }else{
            // console.log(row);
            res.send(row);
        }
    })
});

router.get('/detail/detailmylist/:num', (req, res) =>{
    const {num} = req.params;
    const sql = `select playlist_name, playlist, thumbnail_music from playlist where num = ${num}`;
    conn.query(sql, (err, row) =>{
        if(err){
            console.log(err);
        }else{
            // console.log(row);
            res.send(row);
        }
    })
})

module.exports = router;