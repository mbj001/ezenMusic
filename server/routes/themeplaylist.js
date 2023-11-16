const express = require("express");
const conn = require("../config/mysql");
const { route } = require("./main");
const router = express.Router();
const upload = require("../upload/upload");
const fs = require("fs-extra");

router.get("/", (req, res) => {
    console.log("routes => themeplaylist.js => router.get('/')");

    const select_themeplaylist_query = `select *, date_format(release_date, "%Y.%m.%d") as release_date_format from themeplaylist`;
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

    const insert_themeplaylist_query = `insert into themeplaylist (themetitle, description, org_cover_image, cover_image, release_date) values (?, ?, ?, ?, ?)`;

    conn.query(insert_themeplaylist_query, [req.body.themetitle, req.body.description, req.file.originalname, req.file.filename, req.body.release_date], (err ,insert_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            fs.moveSync("./image/tmp/"+req.file.filename, "./image/themeplaylist/"+req.file.filename);
            res.send("<script>alert('테마 등록 완료'); location.href='/themeplaylist'; </script>");
        }  
    })

})

router.get("/delete/:num", (req, res) => {
    console.log("routes => themeplaylist.js => router.post('/delete:num')");

    const delete_themeplaylist_query = `delete from themeplaylist where ?`;
    conn.query(delete_themeplaylist_query, [{num: req.params.num}], (err, delete_music_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            // res.send("<script>alert('삭제완료.'); location.href='/music';</script>");
            res.json(1);
        }
    })
})

router.get("/view/:num", (req, res) => {
    console.log("routes => themeplaylist.js => router.get('/view/:id')");
    
    let music_array;

    const select_themeplaylist_query = `select num, themetitle, music from themeplaylist where ?`;
    conn.query(select_themeplaylist_query, [{num: req.params.num}], (err, select_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // console.log(select_themeplaylist_result[0].music);
            // console.log(select_themeplaylist_result.music)
            if(!select_themeplaylist_result[0].music){
                res.render("info_themeplaylist", {title: "수록곡", num: select_themeplaylist_result[0].num, themetitle: select_themeplaylist_result[0].themetitle})
            }
            else{
                let select_music_query = "select id, title, artist from music where "
                for(let i=0; i<select_themeplaylist_result[0].music.length; i++){
                    console.log(select_themeplaylist_result[0].music[i]);
                    if(i == (select_themeplaylist_result[0].music.length - 1)){
                        select_music_query += "id = " + select_themeplaylist_result[0].music[i];
                    }
                    else{
                        select_music_query += "id = " + select_themeplaylist_result[0].music[i] + " or ";
                    }
                }
                console.log(select_music_query);
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        console.log(select_music_result);
                        res.render("info_themeplaylist", {title: "수록곡", num: select_themeplaylist_result[0].num, themetitle: select_themeplaylist_result[0].themetitle, ListMusic: select_music_result});
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
    const select_music_query = `select music from themeplaylist where ?`;

    conn.query(select_music_query, [{num: req.params.num}], (err, select_music_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            // console.log(typeof(select_music_result[0].music[3]));
            // console.log(typeof(req.params.id));
            let delete_array = [];
            for(let i=0; i<select_music_result[0].music.length; i++){
                
                if(String(select_music_result[0].music[i]) === req.params.id){
                    // console.log("걸림 " + i);
                }
                else{
                    delete_array.push(select_music_result[0].music[i]);
                }
            }
            console.log(delete_array);
            const delete_themeplaylist_query = `update themeplaylist set music = "[?]" where num = ?`;
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
    console.log("routes => themeplaylist.js => router.get('/add_theme_music')");

    console.log(req.body);

    const add_theme_music_query = `select music from themeplaylist where ?`;

    conn.query(add_theme_music_query, [{num: req.body.num}], (err, add_theme_music_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            let add_array = [];
            if(add_theme_music_result[0].music){
                add_array = add_theme_music_result[0].music;
            }
            add_array.push(Number(req.body.id));

            const delete_themeplaylist_query = `update themeplaylist set music = "[?]" where num = ?`;
            conn.query(delete_themeplaylist_query, [add_array, Number(req.body.num)], (err, delete_themeplaylist_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    // res.json(1);
                    res.redirect("/themeplaylist/view/"+req.body.num);
                }
            });
        
        }
    })
})
module.exports = router;