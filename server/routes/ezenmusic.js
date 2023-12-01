const express = require("express");
const conn = require("../config/mysql")
// const cors = require("cors");

const router = express.Router();
// router.use(cors());
const mysql2 = require('mysql2/promise');
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Qudwns12!',
    connectionLimit: 10,
    database: 'flodb'
});

router.get("/flochart/:num", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/flochart')");
    let select_music_query;
    switch(parseInt(req.params.num)){
        case 1:
            // flo 차트
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist order by music.hit desc limit 50`;
            break;
        case 2:
            // 해외 소셜차트 (pop, social)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "pop" and music.genre ="social"`;
            break;
        case 3:
            // 국내 발라드 (kpop, ballade)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "kpop" and music.genre ="ballade"`;
            break;
        case 4:
            // 해외 팝  (pop, pop)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "pop" and music.genre ="pop"`;
            break;
        case 5:
            // 국내 댄스/일렉  (kpop, dance, electronic)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "kpop" and (music.genre ="dance" or music.genre = "electronic")`;
            break;
        case 6:
            // 국내 알앤비  (kpop, R&B)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "kpop" and music.genre ="R&B"`;
            break;
        case 7:
            // 국내 힙합  (kpop, hiphop)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "kpop" and music.genre ="hiphop"`;
            break;
        case 8:
            // 트로트  (kpop, trot)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "kpop" and music.genre ="trot"`;
            break;
        case 9:
            // 해외 알앤비  (pop, R&B)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "pop" and music.genre ="R&B"`;
            break;
        case 10:
            // 해외 힙합  (pop, hiphop)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "pop" and music.genre ="hiphop"`;
            break;
        case 11:
            // OST  (ost)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.genre ="ost"`;
            break;
        case 12:
            // 키즈  (kiz)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.genre ="kiz"`;
            break;
        case 13:
            // 국내 인디  (kpop, indie)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "kpop" and music.genre ="indie"`;
            break;
        case 14:
            // 클래식  (classic)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.genre ="classic"`;
            break;
        case 15:
            // 국내 어쿠스틱 (kpop, acoustic)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "kpop" and music.genre ="acoustic"`;
            break;
        case 16:
            // 해외 일렉트로닉 (pop, electronic)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.area = "pop" and (music.genre ="electronic" or music.genre="dance")`;
            break;
        case 17:
            // CCM (ccm)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_num, album.album_id from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.genre ="ccm"`;
            break;
    }

    conn.query(select_music_query, (err, select_music_result, fields) => {
        res.send(select_music_result);
    })
})

router.get("/detail/:id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/:id')");

    const select_detail_query = `select music.*, album.org_cover_image, album.album_id from music inner join album on music.album_title = album.album_title where ?`;
    conn.query(select_detail_query, [{id: req.params.id}], (err, select_detail_result, fields) => {
        res.send(select_detail_result);
    })
})

router.get("/similar/:genre", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/similar/:genre')");

    const select_similar_query = `select music.*, album.org_cover_image, album.album_id, artist.artist_num from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.genre = ?`
    conn.query(select_similar_query, [req.params.genre], (err, select_similar_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_similar_result)
        }
    })
})

router.get("/detail/album/:id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/album/:id')");

    // const select_detail_query = `select album.* from album inner join music on music.album_title = album.album_title where music.id = ?`;
    const select_detail_query = `select * from album where album.album_id = ?`;

    conn.query(select_detail_query, [req.params.id], (err, select_detail_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_detail_result);
        }
    })
})

router.post("/detail/album_theme/likey", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/detail/album_theme/likey')");
    // console.log(req.body);
    const select_likey_query = `select * from likey where ? and ?`;

    conn.query(select_likey_query, [{division: req.body.division}, {userid: req.body.userid}], (err, select_likey_result, fields) => {
        // console.log(select_likey_result[0].music_list);
        if(err){
            console.error(err)
        }
        else{
            if(select_likey_result.length == 0){
                res.json(-1);
            }
            else{
                res.send(select_likey_result[0].music_list);
            }
        }
    })
})

router.get("/detail/album/albumtrack/:album_title", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/album/albumtrack/:album_title')");
    
    const select_albumtrack_query = `select music.*, album.org_cover_image, album.album_id, artist.artist_num from music inner join album on music.album_title = album.album_title inner join artist on artist.artist = music.artist where music.album_title = ?`
    conn.query(select_albumtrack_query, [req.params.album_title], (err, select_albumtrack_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_albumtrack_result);
        }
    })
})

router.post("/test", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/test')");

    console.log(req.body);

    res.json(1);
})

router.post("/playerbar", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/playerbar')");

    const select_playerlist_query = `select now_play_music, music_list from playerlist where ?`;
    conn.query(select_playerlist_query, [{userid: req.body.userid}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // playerlist 없을 때
            if(select_playerlist_result.length == 0){
                console.log("playerlist 없음");
                res.json(-1);
            }
            else{
                if(select_playerlist_result[0].music_list.length == 0){
                    // 길이 0일 때
                }
                else{
                    let array = select_playerlist_result[0].music_list;
                    let select_music_query = `select *, album.org_cover_image from music inner join album on music.album_title = album.album_title where `;
                    for(let i=0; i<array.length; i++){
                        if(i == (array.length - 1)){
                            select_music_query += "music.id = " + array[i];
                        }
                        else{
                            select_music_query += "music.id = " + array[i] + " or ";
                        }
                    }
                    select_music_query += " order by field(music.id, ";
                    for(let i=array.length - 1; i>=0; i--){
                        if(i == 0){
                            select_music_query +=  array[i];
                        }
                        else{
                            select_music_query += array[i] + ",";
                        }
                    }
                    select_music_query += ")";
                    conn.query(select_music_query, (err, select_music_result, fields) => {
                        if(err){
                            console.error(err);
                        }
                        else{
                            for(let i=0; i<select_music_result.length; i++){
                                // 지금 재생 중인 음악에는 true, 나머지에는 false 할당
                                if(Number(select_playerlist_result[0].now_play_music) === Number(select_music_result[i].id)){
                                    select_music_result[i].now_play_music = true;
                                }
                                else{
                                    select_music_result[i].now_play_music = false;
                                }
                            }
                            res.send(select_music_result);
                        }
                    })
                }
            }
        }
    })
})


//////////////////// MAIN BANNER ////////////////////
router.get("/mainbanner", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/mainbanner')");
    const select_mainbanner_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format from themeplaylist limit 5";
    conn.query(select_mainbanner_query, (err, select_mainbanner_result, fields) => {
        // console.log(select_mainbanner_result)
        res.send(select_mainbanner_result);
    })
})


router.get("/mainbannermusic/:num", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/mainbannermusic/:num')");

    const select_themeplaylist_query = `select music from themeplaylist where ?`
    conn.query(select_themeplaylist_query, [{num: req.params.num}], (err, select_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{


        let select_music_query = "select *, album.org_cover_image, album.album_id from music inner join album on music.album_title = album.album_title where "
            for(let i=0; i<8; i++){
            // for(let i=0; i<select_themeplaylist_result[0].music.length; i++){
                if(i == 7){
                        select_music_query += "music.id = " + select_themeplaylist_result[0].music[i];
                }
                else{
                    select_music_query += "music.id = " + select_themeplaylist_result[0].music[i] + " or ";
                }
            }
            conn.query(select_music_query, (err, select_music_result, fields) => {
                if(err){
                    console.log(err)
                }
                else{
                    // console.log(select_music_result);
                    // res.render("info_themeplaylist", {title: "수록곡", num: select_themeplaylist_result[0].num, themetitle: select_themeplaylist_result[0].themetitle, ListMusic: select_music_result});
                    res.send(select_music_result);
                }
            })
        }
    })

    // console.log(req.params.num);
})

router.get("/channel/:num", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/channel/:num')");
    const select_themeplaylist_query = "select music from themeplaylist where ?"
    let array = [];
    conn.query(select_themeplaylist_query, [{num: req.params.num}], (err, select_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            let select_music_query = "select music.*, album.org_cover_image, album.album_id, artist.artist_num from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where ";
            for(let i=0; i<select_themeplaylist_result[0].music.length; i++){
                if(i == (select_themeplaylist_result[0].music.length - 1)){
                    select_music_query += "music.id = " + select_themeplaylist_result[0].music[i];
            }
            else{
                select_music_query += "music.id = " + select_themeplaylist_result[0].music[i] + " or ";
            }
            }
            // console.log(select_themeplaylist_result[0].music.length);
            conn.query(select_music_query, (err, select_music_result, fields) => {
                res.send(select_music_result);
            })
        }
    })
})

router.get("/channelinfo/:num", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/channelinfo/:num')");

    const select_themeplaylist_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format from themeplaylist where ?"
    conn.query(select_themeplaylist_query, [{num: req.params.num}], (err, select_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_themeplaylist_result);
        }
    })
})

router.get("/todayrelease", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/todayrelease')");
    // const select_mainbanner_query = "select *, org_cover_image from music inner join album on music.album_title = album.album_title order by hit desc limit 30";
    const select_mainbanner_query = "select * from album limit 30";
    conn.query(select_mainbanner_query, (err, select_mainbanner_result, fields) => {
        // console.log(select_mainbanner_result)
        res.send(select_mainbanner_result);
    })
})

router.get("/moodbanner", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/moodbanner')");
    const select_mainbanner_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format from themeplaylist limit 8";
    conn.query(select_mainbanner_query, (err, select_mainbanner_result, fields) => {
        // console.log(select_mainbanner_result)
        res.send(select_mainbanner_result);
    })
})

router.get("/seasonbanner", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/seasonbanner')");
    const select_mainbanner_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format from themeplaylist order by num desc limit 8 ";
    conn.query(select_mainbanner_query, (err, select_mainbanner_result, fields) => {
        // console.log(select_mainbanner_result)
        res.send(select_mainbanner_result);
    })
})

router.get("/genrebanner", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/genrebanner')");

    const select_genrebanner_query = "select * from genre_table";
    conn.query(select_genrebanner_query, (err, select_genrebanner_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_genrebanner_result);
        }
    })
})

router.get("/detail/chart/:genre_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/chart/:genre_id')");

    const select_genre_query = `select * from genre_table where ?`
    conn.query(select_genre_query, [{genre_id: req.params.genre_id}], (err, select_genre_result, fields) => {
        const select_chart_query = `select music.*, album.org_cover_image, album.album_id, artist.artist_num from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.genre = ? and music.area = ? order by music.hit desc`
        conn.query(select_chart_query, [select_genre_result[0].genre, select_genre_result[0].area], (err, select_chart_result, fields) => {
                if(err){
                console.error(err)
            }
            else{
                // console.log(select_chart_result);
                res.send(select_chart_result);
            }
        })
    })
})

router.get("/detail/chartinfo/:genre_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/chartinfo/:genre_id')");
    const select_genre_query = `select * from genre_table where ?`
    conn.query(select_genre_query, [{genre_id: req.params.genre_id}], (err, select_genre_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // console.log(select_chart_result);
            res.send(select_genre_result);
        }
    })
})

router.get("/search/track/:keyward", (req, res) => {
    // console.log(req.params.keyward);
    console.log("routes => ezenmusic.js => router.get('/search/track/:keyward')");

    const select_track_query = `select *, org_cover_image, album.album_id, artist.artist_num from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where music.artist like ? or music.album_title like ? or music.title like ?`;
    conn.query(select_track_query, ["%"+req.params.keyward+"%", "%"+req.params.keyward+"%", "%"+req.params.keyward+"%"], (err, select_track_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_track_result);
        }
    })
});

router.get("/search/artist/:keyward", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/search/artist/:keyward')");
    // console.log(req.params.keyward);
    const select_artist_query = `select * from artist where artist.artist like ?`;
    conn.query(select_artist_query, ["%"+req.params.keyward+"%"], (err, select_artist_result, fiedls) => {
        if(err){
            console.error(err);
        }
        else{
            res.send(select_artist_result);
        }
    })
})

router.get("/search/album/:keyward", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/search/album/:keyward')");

    const select_album_query = `select *, date_format(release_date, "%Y.%m.%d") as release_date_format from album where album_title like ? or artist like ?`;
    conn.query(select_album_query, ["%"+req.params.keyward+"%", "%"+req.params.keyward+"%"], (err, select_album_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // console.log(select_album_result);
            res.send(select_album_result);
        }
    })
})

router.get("/search/theme/:keyward", (req, res) =>{
    console.log("routes => ezenmusic.js => router.get('/search/theme/:keyward')");

    const select_theme_query = `select * from themeplaylist where themetitle like ?`;
    conn.query(select_theme_query, ["%"+req.params.keyward+"%"], (err, select_theme_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            res.send(select_theme_result);
        }
    })

})

router.get("/search/lyrics/:keyward", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/search/lyrics/:keyward')");

    const select_lyrics_query = `select music.*, album.org_cover_image from music inner join album on music.album_title = album.album_title where music.artist like ?`;
    conn.query(select_lyrics_query, ["%"+req.params.keyward+"%"], (err, select_lyrics_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_lyrics_result);
        }
    })
})

router.post("/allpage/likeylist", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/allpage/likeylist/:userid')");

    const select_likey_query = `select music_list from likey where ? and ?`;
    conn.query(select_likey_query, [{userid: req.body.userid}, {division: req.body.division}], (err, select_likey_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // likey 테이블에 정보가 없을 때
            if(select_likey_result.length == 0){
                res.json(-1);
            }
            else{
                res.send(select_likey_result);
            }
        }
    })
})

router.post("/likey/liketrack", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/likey/liketrack')");

    const select_musiclist_query = `select music_list from likey where ? and ?`;
    conn.query(select_musiclist_query, [{userid: req.body.userid}, {division: req.body.division}], (err, select_musiclist_result, feilds) => {
        if(err){
            console.error(err);
        }
        else{
            res.send(select_musiclist_result[0].music_list);
        }
    })
})

router.post("/addlikey", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/addlikey')");
    console.log(req.body.userid);
    const select_likey_query = `select * from likey where ? and ?`;
    conn.query(select_likey_query, [{userid: req.body.userid}, {division: req.body.division}], (err, select_likey_result, fields) => {
        if(err){
            console.log(err)
        }
        else{
            // liketrack 정보가 없을 때
            if(select_likey_result.length == 0){
                const insert_likey_query = `insert into likey (userid, division, music_list) values (?, ?, "[?]")`;
                conn.query(insert_likey_query, [req.body.userid, req.body.division, Number(req.body.id)], (err, insert_likey_result, fields) => {
                    if(err){
                        console.error(err)
                    }
                    else{
                        res.json(1);
                    }
                })
            }
            else{
                // console.log(select_likey_result[0].music_list);
                select_likey_result[0].music_list.push(Number(req.body.id));
                // console.log(select_likey_result[0].music_list);
                const update_likey_query = `update likey set music_list = ? where ? and ?`;
                conn.query(update_likey_query, ["["+select_likey_result[0].music_list+"]", {userid: req.body.userid}, {division: req.body.division}], (err, update_likey_result, fields) => {
                    if(err){
                        console.error(err)
                    }
                    else{
                        res.json("1");
                    }
                })
            }
        }
    })
})

router.post("/dellikey", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/dellikey')");

    const select_likey_query = `select music_list from likey where ? and ?`;
    conn.query(select_likey_query, [{userid: req.body.userid}, {division: req.body.division}], (err, select_likey_result, fields) => {
        if(err){
            console.log(err)
        }
        else{
            for(let i=0; i<select_likey_result[0].music_list.length; i++){
                if(Number(req.body.id) === select_likey_result[0].music_list[i]){
                    array = select_likey_result[0].music_list.splice(i, 1);
                }
            }
            const update_likey_query = `update likey set music_list = ? where ? and ?`;
            conn.query(update_likey_query, ["["+select_likey_result[0].music_list+"]", {userid: req.body.userid}, {division: req.body.division}], (err, update_likey_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    res.json("1");
                }
            })
        }
    })
})

router.post("/likey/delLikeAlbum", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/likey/delLikey/Album')");
    let array = [];
    console.log(req.body);
    const select_likey_query = `select music_list from likey where ? and ?`;
    conn.query(select_likey_query, [{userid: req.body.userid}, {division: req.body.division}], (err, select_likey_result, fields) => {
        if(err){
            console.error(err)
        }
        else{

            for(let i=0; i<select_likey_result[0].music_list.length; i++){
                for(let j=0; j<req.body.likey_id_array.length; j++){

                    if(req.body.likey_id_array[j] === select_likey_result[0].music_list[i]){
                        break;
                    }
                    if(j === req.body.likey_id_array.length - 1){
                        array.push(select_likey_result[0].music_list[i]);
                    }
                }
            }
            console.log(array);

            const update_likey_query = `update likey set music_list = "[?]" where ? and ?`;
            conn.query(update_likey_query, [array, {userid: req.body.userid}, {division: req.body.division}], (err, update_likey_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    res.json(1);
                }
            })
        }
    })
})


router.post('/storage/likey', async(req, res) =>{
    console.log("routes => ezenmusic.js => router.post('/storage/likey') [" + req.body.division + "]");
    // console.log(req.body);
    try{
        const select_likey_query = `select * from likey where userid = "${req.body.userid}" and division = "${req.body.division}"`;

        let [select_likey_result] = await pool.query(select_likey_query);

        // likey 테이블에 liketrack row 가 없을 때 
        if(select_likey_result.length == 0){
            res.json(-1);
        }
        else{
            if(select_likey_result[0].music_list.length === 0){
                res.json(-1);
            }
            else{
                let select_music_query = "select music.*, album.org_cover_image, album.album_id, artist.artist_num from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where ";
                for(let i=0; i<select_likey_result[0].music_list.length; i++){
                    if(i == (select_likey_result[0].music_list.length - 1)){
                        select_music_query += "music.id = " + select_likey_result[0].music_list[i];
                }
                    else{
                        select_music_query += "music.id = " + select_likey_result[0].music_list[i] + " or ";
                    }
                }
                select_music_query += " order by field(music.id";
        
                for(let i=select_likey_result[0].music_list.length - 1; i>=0; i--){
                    select_music_query += ", " + select_likey_result[0].music_list[i];
                }
                select_music_query += ")"
        
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.send(select_music_result);
                    }
                })
            }
        }
    }catch(err){
        return err;
    }
})


router.post("/storage/likealbum", async(req, res) => {
    console.log("routes => ezenmusic.js => router.post('/storage/likeyalbum') [" + req.body.division + "]");

    try{
        const select_likey_query = `select * from likey where userid = "${req.body.userid}" and division = "${req.body.division}"`;
        let [select_likey_result] = await pool.query(select_likey_query);

        if(select_likey_result.length == 0){
            res.json(-1);
        }
        else{
            if(select_likey_result[0].music_list.length === 0){
                res.json(-1);
            }
            else{
                let select_music_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format, artist.artist_num from album inner join artist on artist.artist = album.artist where ";
                for(let i=0; i<select_likey_result[0].music_list.length; i++){
                    if(i == (select_likey_result[0].music_list.length - 1)){
                        select_music_query += "album_id = " + select_likey_result[0].music_list[i];
                }
                    else{
                        select_music_query += "album_id = " + select_likey_result[0].music_list[i] + " or ";
                    }
                }
                select_music_query += " order by field(album_id";
        
                for(let i=select_likey_result[0].music_list.length - 1; i>=0; i--){
                    select_music_query += ", " + select_likey_result[0].music_list[i];
                }
                select_music_query += ")"
        
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    // console.log(select_music_query);
                    // console.log(select_music_result);
                    res.send(select_music_result);
                })
    
            }
        }
    }catch(err){
        console.error(err);
    }
})

router.post("/storage/liketheme", async(req, res) => {
    console.log("routes => ezenmusic.js => router.post('/storage/liketheme') [" + req.body.division + "]");

    try{
        const select_likey_query = `select * from likey where userid = "${req.body.userid}" and division = "${req.body.division}"`;
        let [select_likey_result] = await pool.query(select_likey_query);

        if(select_likey_result.length == 0){
            res.json(-1);
        }
        else{
            if(select_likey_result[0].music_list.length === 0){
                res.json(-1);
            }
            else{
    
                let select_music_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format, JSON_LENGTH(JSON_EXTRACT(music, '$')) as count from themeplaylist where ";
                for(let i=0; i<select_likey_result[0].music_list.length; i++){
                    if(i == (select_likey_result[0].music_list.length - 1)){
                        select_music_query += "num = " + select_likey_result[0].music_list[i];
                }
                    else{
                        select_music_query += "num = " + select_likey_result[0].music_list[i] + " or ";
                    }
                }
                select_music_query += " order by field(num";
        
                for(let i=select_likey_result[0].music_list.length - 1; i>=0; i--){
                    select_music_query += ", " + select_likey_result[0].music_list[i];
                }
                select_music_query += ")"
        
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    // console.log(select_music_query);
                    // console.log(select_music_result);
                    res.send(select_music_result);
                })
            }
        }

        // return result;
    }catch(err){
        console.error(err);
    }
})

router.post("/storage/likeartist", async(req, res) => {
    console.log("routes => ezenmusic.js => router.post('/storage/likeartist') [" + req.body.division + "]");

    try{
        const select_likey_query = `select * from likey where userid = "${req.body.userid}" and division = "${req.body.division}"`;
        let [select_likey_result] = await pool.query(select_likey_query);

        if(select_likey_result.length == 0){
            res.json(-1);
        }
        else{
            if(select_likey_result[0].music_list.length === 0){
                res.json(-1);
            }
            else{
                let select_music_query = "select * from artist where ";
                for(let i=0; i<select_likey_result[0].music_list.length; i++){
                    if(i == (select_likey_result[0].music_list.length - 1)){
                        select_music_query += "artist_num = " + select_likey_result[0].music_list[i];
                }
                    else{
                        select_music_query += "artist_num = " + select_likey_result[0].music_list[i] + " or ";
                    }
                }
                select_music_query += " order by field(artist_num";
        
                for(let i=select_likey_result[0].music_list.length - 1; i>=0; i--){
                    select_music_query += ", " + select_likey_result[0].music_list[i];
                }
                select_music_query += ")"
        
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    // console.log(select_music_query);
                    // console.log(select_music_result);
                    res.send(select_music_result);
                })
            }
        }

    }catch(err){
        console.error(err);
    }
})

router.get("/testMBJ/:userid", (req, res) => {
    console.log("userid: " + req.params.userid);
})


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// 재호
router.get("/detail/artist/:id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/artist/:id')");
    // const select_detail_artist = `select artist.* from artist inner join music on music.artist = artist.artist where music.id = ?`;
    const select_detail_artist = `select artist.*, music.id, album.album_id from artist inner join music on music.artist = artist.artist inner join album on album.artist = artist.artist where  artist.artist_num = ?`;
    conn.query(select_detail_artist, [req.params.id], (err, select_detail_artist_result, fields) => {
        if(err){
            console.error(err)
        } 
        else{
            res.send(select_detail_artist_result)
        }
    })
})
router.get("/detail/artist/artisttrack/:artist_num", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/artist/artisttrack/:artist')");
    const select_artist_track = `select music.*, album.org_cover_image, album.album_id, artist.artist_num from music inner join album on music.album_title = album.album_title inner join artist on music.artist = artist.artist where artist.artist_num = ?`;
    conn.query(select_artist_track, [Number(req.params.artist_num)], (err, select_artist_track_result, fields) => {
        if(err){
        console.error(err)
        } 
        else{
        res.send(select_artist_track_result)
        }
    })
})

router.get("/detail/artist/albumtrack/:artist", (req, res) => {
    console.log("routes =>ezenmusic.js => router.get('/detail/artist/:id/albumtrack')");
    console.log(req.params.artist);
        //아티스트 앨범목록
        const select_artist_album = `select album.*, DATE_FORMAT(album.release_date, '%Y.%m.%d') as release_date_format
        FROM album inner join artist on album.artist = artist.artist where album.artist = ?`    
    conn.query(select_artist_album, [req.params.artist], (err, select_artist_album_result, fields) => {
            if (err) {
                console.error(err)
            } else {
                res.send(select_artist_album_result);
        }
        })
})

router.get("/detail/artist/albumtrack/release_date/:artist", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/detail/artist/albuntrack/release_date/:artist')");
    const select_artist_album_date = `SELECT album.*, DATE_FORMAT(album.release_date, '%Y.%m.%d') as release_date_format
    FROM album
    INNER JOIN artist ON album.artist = artist.artist
    WHERE album.artist = ?
    ORDER BY album.release_date DESC;
    `;
    conn.query(select_artist_album_date, [req.params.artist], (err, select_artist_album_date_result, fields) => {
        if (err) {
            console.error(err)
        } else {
            res.send(select_artist_album_date_result);
        }
    })
})
router.get("/detail/artist/albumtrack/asc/:artist", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/detail/artist/albumtrack/asc/:artist')");
    const select_artist_albumtitle_asc = `SELECT album.*, DATE_FORMAT(album.release_date, '%Y.%m.%d') as release_date_format
    FROM album
    INNER JOIN artist ON album.artist = artist.artist
    WHERE album.artist = ?
    ORDER BY album.album_title ASC`;
    conn.query(select_artist_albumtitle_asc, [req.params.artist], (err, select_artist_albumtitle_asc_result, fields) => {
        if (err) {
            console.error(err)
        } else {
            res.send(select_artist_albumtitle_asc_result);
        }
    })
})


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// 건우
router.get('/storage/mylist/:userid', async(req, res) =>{
    console.log("routes => ezenmusic.js => router.get('/storage/mylist/:userid')");
    // console.log('1');
    // let [result] = '';
    try{
        const {userid} = req.params;
        const sql = `select playlist_id, thumbnail_image, playlist_name, playlist from playlist where userid = ${userid} order by update_date desc`
        const [rs] = await pool.query(sql);
        // console.log(rs);
        if(rs[0].playlist == null){
            // console.log('1231')
            // console.log(rs)
            res.send(rs);
        }else{
            // console.log(rs);
            res.send(rs);
            let albumImage = `org_cover_image = "${rs[0].thumbnail_image}"`;
            for(i = 1; i < rs.length; i++){
                albumImage += ` or org_cover_image = ${rs[i].thumbnail_image}`
            }
            const sql2 = `select org_cover_image from album where ${albumImage}`;
            const [rs2] = await pool.query(sql2);
            console.log(rs2)
            res.send(rs2);
        }
        
    }catch(err){
        return err;
    }
});


router.get('/detail/detailmylist/:playlist_id', async(req, res) =>{
    console.log("routes => ezenmusic.js => router.get('/detail/detailmylist/:playlist_id')");
    const {playlist_id} = req.params;
    const select_playlist_sql = `select playlist from playlist where playlist_id = ?`;
    // console.log(num);
    try{
        // 플레이리스트의 노래 목록을 뽑아내자
        let [select_playlist_result] = await pool.query(select_playlist_sql, [playlist_id]);
        // console.log(rs);
        if(select_playlist_result[0].playlist == null){
            res.send(select_playlist_result);
        }else{
            
            let select_musiclistcard_result = `select distinct album.album_title, album.org_cover_image, music.id, music.title, music.artist, album.album_id, artist.artist_num 
            from album inner join music on album.album_title = music.album_title inner join artist on music.artist = artist.artist where `;

            for(let i=0; i<select_playlist_result[0].playlist.length; i++){
                if(i == (select_playlist_result[0].playlist.length - 1)){
                    select_musiclistcard_result += "music.id = " + select_playlist_result[0].playlist[i];
            }
            else{
                select_musiclistcard_result += "music.id = " + select_playlist_result[0].playlist[i] + " or ";
            }
            }
            select_musiclistcard_result += " order by field(music.id";
    
            for(let i=select_playlist_result[0].playlist.length - 1; i>=0; i--){
    
                select_musiclistcard_result += ", " + select_playlist_result[0].playlist[i];
            }
    
            select_musiclistcard_result += ")"
            // console.log(select_musiclistcard_result);
            let [select_all_result] = await pool.query(select_musiclistcard_result);
            res.send(select_all_result);
            

        }
    }catch(err){
        console.log(err);
        return err;
    }
})

router.post("/delPlaylist", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/delPlaylist')");
    console.log(req.body);

    let delete_playlist_query = "delete from playlist where ? and ";

    for(let i=0; i<req.body.playlist_id_array.length; i++){
        if(i === req.body.playlist_id_array.length - 1){
            delete_playlist_query += "playlist_id = " + req.body.playlist_id_array[i];
        }
        else{
            delete_playlist_query += "playlist_id = " + req.body.playlist_id_array[i] + " or ";
        }
    }

    conn.query(delete_playlist_query, [{userid: req.body.userid}], (err, delete_playlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.json(1);
        }
    })
})

// 건우파트 병준
// router.post("/detail/detailmylist/playlist", (req, res) => {
//     console.log("routes => ezenmusic.js => router.post('/detail/detailmylist/playlist')");

//     const select_playlist_query = `select playlist from playlist where ?`;
//     conn.query(select_playlist_query, [{playlist_id: req.body.playlist_id}], (err, select_playlist_result, fields) => {
//         if(err){
//             console.error(err)
//         }
//         else{
//             res.send(select_playlist_result[0].playlist);
//         }
//     })
// })
module.exports = router;