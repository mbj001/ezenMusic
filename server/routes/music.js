const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("routes => music.js => router.get('/')");
    // const select_music_query = "select *, date_format(release_date, '%Y-%m-%d') as release_date_format from music";
    const select_music_query = `select music.*, date_format(album.release_date, '%Y-%m-%d'), album.album_title, artist.artist_name as release_date_format from music 
    inner join album on music.album_id = album.album_id inner join artist on artist.artist_id = music.artist_id`;
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
    const insert_music_query = `insert into music (music_id, music_title, artist_id, area, genre, theme, season, composer, lyricist, arranger, album_id, lyrics, hit, featuring) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    conn.query(insert_music_query, [music_id, req.body.music_title, Number(req.body.artist_id), req.body.area, req.body.genre, req.body.theme, req.body.season, req.body.composer, req.body.lyricist, req.body.arranger, Number(req.body.album_id), req.body.lyrics, Number(req.body.hit), req.body.featuring], (err, insert_music_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            if(req.body.goToAlbuminfo == 1){
                res.send(`<script>alert('등록완료.'); location.href='/album/view/${req.body.album_id}';</script>`);
            }
            else{
                res.send("<script>alert('등록완료.'); location.href='/music';</script>");
            }
        }
    })
})

router.get("/edit/:music_id", (req, res) => {
    console.log("routes => music.js => router.get('/edit/:music_id')");

    // const select_music_query = `select *, date_format(release_date, "%Y-%m-%d") as release_date_format from music where ?`;
    const select_music_query = `select music.*, date_format(album.release_date, '%Y-%m-%d'), album.album_title, artist.artist_name as release_date_format from music 
    inner join album on music.album_title = album.album_title inner join artist on artist.artist_id = music.artist_id where ?`;

    conn.query(select_music_query, [{music_id: req.params.music_id}], (err, select_music_result, fields) => {
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
    console.log(req.body);
    conn.query(update_music_query, [{music_title: req.body.music_title}, {artist_id: Number(req.body.artist_id)}, {area: req.body.area}, {genre: req.body.genre}, 
        {theme: req.body.theme}, {season: req.body.season}, {composer: req.body.composer}, {lyricist: req.body.lyricist}, {arranger: req.body.arranger}, 
        {album_id: Number(req.body.album_id)}, {lyrics: req.body.lyrics}, {hit: Number(req.body.hit)}, {featuring: req.body.featuring}, {music_id: req.body.music_id}], (err, update_music_result, fields) => {
        
        if(err){
            console.error(err);
        }
        else{
            console.log("수정 완료");
            if(req.body.goToAlbuminfo == 1){
                res.send(`<script>alert('수정완료.'); location.href='/album/view/${req.body.album_id}';</script>`);
            }
            else{
                res.send("<script>alert('수정완료.'); location.href='/music';</script>");
            }
        }
    })
})

router.get("/delete/:music_id", (req, res) => {
    console.log("routes => music.js => router.get('/delete')");

    const delete_music_query = `delete from music where ?`;
    conn.query(delete_music_query, [{music_id: req.params.music_id}], (err, delete_music_result, fields) => {
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