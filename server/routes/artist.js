const express = require("express");
const conn = require("../config/mysql");
const { single } = require("../upload/upload");
const router = express.Router();
const upload = require("../upload/upload")
const fs = require('fs-extra');
//
router.get("/", (req, res) => {
    console.log("routes => artist.js => router.get('/artist')");

    let sql = `select * from artist order by artist_id desc`;
    conn.query(sql, (err, row, fields) => {
        if (err) {
            console.log(err)
        } else {
            res.render('artist', { title: "Artist list", row })
        }
    })
})
//del
    .post("/", (req, res) => {
        const num = req.body.artist_id;
        console.log( num )
        let sql = "delete from artist where artist_id = ?"
        conn.query(sql, num , (err, row, fields) => {
            if (err) {
                console.error(err)
            } else {
                // res.render("artist",{title:"Artist List",row})
                res.redirect("/artist");
            }
        })
    })
    

router.get("/artist_write", (req, res) => {
    console.log("routes => artist.js => router.get('/artist_write')")
    res.render("artist_write", { title: "아티스트 추가" });
})
 // insert

.post("/artist_write", upload.single("artist_image"), (req, res) => {
    console.log("routes => artist.js => router.post('/artist_write')");
    const insertrs = `insert into artist (org_artist_image, artist_image, artist_name, artist_class, artist_gender, genre) values (?,?,?,?,?,?)`;
    conn.query(insertrs, [req.file.originalname, req.file.filename, req.body.artist_name, req.body.artist_class, req.body.artist_gender, req.body.artist_genre],(err, rs, fields) => {
        if(err) {
            console.error(err)
        } else {
            console.log("아티스트 등록성공")
            fs.moveSync("./image/tmp/"+req.file.filename, "./image/artist/"+req.file.filename);
            res.redirect("/artist");
        }
    })
})

//edit
router.get('/artist_edit/:num', (req, res) => {
    console.log("routes => artist.js => router.get ('/artist_edit/:num')")
    let sql = `select * from artist where artist_id = ?`;
    // console.log(req.file);
    // console.log(req.body);
    conn.query(sql,[req.params.num], (err, row, fields) => {
        if (err) {
            console.error(err)
        } else {
            res.render("artist_edit", { title: "Artist Edit", row, artist_id: req.params.num })
        }
    })
})
    // router.post("/artist_edit", (req, res) => {
    //     console.log("Data 전송")
    //     const { num } = req.params;
    //     const rs = req.body;
    //     const updateParams = [
    //         {
    //             artist: rs.artist
    //         },
    //         {
    //             artist_class: rs.artist_class,
    //         },
    //         {
    //             artist_gender: rs.artist_gender,
    //         },
    //         {
    //             artist_genre: rs.genre
    //         }
    //     ]
    //     const sql = `update artist set ? where artist_num = ?`;
    //     conn.query(sql, updateParams, [num], (err, res, fields) => {
    //         if (err) {
    //             console.log(err +"업데이트 실패")
    //         } else {
    //             console.log("업데이트 성공")
    //         }
    //     })
    //     res.redirect("/")
// })
    
// MBJ
router.post("/artist_edit", upload.single("artist_image"),(req, res) => {
        console.log("Data 전송")

        if(req.file === undefined){
            const sql = `update artist set ?,?,?,? where artist_num = ?`;
            conn.query(sql, [{artist_name: req.body.artist_name}, {artist_class: req.body.artist_class}, {artist_gender: req.body.artist_gender}, {genre: req.body.artist_genre}, Number(req.body.artist_id)], (err, sql_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    let sql = `select * from artist order by artist_num desc`;
                    conn.query(sql, (err, row, fields) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.render('artist', { title: "Artist list", row })
                        }
                    })                
                }
            })
        }
})

// update

module.exports = router;
