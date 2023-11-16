const express = require("express");
const conn = require("../config/mysql");
const upload = require("../upload/upload")
const fs = require("fs-extra");
const path = require("path");


const router = express.Router();

router.get("/", (req, res) => {
    console.log("routes => album.js => router.get('/')");

    const select_album_query = 'select *, date_format(release_date, "%Y-%m-%d") as release_date_format from album'

    conn.query(select_album_query, (err, select_album_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            if(select_album_result.length == 0){
                res.render("album", {title: "ALBUM"});
            }
            else{
                res.render("album", {title: "ALBUM", Album: select_album_result});                
            }
        }
    })
})

router.get("/add_album", (req, res) => {
    console.log("routes => album.js => router.get('/add_album')");
    
    res.render("add_album", {title: "ADD ALBUM"})
})

router.post("/add_album_form", upload.single("cover_image"), (req, res) => {
    console.log("routes => album.js => router.post('/add_album_form')");

    const insert_album_query = `insert into album (album_title, artist, album_size, org_cover_image, cover_image, release_date, intro, publisher, agency) values (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    conn.query(insert_album_query, [req.body.album_title, req.body.artist, req.body.album_size, req.file.originalname, req.file.filename, req.body.release_date, req.body.intro, req.body.publisher, req.body.agency], (err, insert_album_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            fs.moveSync("./image/tmp/"+req.file.filename, "./image/album/"+req.file.filename);
            res.send("<script>alert('앨범 등록 완료'); location.href='/album'; </script>");
        }  
    })
})

router.get("/delete/:id", (req, res) => {
    console.log("routes => album.js => router.get('/album_delete')");

    const delete_album_query = `delete from album where ?`;
    conn.query(delete_album_query, [{album_id: req.params.id}], (err, delete_music_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            // res.send("<script>alert('삭제완료.'); location.href='/music';</script>");
            res.json(1);
        }
    })
})

router.get("/edit/:id", (req, res) => {
    console.log("routes => album.js => router.get('/edit/:id')");
    
    const select_album_query = `select *, date_format(release_date, "%Y-%m-%d") as release_date_format from album where ?`
    conn.query(select_album_query, [{album_id: req.params.id}], (err, select_album_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.render("edit_album", {title: "EDIT ALBUM", album: select_album_result[0]});
        }
    })

})

router.post("/edit_album_form", upload.single("cover_image"), (req, res) => {
    console.log("routes => album.js => router.post('/edit_album_form')");
    console.log(req.body);
    if(req.body.imgchk){
        const update_album_query = `update album set ?, ?, ?, ?, ?, ?, ?, ?, ? where ?;`;
        
        conn.query(update_album_query, [{album_title: req.body.album_title}, {artist: req.body.artist}, {album_size: req.body.album_size}, {org_cover_image: req.file.originalname}, {cover_image: req.file.filename}, {release_date: req.body.release_date}, {intro: req.body.intro}, {publisher: req.body.publisher}, {agency: req.body.agency}, {album_id: req.body.album_id}], (err, update_album_result, fields) => {
            if(err){
                console.error(err);
            }
            else{
                fs.removeSync("./image/album/" + req.body.before_cover_image);
                fs.moveSync("./image/tmp/"+req.file.filename, "./image/album/"+req.file.filename);
                res.send("<script>alert('수정 완료'); location.href='/album'; </script>");
            }
        })
    }
    else{
        const update_album_query = `update album set ?, ?, ?, ?, ?, ?, ? where ?;`;
        
        conn.query(update_album_query, [{album_title: req.body.album_title}, {artist: req.body.artist}, {album_size: req.body.album_size}, {release_date: req.body.release_date}, {intro: req.body.intro}, {publisher: req.body.publisher}, {agency: req.body.agency}, {album_id: req.body.album_id}], (err, update_album_result, fields) => {
            if(err){
                console.error(err);
            }
            else{
                res.send("<script>alert('수정 완료'); location.href='/album'; </script>");
            }
        })
    }
})

router.get("/view/:id", (req, res) => {
    console.log("routes => album.js => router.get('/view/:id')");
    
    const select_albumList_query = "select * from music where ?";
    conn.query(select_albumList_query, [{album_title: req.params.id}], (err, select_albumList_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.render("info_album", {title: req.params.id, Music: select_albumList_result});
        }
    })
})

// router.get("/add_album_music/:id", (req, res) => {
//     console.log("routes => album.js => router.get('/view/:id')");

//     res.render("add_album_music", ({albumTitle: req.params.id}));
// })
router.get("/add_album_music/:id", (req, res) => {
    console.log("routes => album.js => router.get('/add_album_music/:id')");
    
    res.render("add_music", ({title: "ADD MUSIC", albumTitle: req.params.id}));
})

router.get("/edit_music/:id", (req, res) => {
    console.log("routes => music.js => router.get('/edit_music/:id')");

    // const select_music_query = `select *, date_format(release_date, "%Y-%m-%d") as release_date_format from music where ?`;
    const select_music_query = "select music.*, date_format(album.release_date, '%Y-%m-%d') as release_date_format from music inner join album on music.album_title = album.album_title where ?";

    conn.query(select_music_query, [{id: req.params.id}], (err, select_music_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.render("edit_music", {title: "EDIT MUSIC", music: select_music_result[0], albumVal: 1});
        }
    })
})
module.exports = router;