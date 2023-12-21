const express = require("express");
const conn = require("../config/mysql");
const { route } = require("./main");
const router = express.Router();
const upload = require("../upload/upload");
const fs = require("fs-extra");

router.get("/", (req, res) => {
    console.log("routes => themeplaylist.js => router.get('/')");

    const select_themeplaylist_query = `select *, date_format(release_date, "%Y.%m.%d") as release_date_format, JSON_LENGTH(JSON_EXTRACT(music_list, '$')) as count from themeplaylist`;
    conn.query(select_themeplaylist_query, (err, select_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.render("themeplaylist", {title: "Theme Playlist", result: select_themeplaylist_result});
        }
    })

})

router.get("/add_themeplaylist", (req, res) => {
    console.log("routes => themeplaylist.js => router.get('/add_themeplaylist')");
    
    res.render("add_themeplaylist.html", {title: "ADD Theme Playlist"});
})


router.post("/add_themeplaylist_form", upload.single("cover_image"), (req, res) => {
    console.log("routes => themeplaylist.js => router.post('/add_themeplaylist_form')");

    const insert_themeplaylist_query = `insert into themeplaylist (themeplstlist_title, description, org_cover_image, cover_image, release_date) values (?, ?, ?, ?, ?)`;

    conn.query(insert_themeplaylist_query, [req.body.themeplaylist_title, req.body.description, req.file.originalname, req.file.filename, req.body.release_date], (err ,insert_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            fs.moveSync("./image/tmp/"+req.file.filename, "./image/themeplaylist/"+req.file.filename);
            res.send("<script>alert('테마 등록 완료'); location.href='/themeplaylist'; </script>");
        }  
    })

})

router.get("/delete/:themeplaylist_id", (req, res) => {
    console.log("routes => themeplaylist.js => router.post('/themeplaylist_id')");

    const delete_themeplaylist_query = `delete from themeplaylist where ?`;
    conn.query(delete_themeplaylist_query, [{themeplaylist_id: req.params.themeplaylist_id}], (err, delete_music_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            // res.send("<script>alert('삭제완료.'); location.href='/music';</script>");
            res.json(1);
        }
    })
})

router.get("/view/:themeplaylist_id", (req, res) => {
    console.log("routes => themeplaylist.js => router.get('/view/:themeplaylist_id')");
    
    let music_array;

    const select_themeplaylist_query = `select themeplaylist_id, themeplaylist_title, music_list from themeplaylist where ?`;
    conn.query(select_themeplaylist_query, [{themeplaylist_id: req.params.themeplaylist_id}], (err, select_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // console.log(select_themeplaylist_result[0].music);
            // console.log(select_themeplaylist_result.music)
            if(!select_themeplaylist_result[0].music_list || select_themeplaylist_result[0].music_list.length === 0){
                res.render("info_themeplaylist", {title: "수록곡", themeplaylist_id: select_themeplaylist_result[0].themeplaylist_id, themeplaylist_title: select_themeplaylist_result[0].themeplaylist_title})
            }
            else{
                let select_music_query = "select music.music_id, music.music_title, artist.artist_name, artist.artist_id from music inner join artist on artist.artist_id = music.artist_id where "
                for(let i=0; i<select_themeplaylist_result[0].music_list.length; i++){
                    if(i == (select_themeplaylist_result[0].music_list.length - 1)){
                        select_music_query += "music.music_id = " + select_themeplaylist_result[0].music_list[i];
                    }
                    else{
                        select_music_query += "music.music_id = " + select_themeplaylist_result[0].music_list[i] + " or ";
                    }
                }
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.render("info_themeplaylist", {title: "수록곡", themeplaylist_id: select_themeplaylist_result[0].themeplaylist_id, themeplaylist_title: select_themeplaylist_result[0].themeplaylist_title, ListMusic: select_music_result});
                    }
                })
            }
        }
    })
})

router.get("/delete_music/:num&:id", (req, res) => {
    console.log("routes => themeplaylist.js => router.get('/delete_music')");

    console.log("num: " + req.params.num);
    console.log("id: " + req.params.id)
    const select_music_query = `select music_list as music from themeplaylist where ?`;

    conn.query(select_music_query, [{themeplaylist_id: req.params.num}], (err, select_music_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            console.log(select_music_result)
            let delete_array = [];
            for(let i=0; i<select_music_result[0].music.length; i++){
                
                if(String(select_music_result[0].music[i]) === req.params.id){
                }
                else{
                    delete_array.push(select_music_result[0].music[i]);
                }
            }
            console.log(delete_array);
            const delete_themeplaylist_query = `update themeplaylist set music_list = "[?]" where themeplaylist_id = ?`;
            conn.query(delete_themeplaylist_query, [delete_array, Number(req.params.num)], (err, delete_themeplaylist_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    res.json(1);
                }
            });
        }
    })
})

router.post("/add_theme_music", (req, res) => {
    console.log("routes => themeplaylist.js => router.post('/add_theme_music')");

    const add_theme_music_query = `select music_list from themeplaylist where ?`;

    conn.query(add_theme_music_query, [{themeplaylist_id: req.body.themeplaylist_id}], (err, add_theme_music_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            let add_array = [];
            if(add_theme_music_result[0].music_list){
                add_array = add_theme_music_result[0].music_list;
            }
            add_array.push(Number(req.body.music_id));

            const delete_themeplaylist_query = `update themeplaylist set music_list = "[?]" where themeplaylist_id = ?`;
            conn.query(delete_themeplaylist_query, [add_array, Number(req.body.themeplaylist_id)], (err, delete_themeplaylist_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    // res.json(1);
                    res.redirect("/themeplaylist/view/"+req.body.themeplaylist_id);
                }
            });
        
        }
    })
})

router.post("/randomInsert", (req, res) => {
    // console.log(req.body);
    if(req.body.genre){
        const select_music_genre_query = `select distinct music_id from music where ? order by rand() limit ?`;
        conn.query(select_music_genre_query, [{genre: req.body.genre}, Number(req.body.number)], (err, select_music_genre_result, fields) => {
            if(err){
                console.err(err);
            }
            else{
                let array = [];
                for(let i=0; i<select_music_genre_result.length; i++){
                    array.push(Number(select_music_genre_result[i].music_id));
                }
                const update_themeplaylist_query = `update themeplaylist set music_list = "[?]" where ?`;
                conn.query(update_themeplaylist_query, [array, {themeplaylist_id: req.body.themeplaylist_id}], (err, update_themeplaylist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.redirect("/themeplaylist/view/"+req.body.themeplaylist_id);
                    }
                })
            }
        })
    }
    else if(req.body.theme){
        const select_music_theme_query = `select distinct music_id from music where ? order by rand() limit ?`;
        conn.query(select_music_theme_query, [{theme: req.body.theme}, Number(req.body.number)], (err, select_music_theme_result, fields) => {
            if(err){
                console.err(err);
            }
            else{
                let array = [];
                for(let i=0; i<select_music_theme_result.length; i++){
                    array.push(Number(select_music_theme_result[i].music_id));
                }
                const update_themeplaylist_query = `update themeplaylist set music_list = "[?]" where ?`;
                conn.query(update_themeplaylist_query, [array, {themeplaylist_id: req.body.themeplaylist_id}], (err, update_themeplaylist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.redirect("/themeplaylist/view/"+req.body.themeplaylist_id);
                    }
                })
            }
        })
    }
    else if(req.body.season){
        const select_music_season_query = `select distinct music_id from music where ? order by rand() limit ?`;
        conn.query(select_music_season_query, [{season: req.body.season}, Number(req.body.number)], (err, select_music_season_result, fields) => {
            if(err){
                console.err(err);
            }
            else{
                let array = [];
                for(let i=0; i<select_music_season_result.length; i++){
                    array.push(Number(select_music_season_result[i].music_id));
                }
                const update_themeplaylist_query = `update themeplaylist set music_list = "[?]" where ?`;
                conn.query(update_themeplaylist_query, [array, {themeplaylist_id: req.body.themeplaylist_id}], (err, update_themeplaylist_result, fields) => {
                    if(err){
                        console.error(err);
                    }
                    else{
                        res.redirect("/themeplaylist/view/"+req.body.themeplaylist_id);
                    }
                })
            }
        })
    }
})
module.exports = router;