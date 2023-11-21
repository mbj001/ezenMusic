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
            console.log(select_detail_result.length);
            res.send(select_detail_result);
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

router.get("/playerbar", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/playerbar')");

    const select_playerbar_query = `select *, album.org_cover_image from music inner join album on music.album_title = album.album_title order by music.hit desc limit 20`;
    conn.query(select_playerbar_query, (err, select_playerbar_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            res.send(select_playerbar_result);
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

//artist (이재호)
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
    const select_artist_album = 'select album.* from album inner join artist on album.artist = artist.artist where album.artist = ?';
    conn.query(select_artist_album, [req.params.artist], (err, select_artist_album_result, fields) => {
        if (err) {
            console.error(err)
        } else {
            res.send(select_artist_album_result);
        }
    })
})

// 건우
router.get('/storage/mylist/:userid', async(req, res) =>{
    console.log("routes => ezenmusic.js => router.get('/storage/mylist/:userid')");
    // console.log('1');
    // let [result] = '';
    try{
        const {userid} = req.params;
        const sql = `select num from playlist where userid = ${userid}`
        const [rs] = await pool.query(sql);
        // console.log(rs);
        let ornum = `num = ` + rs[0].num;
        for(i = 1; i < rs.length; i++){
            ornum += ` or num = ${rs[i].num}`;
        }
        // console.log(ornum);
        const sql2 = `select music.album_title from playlist inner join music on playlist.thumbnail_music = music.id where ${ornum}`
        const [rs2] = await pool.query(sql2);
        // console.log(rs2);
        let ortitle = `album_title = "${rs2[0].album_title}"`;
        for(i = 1; i < rs2.length; i++){
            ortitle += ` or album_title = "${rs2[i].album_title}"`;
        }
        // console.log(ortitle);
        const sql3 = `select org_cover_image from album where ${ortitle}`
        const [rs3] = await pool.query(sql3);
        // console.log(rs3);
        res.send(rs3);
        return rs3;
    }catch(err){
        return err;
    }
});


router.get('/detail/detailmylist/:num', async(req, res) =>{
    console.log('/detail/detailmylist/:playlist_id 진입')
    const {num} = req.params;
    const sql = `select playlist from playlist where num = ?`;
    // console.log(num);
    try{
        // 플레이리스트의 노래 목록을 뽑아내자
        let [rs] = await pool.query(sql, [num]);
        let all_music = rs[0].playlist;
        // console.log(all_music);
        let ormusic = all_music[0];
        for(i = 1; i < all_music.length; i ++){
            // console.log("and music.id = " + all_music[i + 1]);
            // let firstOne = all_music[0];
            // let twoOrMore = "and id = " + all_music[i + 1];
            // 나중에 뽑을 데이터의 조인값을 찾기위해 album.title을 찾자
            // length 로 limit걸면 마지막 undefined를 뺄 수 있겠지?
            ormusic += ' or id = ' + all_music[i]
        }
        // console.log(ormusic);
        const sql2 = `select album_title from music where id = ${ormusic}`;
        // console.log(sql2);
        const [rs2] = await pool.query(sql2);
        // console.log(rs2);
        let sumormusic = ` music.id = ${all_music[0]}`;
        // ormusic = all_music[0];
        // console.log(all_music[0].length);
        for(i = 1; i < rs2.length; i++){
            sumormusic += ` or music.id = ${all_music[i]}`;
        }
        // console.log(sumormusic);
        const sql3 = `select distinct album.album_title, album.org_cover_image, music.id, music.title, music.artist, album.album_id, artist.artist_num from album inner join music
                      on album.album_title = music.album_title inner join artist on music.artist = artist.artist where ${sumormusic}`;
        // console.log(sql3);
        const [rs3] = await pool.query(sql3);
        // console.log(rs3);
        // select distinct album.album_title, album.org_cover_image, music.id, music.title, music.artist from album inner join music
        // on album.album_title = music.album_title where (album.album_title = 'Nine Track Mind (Deluxe Edition)' and music.id = 1699408276148)
        // or (album.album_title = "I'VE MINE" and music.id = 1699518469448) or (album.album_title = 'Love Lee' and music.id = 1699518543715);
        
        // let all_album = rs2[i].album_title;
        // console.log(all_album);

        // console.log(rs2);
        // console.log(rs3);
        res.send(rs3);
        return rs3;
    }catch(err){
        return err;
    }
})
module.exports = router;