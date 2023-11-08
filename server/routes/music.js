const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("routes => music.js => router.get('/')");
    // const select_music_query = "select *, date_format(release_date, '%Y-%m-%d') as release_date_format from music";
    const select_music_query = "select music.*, date_format(album.release_date, '%Y-%m-%d') as release_date_format from music inner join album on music.album_title = album.album_title";
    conn.query(select_music_query,(err, select_music_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.render("music", {title: "MUSIC", Music: select_music_result});
        }
    })

})

router.get("/add_music", (req, res) => {
    console.log("routes => music.js => router.get('/add_music')");

    res.render("add_music", {title: "ADD MUSIC"});
})

router.post("/add_music_form", (req, res) => {
    console.log("routes => music.js => router.post('/add_music_form')");
    const music_id = Date.now();
    const insert_music_query = `insert into music (id, title, artist, area, genre, theme, season, composer, lyricist, arranger, album_title, lyrics, hit, featuring) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    conn.query(insert_music_query, [music_id, req.body.title, req.body.artist, req.body.area, req.body.genre, req.body.theme, req.body.season, req.body.composer, req.body.lyricist, req.body.arranger, req.body.album_title, req.body.lyrics, Number(req.body.hit), req.body.featuring], (err, insert_music_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            if(req.body.goToAlbuminfo == 1){
                res.send(`<script>alert('등록완료.'); location.href='/album/view/${req.body.album_title}';</script>`);
            }
            else{
                res.send("<script>alert('등록완료.'); location.href='/music';</script>");
            }
        }
    })
})

router.get("/edit/:id", (req, res) => {
    console.log("routes => music.js => router.get('/edit_music/:id')");

    // const select_music_query = `select *, date_format(release_date, "%Y-%m-%d") as release_date_format from music where ?`;
    const select_music_query = "select music.*, date_format(album.release_date, '%Y-%m-%d') as release_date_format from music inner join album on music.album_title = album.album_title where ?";

    conn.query(select_music_query, [{id: req.params.id}], (err, select_music_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.render("edit_music", {title: "EDIT MUSIC", music: select_music_result[0]});
        }
    })
})

router.post("/edit_music_form", (req, res) => {
    console.log("routes => music.js => router.post('/edit_music_form')");
    const update_music_query = "update music set ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? where ?;"
    conn.query(update_music_query, [{title: req.body.title}, {artist: req.body.artist}, {area: req.body.area}, {genre: req.body.genre}, {theme: req.body.theme}, {season: req.body.season}, {composer: req.body.composer}, {lyricist: req.body.lyricist}, {arranger: req.body.arranger}, {album_title: req.body.album_title}, {lyrics: req.body.lyrics}, {hit: Number(req.body.hit)}, {featuring: req.body.featuring}, {id: Number(req.body.id)}], (err, update_music_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            if(req.body.goToAlbuminfo == 1){
                res.send(`<script>alert('수정완료.'); location.href='/album/view/${req.body.album_title}';</script>`);
            }
            else{
                res.send("<script>alert('수정완료.'); location.href='/music';</script>");
            }
        }
    })
})

router.get("/delete/:id", (req, res) => {
    console.log("routes => music.js => router.get('/delete')");

    const delete_music_query = `delete from music where ?`;
    conn.query(delete_music_query, [{id: req.params.id}], (err, delete_music_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            // res.send("<script>alert('삭제완료.'); location.href='/music';</script>");
            res.json(1);
        }
    })
})
module.exports = router;