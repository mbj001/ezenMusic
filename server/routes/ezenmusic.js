const express = require("express");
const conn = require("../config/mysql")
// const cors = require("cors");

const router = express.Router();
// router.use(cors());
const mysql2 = require('mysql2/promise');
// const pool =  mysql2.createPool({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASS,
//     database: process.env.MYSQL_DB
// });
const pool = require("../config/mysqlPool");


router.get("/flochart/:num", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/flochart')");
    let select_music_query;
    switch(parseInt(req.params.num)){
        case 1:
            // flo 차트
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id order by music.hit desc limit 50;`;
            break;
            
        case 2:
            // 해외 소셜차트 (pop, social)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "pop" order by music.hit desc limit 50;`;
            break;
        case 3:
            // 국내 발라드 (kpop, ballade)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "kpop" and music.genre ="ballad" order by music.hit desc limit 50;`;
            break;
        case 4:
            // 해외 팝  (pop, pop)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "pop" and music.genre ="pop" order by music.hit desc limit 50;`;
            break;
        case 5:
            // 국내 댄스/일렉  (kpop, dance, electronic)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "kpop" and (music.genre ="dance" or music.genre = "electronic") order by music.hit desc limit 50;`;
            break;
        case 6:
            // 국내 알앤비  (kpop, R&B)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "kpop" and music.genre ="R&B" order by music.hit desc limit 50;`;
            break;
        case 7:
            // 국내 힙합  (kpop, hiphop)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "kpop" and music.genre ="hiphop" order by music.hit desc limit 50;`;
            break;
        case 8:
            // 트로트  (kpop, trot)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "kpop" and music.genre ="trot" order by music.hit desc limit 50;`;
            break;
        case 9:
            // 해외 알앤비  (pop, R&B)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "pop" and music.genre ="R&B" order by music.hit desc limit 50;`;
            break;
        case 10:
            // 해외 힙합  (pop, hiphop)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "pop" and music.genre ="hiphop" order by music.hit desc limit 50;`;
            break;
        case 11:
            // OST  (ost)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.genre ="ost" order by music.hit desc limit 50;`;
            break;
        case 12:
            // 키즈  (kids)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.genre ="kids" order by music.hit desc limit 50;`;
            break;
        case 13:
            // 국내 인디  (kpop, indie)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "kpop" and music.genre ="indie" order by music.hit desc limit 50;`;
            break;
        case 14:
            // 클래식  (classic)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.genre ="classic" order by music.hit desc limit 50;`;
            break;
        case 15:
            // 국내 어쿠스틱 (kpop, acoustic)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "kpop" and music.genre ="pop" order by music.hit desc limit 50;`;
            break;
        case 16:
            // 해외 일렉트로닉 (pop, electronic)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.area = "pop" and (music.genre ="electronic" or music.genre="dance") order by music.hit desc limit 50;`;
            break;
        case 17:
            // CCM (ccm)
            select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.genre ="ccm" order by music.hit desc limit 50;`;
            break;
    }

    conn.query(select_music_query, (err, select_music_result, fields) => {
        res.send(select_music_result);
    })
    return ;
})

router.get("/detail/:music_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/:id')");

    const select_detail_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where ?`;
    conn.query(select_detail_query, [{music_id: req.params.music_id}], (err, select_detail_result, fields) => {
        res.send(select_detail_result);
    })
    return ;
})

router.get("/similar/:genre", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/similar/:genre')");

    const select_similar_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.genre = ? order by music.hit limit 30`
    conn.query(select_similar_query, [req.params.genre], (err, select_similar_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_similar_result)
        }
    })
    return ;
})

router.get("/detail/album/:album_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/album/:album_id')");

    const select_detail_query = `select album.*, artist.artist_name from album inner join artist on album.artist_id = artist.artist_id where album.album_id = ?`;

    conn.query(select_detail_query, [req.params.album_id], (err, select_detail_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_detail_result);
        }
    })
    return ;
})

router.post("/detail/album_theme/likey", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/detail/album_theme/likey')");
    // console.log(req.body);
    const select_likey_query = `select * from likey where ? and ?`;

    conn.query(select_likey_query, [{division: req.body.division}, {character_id: req.body.character_id}], (err, select_likey_result, fields) => {
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
        return ;
    })
})

router.get("/detail/album/albumtrack/:album_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/album/albumtrack/:album_id')");
    
    const select_albumtrack_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where album.album_id = ?`
    conn.query(select_albumtrack_query, [Number(req.params.album_id)], (err, select_albumtrack_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_albumtrack_result);
        }
    })
    return ;
})

router.post("/playerbar", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/playerbar')");

    const select_playerlist_query = `select now_play_music, music_list from playerlist where ?`;
    conn.query(select_playerlist_query, [{character_id: req.body.character_id}], (err, select_playerlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // playerlist 없을 때
            if(select_playerlist_result.length == 0){
                // console.log("playerlist 없음");
                res.json(-1);
            }
            else{
                if(select_playerlist_result[0].music_list.length == 0){
                    // 길이 0일 때
                    res.json(-1);
                }
                else{
                    let array = select_playerlist_result[0].music_list;
                    let select_music_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id 
                    inner join artist on music.artist_id = artist.artist_id where `;

                    for(let i=0; i<array.length; i++){
                        if(i == (array.length - 1)){
                            select_music_query += "music.music_id = " + array[i];
                        }
                        else{
                            select_music_query += "music.music_id = " + array[i] + " or ";
                        }
                    }
                    select_music_query += " order by field(music.music_id, ";
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
                                if(Number(select_playerlist_result[0].now_play_music) === Number(select_music_result[i].music_id)){
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
    return ;
})


//////////////////// MAIN BANNER ////////////////////
router.get("/mainbanner", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/mainbanner')");
    const select_mainbanner_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format from themeplaylist order by rand() limit 5";
    conn.query(select_mainbanner_query, (err, select_mainbanner_result, fields) => {
        // console.log(select_mainbanner_result)
        if(err){
            console.error(err)
        }
        else{
            res.send(select_mainbanner_result);
        }
        return;
    })
})


router.get("/mainbannermusic/:themeplaylist_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/mainbannermusic/:themeplaylist_id')");

    const select_themeplaylist_query = `select music_list from themeplaylist where ?`
    conn.query(select_themeplaylist_query, [{themeplaylist_id: req.params.themeplaylist_id}], (err, select_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{


        let select_music_query = `select music.*, album.org_cover_image, album.album_id, album.album_title, artist.artist_name from music 
        inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where `

            for(let i=0; i<8; i++){
            // for(let i=0; i<select_themeplaylist_result[0].music.length; i++){
                if(i == 7){
                        select_music_query += "music.music_id = " + select_themeplaylist_result[0].music_list[i];
                }
                else{
                    select_music_query += "music.music_id = " + select_themeplaylist_result[0].music_list[i] + " or ";
                }
            }
            conn.query(select_music_query, (err, select_music_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    res.send(select_music_result);
                }
                return ;
            })
        }
    })
})

router.get("/channel/:themeplaylist_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/channel/:themeplaylist_id')");
    const select_themeplaylist_query = "select music_list from themeplaylist where ?"
    let array = [];
    conn.query(select_themeplaylist_query, [{themeplaylist_id: req.params.themeplaylist_id}], (err, select_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            let select_music_query = "select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where ";
            for(let i=0; i<select_themeplaylist_result[0].music_list.length; i++){
                if(i == (select_themeplaylist_result[0].music_list.length - 1)){
                    select_music_query += "music.music_id = " + select_themeplaylist_result[0].music_list[i];
            }
            else{
                select_music_query += "music.music_id = " + select_themeplaylist_result[0].music_list[i] + " or ";
            }
            }
            // console.log(select_themeplaylist_result[0].music.length);
            conn.query(select_music_query, (err, select_music_result, fields) => {
                res.send(select_music_result);
            })
        }
        return ;
    })
})

router.get("/channelinfo/:themeplaylist_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/channelinfo/:themeplaylist_id')");

    const select_themeplaylist_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format from themeplaylist where ?"
    conn.query(select_themeplaylist_query, [{themeplaylist_id: req.params.themeplaylist_id}], (err, select_themeplaylist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_themeplaylist_result);
        }
        return ;
    })
})

router.get("/todayrelease", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/todayrelease')");
    // const select_mainbanner_query = "select *, org_cover_image from music inner join album on music.album_title = album.album_title order by hit desc limit 30";
    const select_mainbanner_query = "select album.*, artist.artist_name from album inner join artist on artist.artist_id = album.artist_id order by rand() limit 30";
    conn.query(select_mainbanner_query, (err, select_mainbanner_result, fields) => {
        // console.log(select_mainbanner_result)
        if(err){
            console.error(err);
        }
        else{
            res.send(select_mainbanner_result);
        }
        return ;
    })
})

router.get("/moodbanner", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/moodbanner')");
    const select_mainbanner_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format from themeplaylist order by rand() limit 8";
    conn.query(select_mainbanner_query, (err, select_mainbanner_result, fields) => {
        // console.log(select_mainbanner_result)
        if(err){
            console.error(err)
        }
        else{
            res.send(select_mainbanner_result);
        }
        return ;
    })
})

router.get("/seasonbanner", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/seasonbanner')");
    const select_mainbanner_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format from themeplaylist order by rand() desc limit 8 ";
    conn.query(select_mainbanner_query, (err, select_mainbanner_result, fields) => {
        // console.log(select_mainbanner_result)
        if(err){
            console.error(err)
        }
        else{
            res.send(select_mainbanner_result);
        }
        return ;
    })
})

router.get("/genrebanner", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/genrebanner')");

    const select_genrebanner_query = "select * from genre_table order by rand() limit 10";
    conn.query(select_genrebanner_query, (err, select_genrebanner_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_genrebanner_result);
        }
        return ;
    })
})

router.get("/detail/chart/:genre_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/chart/:genre_id')");

    const select_genre_query = `select * from genre_table where ?`
    conn.query(select_genre_query, [{genre_id: req.params.genre_id}], (err, select_genre_result, fields) => {
        const select_chart_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where music.genre = ? and music.area = ? order by music.hit desc limit 50`
        conn.query(select_chart_query, [select_genre_result[0].genre, select_genre_result[0].area], (err, select_chart_result, fields) => {
                if(err){
                console.error(err)
            }
            else{
                res.send(select_chart_result);
            }
            return ;
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
            res.send(select_genre_result);
        }
        return ;
    })
})

router.get("/search/track/:keyward", (req, res) => {
    // console.log(req.params.keyward);
    console.log("routes => ezenmusic.js => router.get('/search/track/:keyward')");

    const select_track_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where artist.artist_name like ? or music.music_title like ? or album.album_title like ? order by hit desc limit 50`;
    conn.query(select_track_query, ["%"+req.params.keyward+"%", "%"+req.params.keyward+"%", "%"+req.params.keyward+"%"], (err, select_track_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_track_result);
        }
        return ;
    })
});

router.get("/search/artist/:keyward", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/search/artist/:keyward')");
    // console.log(req.params.keyward);
    const select_artist_query = `select * from artist where artist.artist_name like ?`;
    conn.query(select_artist_query, ["%"+req.params.keyward+"%"], (err, select_artist_result, fiedls) => {
        if(err){
            console.error(err);
        }
        else{
            res.send(select_artist_result);
        }
        return ;
    })
})

router.post("/search/album", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/search/album')");
    let select_album_query;
    if(!req.body.sortType){
        select_album_query = `select *, date_format(release_date, "%Y.%m.%d") as release_date_format from album inner join artist on album.artist_id = artist.artist_id where album_title like ? or artist.artist_name like ? `;
    }
    if(req.body.sortType === "RECENCY"){
        select_album_query = `select *, date_format(release_date, "%Y.%m.%d") as release_date_format from album inner join artist on album.artist_id = artist.artist_id where album_title like ? or artist.artist_name like ? order by album.release_date desc`;
    }
    else if(req.body.sortType === "POPULAR"){
        select_album_query = `select *, date_format(release_date, "%Y.%m.%d") as release_date_format from album inner join artist on album.artist_id = artist.artist_id where album_title like ? or artist.artist_name like ? `;
    }
    else if(req.body.sortType === "ALPHABET"){
        select_album_query = `select *, date_format(release_date, "%Y.%m.%d") as release_date_format from album inner join artist on album.artist_id = artist.artist_id where album_title like ? or artist.artist_name like ? order by album.album_title asc`;
    }
    conn.query(select_album_query, ["%"+req.body.keyword+"%", "%"+req.body.keyword+"%"], (err, select_album_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_album_result);
        }
        return ;
    })
})

router.get("/search/theme/:keyward", (req, res) =>{
    console.log("routes => ezenmusic.js => router.get('/search/theme/:keyward')");

    const select_theme_query = `select * from themeplaylist where themeplaylist_title like ?`;
    conn.query(select_theme_query, ["%"+req.params.keyward+"%"], (err, select_theme_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            res.send(select_theme_result);
        }
        return ;
    })

})

router.get("/search/lyrics/:keyward", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/search/lyrics/:keyward')");

    const select_lyrics_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where artist.artist_name like ?`;
    conn.query(select_lyrics_query, ["%"+req.params.keyward+"%"], (err, select_lyrics_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.send(select_lyrics_result);
        }
        return ;
    })
})

router.post("/allpage/likeylist", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/allpage/likeylist')");

    const select_likey_query = `select music_list from likey where ? and ?`;
    conn.query(select_likey_query, [{character_id: req.body.character_id}, {division: req.body.division}], (err, select_likey_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            if(select_likey_result.length == 0){
                res.json(-1);
            }
            // likey 테이블에 music_list 길이가 0일 때
            else if(select_likey_result[0].music_list == 0){
                res.json(-1);
            }
            else{
                res.send(select_likey_result);
            }
        }
        return;
    })
})

router.post("/likey/liketrack", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/likey/liketrack')");

    const select_musiclist_query = `select music_list from likey where ? and ?`;
    conn.query(select_musiclist_query, [{character_id: req.body.character_id}, {division: req.body.division}], (err, select_musiclist_result, feilds) => {
        if(err){
            console.error(err);
        }
        else{
            if(select_musiclist_result.length === 0){
                res.json(-1);
            }
            else{
                res.send(select_musiclist_result[0].music_list);
            }
        }
        return ;
    })
})

router.post("/addlikey", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/addlikey')");
    const select_likey_query = `select * from likey where ? and ?`;
    conn.query(select_likey_query, [{character_id: req.body.character_id}, {division: req.body.division}], (err, select_likey_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            // liketrack 정보가 없을 때
            if(select_likey_result.length === 0){
                const insert_likey_query = `insert into likey (character_id, division, music_list) values (?, ?, "[?]")`;
                conn.query(insert_likey_query, [req.body.character_id, req.body.division, Number(req.body.id)], (err, insert_likey_result, fields) => {
                    if(err){
                        console.error(err)
                    }
                    else{
                        res.json(1);
                    }
                })
            }
            else{
                select_likey_result[0].music_list.push(Number(req.body.id));
                const update_likey_query = `update likey set music_list = ? where ? and ?`;
                conn.query(update_likey_query, ["["+select_likey_result[0].music_list+"]", {character_id: req.body.character_id}, {division: req.body.division}], (err, update_likey_result, fields) => {
                    if(err){
                        console.error(err)
                    }
                    else{
                        res.json("1");
                    }
                })
            }
            return ;
        }
    })
})

router.post("/dellikey", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/dellikey')");

    const select_likey_query = `select music_list from likey where ? and ?`;
    conn.query(select_likey_query, [{character_id: req.body.character_id}, {division: req.body.division}], (err, select_likey_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            for(let i=0; i<select_likey_result[0].music_list.length; i++){
                if(Number(req.body.id) === select_likey_result[0].music_list[i]){
                    array = select_likey_result[0].music_list.splice(i, 1);
                }
            }
            const update_likey_query = `update likey set music_list = ? where ? and ?`;
            conn.query(update_likey_query, ["["+select_likey_result[0].music_list+"]", {character_id: req.body.character_id}, {division: req.body.division}], (err, update_likey_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    res.json("1");
                }
            })
        }
        return ;
    })
})


router.post("/likey/delLikeAlbum", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/likey/delLikeAlbum')");

    let array = [];
    const select_likey_query = `select music_list from likey where ? and ?`;
    conn.query(select_likey_query, [{character_id: req.body.character_id}, {division: req.body.division}], (err, select_likey_result, fields) => {
        if(err){
            console.error(err)
        }
        else{

            for(let i=0; i<select_likey_result[0].music_list.length; i++){
                for(let j=0; j<req.body.likey_id_array.length; j++){

                    if(Number(req.body.likey_id_array[j]) === select_likey_result[0].music_list[i]){
                        break;
                    }
                    if(j === req.body.likey_id_array.length - 1){
                        array.push(select_likey_result[0].music_list[i]);
                    }
                }
            }

            const update_likey_query = `update likey set music_list = "[?]" where ? and ?`;
            conn.query(update_likey_query, [array, {character_id: req.body.character_id}, {division: req.body.division}], (err, update_likey_result, fields) => {
                if(err){
                    console.error(err)
                }
                else{
                    res.json(1);
                }
            })
        }
        return ;
    })
})


router.post('/storage/likey', async(req, res) =>{
    console.log("routes => ezenmusic.js => router.post('/storage/likey') [" + req.body.division + "]");
    // console.log(req.body);
    try{
        const select_likey_query = `select * from likey where character_id = "${req.body.character_id}" and division = "${req.body.division}"`;

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
                let select_music_query = "select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where ";
                for(let i=0; i<select_likey_result[0].music_list.length; i++){
                    if(i == (select_likey_result[0].music_list.length - 1)){
                        select_music_query += "music.music_id = " + select_likey_result[0].music_list[i];
                }
                    else{
                        select_music_query += "music.music_id = " + select_likey_result[0].music_list[i] + " or ";
                    }
                }
                select_music_query += " order by field(music.music_id";
        
                for(let i=select_likey_result[0].music_list.length - 1; i>=0; i--){
                    select_music_query += ", " + select_likey_result[0].music_list[i];
                }
                select_music_query += ")"
        
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    if(err){
                        console.error(err)
                    }
                    else{
                        res.send(select_music_result);
                    }
                })
            }
        }
        return ;
    }catch(err){
        return err;
    }
})


router.post("/storage/likealbum", async(req, res) => {
    console.log("routes => ezenmusic.js => router.post('/storage/likeyalbum') [" + req.body.division + "]");

    try{
        const select_likey_query = `select * from likey where character_id = "${req.body.character_id}" and division = "${req.body.division}"`;
        let [select_likey_result] = await pool.query(select_likey_query);

        if(select_likey_result.length == 0){
            res.json(-1);
        }
        else{
            if(select_likey_result[0].music_list.length === 0){
                res.json(-1);
            }
            else{
                let select_music_query = "select album.*, date_format(release_date, '%Y.%m.%d') as release_date_format, artist.artist_name from album inner join artist on artist.artist_id = album.artist_id where ";
                for(let i=0; i<select_likey_result[0].music_list.length; i++){
                    if(i == (select_likey_result[0].music_list.length - 1)){
                        select_music_query += "album.album_id = " + select_likey_result[0].music_list[i];
                }
                    else{
                        select_music_query += "album.album_id = " + select_likey_result[0].music_list[i] + " or ";
                    }
                }
                select_music_query += " order by field(album.album_id";
        
                for(let i=select_likey_result[0].music_list.length - 1; i>=0; i--){
                    select_music_query += ", " + select_likey_result[0].music_list[i];
                }
                select_music_query += ")"
        
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    // console.log(select_music_query);
                    res.send(select_music_result);
                })
    
            }
        }
        return ;
    }catch(err){
        console.error(err);
    }
})

router.post("/storage/liketheme", async(req, res) => {
    console.log("routes => ezenmusic.js => router.post('/storage/liketheme') [" + req.body.division + "]");

    try{
        const select_likey_query = `select * from likey where character_id = "${req.body.character_id}" and division = "${req.body.division}"`;
        let [select_likey_result] = await pool.query(select_likey_query);

        if(select_likey_result.length == 0){
            res.json(-1);
        }
        else{
            if(select_likey_result[0].music_list.length === 0){
                res.json(-1);
            }
            else{
    
                let select_music_query = "select *, date_format(release_date, '%Y.%m.%d') as release_date_format, JSON_LENGTH(JSON_EXTRACT(music_list, '$')) as count from themeplaylist where ";
                for(let i=0; i<select_likey_result[0].music_list.length; i++){
                    if(i == (select_likey_result[0].music_list.length - 1)){
                        select_music_query += "themeplaylist_id = " + select_likey_result[0].music_list[i];
                }
                    else{
                        select_music_query += "themeplaylist_id = " + select_likey_result[0].music_list[i] + " or ";
                    }
                }
                select_music_query += " order by field(themeplaylist_id";
        
                for(let i=select_likey_result[0].music_list.length - 1; i>=0; i--){
                    select_music_query += ", " + select_likey_result[0].music_list[i];
                }
                select_music_query += ")"
        
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    // console.log(select_music_query);
                    res.send(select_music_result);
                })
            }
        }
        return ;
        // return result;
    }catch(err){
        console.error(err);
    }
})

router.post("/storage/likeartist", async(req, res) => {
    console.log("routes => ezenmusic.js => router.post('/storage/likeartist') [" + req.body.division + "]");

    try{
        const select_likey_query = `select * from likey where character_id = "${req.body.character_id}" and division = "${req.body.division}"`;
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
                        select_music_query += "artist_id = " + select_likey_result[0].music_list[i];
                }
                    else{
                        select_music_query += "artist_id = " + select_likey_result[0].music_list[i] + " or ";
                    }
                }
                select_music_query += " order by field(artist_id";
        
                for(let i=select_likey_result[0].music_list.length - 1; i>=0; i--){
                    select_music_query += ", " + select_likey_result[0].music_list[i];
                }
                select_music_query += ")"
        
                conn.query(select_music_query, (err, select_music_result, fields) => {
                    if(err){
                        console.error(err)
                    }
                    else{
                        res.send(select_music_result);
                    }
                })
            }
        }
        return ;
    }catch(err){
        console.error(err);
    }
})


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// 재호
router.get("/detail/artist/:artist_id", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/artist/:id')");
    const select_detail_artist = `select artist.*, music.music_id, album.album_id from artist inner join music on music.artist_id = artist.artist_id inner join album on album.album_id = music.album_id where artist.artist_id = ?`;
    conn.query(select_detail_artist, [req.params.artist_id], (err, select_detail_artist_result, fields) => {
        if(err){
            console.error(err)
        } 
        else{
            res.send(select_detail_artist_result)
        }
        return ;
    })
})


router.post("/detail/artist/track", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/detail/artist/track')");

    let select_artist_track;

    if(req.body.sortType === "RECENT"){
        select_artist_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id 
        inner join artist on music.artist_id = artist.artist_id where artist.artist_id = ? ORDER BY album.release_date DESC limit 30;`;
    }
    else if(req.body.sortType === "POPULARITY"){
        select_artist_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id 
        inner join artist on music.artist_id = artist.artist_id where artist.artist_id = ? ORDER BY music.hit desc limit 30;` 
    }
    else if(req.body.sortType === "WORD"){
        select_artist_query = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music inner join album on music.album_id = album.album_id 
        inner join artist on music.artist_id = artist.artist_id where artist.artist_id = ? ORDER BY music.music_title ASC limit 30;` 
    }
    conn.query(select_artist_query, [Number(req.body.artist_id)], (err, select_artist_result, fields) => {
        if(err){
            console.error(err);
        } 
        else{
            res.send(select_artist_result);
        }
        return ;
    })
})


router.post("/detail/artist/album", (req, res) => {
    console.log("routes => ezenmusic.js => router.post('/detail/artist/album')");

    let select_artist_query;
    if(req.body.sortType === "RECENT"){
        select_artist_query = `SELECT album.*, artist.artist_name, DATE_FORMAT(album.release_date, '%Y.%m.%d') as release_date_format
        FROM album INNER JOIN artist ON album.artist_id = artist.artist_id WHERE album.artist_id = ? ORDER BY album.release_date DESC ;`;
    }
    else if(req.body.sortType === "POPULARITY"){
        select_artist_query = `select album.*, artist.artist_name, DATE_FORMAT(album.release_date, '%Y.%m.%d') as release_date_format
        FROM album inner join artist on album.artist_id = artist.artist_id where album.artist_id = ? ;` 
    }
    else if(req.body.sortType === "WORD"){
        select_artist_query = `SELECT album.*, artist.artist_name, DATE_FORMAT(album.release_date, '%Y.%m.%d') as release_date_format
        FROM album INNER JOIN artist ON album.artist_id = artist.artist_id WHERE album.artist_id = ? ORDER BY album.album_title ASC`;
    }

    conn.query(select_artist_query, [Number(req.body.artist_id)], (err, select_artist_result, fields) => {
        if(err){
            console.error(err);
        }
        else{
            res.send(select_artist_result);
        }
    })
})


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// 건우

router.get('/detail/detailmylist/:playlist_id', async(req, res) =>{
    console.log("routes => ezenmusic.js => router.get('/detail/detailmylist/:playlist_id')");
    const {playlist_id} = req.params;
    const select_playlist_sql = `select * from playlist where playlist_id = ?`;
    try{
        // 플레이리스트의 노래 목록을 뽑아내자
        let [select_playlist_result] = await pool.query(select_playlist_sql, [playlist_id]);
        if(select_playlist_result[0].music_list == null){
            res.send(select_playlist_result);
        }else{
            
            let select_musiclistcard_result = `select distinct album.album_title, album.org_cover_image, music.music_id, music.music_title, album.album_id, artist.artist_id, artist.artist_name 
            from album inner join music on album.album_id = music.album_id inner join artist on music.artist_id = artist.artist_id where `;

            for(let i=0; i<select_playlist_result[0].music_list.length; i++){
                if(i == (select_playlist_result[0].music_list.length - 1)){
                    select_musiclistcard_result += "music.music_id = " + select_playlist_result[0].music_list[i];
            }
            else{
                select_musiclistcard_result += "music.music_id = " + select_playlist_result[0].music_list[i] + " or ";
            }
            }
            select_musiclistcard_result += " order by field(music.music_id";
    
            for(let i=select_playlist_result[0].music_list.length - 1; i>=0; i--){
    
                select_musiclistcard_result += ", " + select_playlist_result[0].music_list[i];
            }
    
            select_musiclistcard_result += ")"
            let [select_all_result] = await pool.query(select_musiclistcard_result);
            res.send(select_all_result);
        }
        return ;
    }catch(err){
        console.error(err);
        return err;
    }
})

router.post("/delPlaylist", (req, res) => {
    console.log("routes => ezenmusic.js => router.get('/delPlaylist')");

    let delete_playlist_query = "delete from playlist where ? and ";

    for(let i=0; i<req.body.playlist_id_array.length; i++){
        if(i === req.body.playlist_id_array.length - 1){
            delete_playlist_query += "playlist_id = " + req.body.playlist_id_array[i];
        }
        else{
            delete_playlist_query += "playlist_id = " + req.body.playlist_id_array[i] + " or ";
        }
    }

    conn.query(delete_playlist_query, [{character_id: req.body.character_id}], (err, delete_playlist_result, fields) => {
        if(err){
            console.error(err)
        }
        else{
            res.json(1);
        }
        return ;
    })
})

module.exports = router;