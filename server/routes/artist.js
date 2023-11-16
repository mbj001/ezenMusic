const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();
//
router.get("/", (req, res) => {
    let setCountsql = `SET @count=0`;
        let updateCountsql = `UPDATE artist SET artist_num = (@count := @count + 1)`;
        conn.query(setCountsql, (err, row, fields) => {
            if (err) {
                console.error(err)
            } else {
                conn.query(updateCountsql, (err, row, fields) => {
                    if (err) {
                        console.error(err)
                    } else {
                        // console.log("삭제성공 번호세팅완료")
                    }
                })
            }
        })
    console.log("routes => artist.js => router.get('/')");
    let sql = `select * from artist order by artist_num desc`;
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
        console.log("*********** DEL 준비")
        let setCountsql = `SET @count=0`;
        let updateCountsql = `UPDATE artist SET artist_num = (@count := @count + 1)`;
        conn.query(setCountsql, (err, row, fields) => {
            if (err) {
                console.error(err)
            } else {
                conn.query(updateCountsql, (err, row, fields) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log("삭제성공 번호세팅완료")
                    }
                })
            }
        })
        const num = req.body.artist_num;
        console.log( num )
        let sql = "delete from artist where artist_num = ?"
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
    res.render("artist_write", { title: "아티스트 추가" });
})
 // insert

.post("/artist_write", (req, res, next) => {
    console.log("routes => artist.js => router.post('/artist_write')");
    const rs = {
        artist_num: req.body.artist_num,
        artist: req.body.artist,
        artist_class: req.body.artist_class,
        artist_gender: req.body.artist_gender,
        artist_genre: req.body.artist_genre
    }
    const insertrs = `insert into artist(artist,artist_class,artist_gender,genre) values('${rs.artist}', '${rs.artist_class}', '${rs.artist_gender}', '${rs.artist_genre}');`;
    conn.query(insertrs, (err, rs) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/artist");
        }
    })
})

//edit
router.get('/artist_edit/:num', (req, res) => {
    console.log("routes => artist.js => router.get ('/artist_edit/:num')")
    const { num } = req.params;
    let sql = `select * from artist where artist_num = ?`;
    conn.query(sql,[num], (err, row, fields) => {
        if (err) {
            console.error(err)
        } else {
            res.render("artist_edit", { title: "Artist Edit", row, artist_num: num })
            console.log(` /////${num} 번 Artist 수정중 ///// `)
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
router.post("/artist_edit/:num", (req, res) => {
        console.log("Data 전송")
        const { num } = req.params;
        const rs = req.body;
    console.log(rs);
    const sql = `update artist set ?, ?, ?, ? where artist_num = ?`;
        // conn.query(sql, updateParams, [num], (err, res, fields) => {
        conn.query(sql, [{ artist: rs.artist }, { artist_class: rs.artist_class }, {artist_gender: rs.artist_gender}, {genre: rs.artist_genre}, num], (err, res, fields) => {
            if (err) {
                console.error(err)
            } else {
                console.log("업데이트 성공")
            }
        })
        res.redirect("/artist")
    })

// update




module.exports = router;
