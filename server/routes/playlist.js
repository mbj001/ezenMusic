const express = require("express");
const conn = require("../config/mysql");
const { route } = require("./main");
const router = express.Router();
const mysql2 = require('mysql2/promise');
const pool = require("../config/mysqlPool");
const { isLoggedIn, isNotLoggedIn} = require("../middleWares/index");

router.get("/", isLoggedIn, (req, res) => {
    console.log("routes => playlist.js => router.get('/')");
    const sql = 'select playlist.* from playlist order by update_date desc';
    conn.query(sql, (err, row, fields) =>{
        if(err){
            console.log(err);
        }else{
            res.render("playlist", {title: "PLAYLIST", row});
            // console.log(row);
        }
    })
});

router.post('/insert', isLoggedIn, (req, res) =>{
    console.log("routes => playlist.js => router.post('/insert')");
    // console.log(req.body);
    const sql = `select playlist_name from playlist where character_id = '${req.body.character_id}'`;
    conn.query(sql, (err, row) =>{
        // console.log(row);
        if(row.length == 0){
            const sql2 = `insert into playlist(character_id, playlist_name) values('${req.body.character_id}', '${req.body.playlist_name}')`;
            conn.query(sql2, async(err, row) =>{
                location.reload();
                // await res.send("<script> alert( '재생목록 추가 완료!' );</script>");
                res.send("<script> window.location.replace('/playlist'); alert( '재생목록 추가 완료!' ); </script>");
            });
        }else{
            let arr = [];
            for(i = 0; i < row.length; i++){
                arr.push(row[i].playlist_name);
            }
            // console.log(arr);
            for(i = 0; i < arr.length; i++){
                if(req.body.playlist_name === arr[i]){
                    res.send("<script> alert( '중복된 재생목록 이름이 존재합니다!' ); window.location.replace('/playlist'); </script>");
                    return;
                }
            }
            const sql2 = `insert into playlist(character_id, playlist_name) values('${req.body.character_id}', '${req.body.playlist_name}')`;
            conn.query(sql2, (err, row) =>{
                res.send("<script> alert( '재생목록 추가 완료!' ); window.location.replace('/playlist'); </script>");
            });
        }
    })
});

router.post('/delete', isLoggedIn, (req, res) =>{
    console.log("routes => playlist.js => router.post('/delete')");
    // console.log(req.body);
    const sql = `delete from playlist where playlist_id = ${req.body.playlist_id}`;
    conn.query(sql, (err, row) =>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/playlist');
        }
    })
});

router.post('/playlist_detail', isLoggedIn, (req, res) =>{
    console.log("routes => playlist.js => router.post('/playlist_detail')");
    // console.log(req.body);
    let array = [];
    const sql = `select * from playlist where playlist_id = ${req.body.playlist_id}`;
    conn.query(sql, (err, row) =>{
        let title = row[0].playlist_id;
        let user = row[0].character_id;
        let playlist_name = row[0].playlist_name;
        let thumbnail_image = row[0].thumbnail_image;

        let music = row[0].music_list;
        // console.log(music.length);
        if(music == null){
            res.render('playlist_detail', {title, user, row});
            return;
        }else if(music.length == 1){
            const select_music = `select distinct album.album_title, album.org_cover_image, music.music_id, music.music_title, album.album_id, artist.artist_id, artist.artist_name 
            from album inner join music on album.album_id = music.album_id inner join artist on music.artist_id = artist.artist_id where music.music_id = ${row[0].music_list[0]}`;
            conn.query(select_music, (err, row2) =>{
                res.render('playlist_detail', {title, user, playlist_name, thumbnail_image, music, row2})
            })
            return;
        }else{            
            let select_music_list = `select distinct album.album_title, album.org_cover_image, music.music_id, music.music_title, album.album_id, artist.artist_id, artist.artist_name 
            from album inner join music on album.album_id = music.album_id inner join artist on music.artist_id = artist.artist_id where `;

            for(i = 0; i < row[0].music_list.length; i++){
                if(i == (row[0].music_list.length - 1)){
                    select_music_list += "music.music_id = " + row[0].music_list[i];
                }
                else{
                    select_music_list += "music.music_id = " + row[0].music_list[i] + " or ";
                }
            }
            select_music_list += " order by field(music.music_id";
    
            for(i = row[0].music_list.length - 1; i>=0; i--){
                select_music_list += ", " + row[0].music_list[i];
            }
            select_music_list += ")"
            conn.query(select_music_list, (err, row2) =>{
                res.render('playlist_detail', {title, user, playlist_name, thumbnail_image, music, row2})
            })
        }
    })
});

router.post('/playlist_detail/insert', isLoggedIn, (req, res) =>{
    console.log("routes => playlist.js => router.post('/playlist_detail/insert')");
    // console.log(req.body);

    const sql = `select music_list from playlist where playlist_id = ${req.body.playlist_id}`;
    conn.query(sql, (err, row) =>{
        let arr = row[0].music_list
        // console.log(arr);
        for(i = 0; i < arr.length; i++){
            if(Number(req.body.music_id) === arr[i]){
                res.send("<script>alert('해당 플레이리스트에 중복된 music_id가 있습니다'); window.location.replace('/playlist');</script>");
                return;
            }
        }
        arr.push(Number(req.body.music_id))
        // console.log(arr);
        const lastValue = arr[arr.length - 1];
        const sql2 = `select album.org_cover_image from album inner join music on album.album_id = music.album_id where music_id = ${lastValue}`;
        conn.query(sql2, (err, row) =>{
            const sql3 = `update playlist set thumbnail_image = '${row[0].org_cover_image}', music_list = '[${arr}]' where playlist_id = ${req.body.playlist_id}`;
            conn.query(sql3, (err, row) =>{
                res.send("<script>alert('노래 추가 완료!!'); window.location.replace('/playlist');</script>");
            });
        });
    });
});

router.post('/playlist_detail/delete', isLoggedIn, (req, res) =>{
    console.log("routes => playlist.js => router.post('/playlist_detail/delete')");
    // console.log(req.body);
    const sql = `select music_list from playlist where playlist_id = ${req.body.playlist_id}`;
    conn.query(sql, (err, row) =>{
        // console.log(row);
        let arr = row[0].music_list;
        // console.log("arr");
        // console.log(arr);
        for(i = 0; i < arr.length; i++){
            if(arr[i] === Number(req.body.music_id)){
                arr.splice(i, 1);
                i--;
                break;
            }
        }
        // console.log(arr.length);
        if(arr.length == 0){
            const sql2 = `update playlist set thumbnail_image = NULL, music_list = NULL where playlist_id = ${req.body.playlist_id}`;
            conn.query(sql2, (err, row) =>{
                // console.log(sql2);
                res.redirect('/playlist');
            })

        }else{
            const lastValue = arr[arr.length - 1];
            // console.log(lastValue);
            const sql2 = `select album.org_cover_image from album inner join music on album.album_id = music.album_id where music_id = ${lastValue}`;
            conn.query(sql2, (err, row) =>{
                // console.log(row);
                const sql3 = `update playlist set thumbnail_image = '${row[0].org_cover_image}', music_list = '[${arr}]' where playlist_id = ${req.body.playlist_id}`;
                conn.query(sql3, (err, row) =>{
                    // console.log(sql3);
                    res.redirect('/playlist');
                })
            });
        }

    })
});



// 클라이언트 단

router.post('/storage/mylist', (req, res) =>{
    console.log("routes => playlist.js => router.get('/storage/mylist/:userid')");
    // console.log(req.body);
    const sql = `select playlist_id, playlist_name, create_date, music_list, thumbnail_image from playlist where ? order by update_date desc`;
    conn.query(sql, [{character_id: req.body.character_id}],(err, row) =>{
        if(err){
            console.log(err);
        }else{
            res.send(row);
        }
    })
});




router.post(`/storage/mylist/insert`, (req, res) =>{
    console.log(`routes => playlist.js => router.post('/storage/mylist')`);
    const {character_id} = req.body;
    let {date} = req.body;
    // console.log(req.body);
    const select_playlist_sql = `select playlist_name from playlist where character_id = '${character_id}'`;
    conn.query(select_playlist_sql, (err, select_playlist_result) =>{
        
        for(i = 0; i < select_playlist_result.length; i++){
            if(date == select_playlist_result[i].playlist_name){
                date = `${req.body.date}(${i + 1})`
            }
        }
        let insert_playlist_sql = "insert into playlist(character_id, playlist_name) values('" + character_id + "', '" + date + "')";
        // console.log(insert_playlist_sql);
        conn.query(insert_playlist_sql, (err, insert_playlist_result) =>{
            let select_playlist_sql2 = `select playlist_id from playlist where character_id = '${character_id}' order by create_date desc`;
            conn.query(select_playlist_sql2, (err, select_playlist_result2) =>{
                res.send(select_playlist_result2);
            })
        })
    })
});

router.get('/detail/detailmylist/:playlist_id', (req, res) =>{
    console.log("routes => playlist.js => router.get('/detail/detailmylist:userid')");
    const {playlist_id} = req.params;
    const sql = `select playlist_id, playlist_name, create_date, music_list, thumbnail_image from playlist where playlist_id = ${playlist_id}`;
    conn.query(sql, (err, row) =>{
        if(err){
            console.log(err);
        }else{
            // console.log(row);
            res.send(row);
        }
    })
});

router.post('/detail/detailmylist/changeplaylistname', (req, res) =>{
    console.log("routes => playlist.js => router.post('/detail/detailmylist/changeplaylistname')");
    const {playlist_id, playlist_name, before_playlist_name, character_id} = req.body;
    const sql = `select playlist_name from playlist where ?`;
    conn.query(sql, [{character_id}], async (err, row) =>{
        try{
            // console.log(row);
            if(playlist_name === before_playlist_name){
                const change_playlist_name_sql = `update playlist set ? where ?`;
                // console.log('플레이리스트 제목 변경됨1');
                let [change_playlist_name_result] = await pool.query(change_playlist_name_sql, [{playlist_name}, {playlist_id}]);
                res.json(2);
                return ;
            }
            for(i = 0; i < row.length; i++){
                if(req.body.playlist_name === row[i].playlist_name){
                    // console.log('플레이리스트 제목 변경안됨');
                    res.json(1);
                    return;
                }
            }
            const change_playlist_name_sql = `update playlist set ? where ?`;
            conn.query(change_playlist_name_sql, [{playlist_name}, {playlist_id}], (err, change_playlist_name_result) =>{
                // console.log(change_playlist_name_result);
                // console.log('플레이리스트 제목 변경됨2');
                res.json(2);
            })
        }
        catch(err){
            console.error(err);
            return ;
        }

    })
});

router.post('/detail/detailmylist/deletemusic', (req, res) =>{
    console.log("routes => playlist.js => router.post('/detail/detailmylist/deletemusic')");
    // console.log(req.body);
    const sql = `select music_list from playlist where playlist_id = ${Number(req.body.playlist_id)}`;
    conn.query(sql, (err, row) =>{
        // console.log(row);
        if(req.body.music_id.length > 1){
            // 노래 여러개 선택해서 삭제 할 때
            let array = row[0].music_list;
            let client_array = req.body.music_id;

            for(let i=0; i<client_array.length; i++){
                for(let j=0; j<row[0].music_list.length; j++){

                    if(Number(client_array[i]) === row[0].music_list[j]){

                        array.splice(j, 1);
                        j--;
                        break;
                    }
                    if(j === row[0].music_list.length - 1){
                        array.push(Number(client_array[i]));
                    }

                }
            }
            // console.log(array);
            if(array.length == 0){
                const sql2 = `update playlist set thumbnail_image = NULL, music_list = NULL where playlist_id = ${req.body.playlist_id}`;
                conn.query(sql2, (err, row) =>{
                    res.json(1);
                    return;
                })
    
            }else{
                const lastValue = array[array.length - 1];
                // console.log(lastValue);
                const sql2 = `select album.org_cover_image from album inner join music on album.album_id = music.album_id where music_id = ${lastValue}`;
                conn.query(sql2, (err, row) =>{
                    // console.log(row);
                    const sql3 = `update playlist set thumbnail_image = '${row[0].org_cover_image}', music_list = '[${array}]' where playlist_id = ${req.body.playlist_id}`;
                    conn.query(sql3, (err, row) =>{
                        // console.log(sql3);
                        res.json(1);
                        return;
                    })
                });
            }
        }else{
            // 노래 하나 선택해서 삭제 할 때
            let arr = row[0].music_list;
            for(i = 0; i < arr.length; i++){
                if(arr[i] === Number(req.body.music_id)){
                    arr.splice(i, 1);
                    i--;
                    break;
                }
            }
            // console.log(arr)
            if(arr.length == 0){
                const sql2 = `update playlist set thumbnail_image = NULL, music_list = NULL where playlist_id = ${req.body.playlist_id}`;
                conn.query(sql2, (err, row) =>{
                    res.json(1);
                    return;
                })
    
            }else{
                const lastValue = arr[arr.length - 1];
                // console.log(lastValue);
                const sql2 = `select album.org_cover_image from album inner join music on album.album_id = music.album_id where music_id = ${lastValue}`;
                conn.query(sql2, (err, row) =>{
                    // console.log(row);
                    const sql3 = `update playlist set thumbnail_image = '${row[0].org_cover_image}', music_list = '[${arr}]' where playlist_id = ${req.body.playlist_id}`;
                    conn.query(sql3, (err, row) =>{
                        // console.log(sql3);
                        res.json(1);
                        return;
                    })
                });
            }
        }

    })

    
});








///////////////////////////////// MODAL /////////////////////////////////////////
// musiclistcard에서 내 리스트 버튼을 눌렀을 때 모달을 띄우는 라우터
router.post(`/browse/addplaylist/`, (req, res) =>{
    console.log(`routes => playlist.js => router.post('/browse/addplaylist')`);
    // console.log(req.body);
    // const {userid} = req.params;
    const select_playlist_sql = `select * from playlist where ?`
    conn.query(select_playlist_sql, [{character_id: req.body.character_id}], (err, select_playlist_sql_result) =>{
        if(err){
            console.log(err);
        }else{
            // console.log('11');
            // console.log(select_playlist_sql_result.length);
            if(select_playlist_sql_result.length === 0){
                res.json(-1);
            }
            else{
                let selected = "where playlist_id = " + select_playlist_sql_result[0].playlist_id;
                if(select_playlist_sql_result.length <= 1){
                    const select_playlistname_thumbnailimage_sql = `select playlist_id, playlist_name, thumbnail_image from playlist ${selected} order by update_date desc`;
                    conn.query(select_playlistname_thumbnailimage_sql, (err, row) =>{
                        res.send(row);
                        // console.log(row);
                    })
                }else{
                    for(i=1; i < select_playlist_sql_result.length; i++)(
                        selected += " or playlist_id = " + select_playlist_sql_result[i].playlist_id
                    )
                    const select_playlistname_thumbnailimage_sql = `select playlist_id, playlist_name, thumbnail_image from playlist ${selected} order by update_date desc`;
                    conn.query(select_playlistname_thumbnailimage_sql, (err, row) =>{
                        // console.log(select_playlistname_thumbnailimage_sql)
                        res.send(row);
                        // console.log(row);
                    })
                }
                // console.log(selected);
            }

            // res.send(select_playlist_sql_result);
        }
    })
});

// playlistAdd 모달에서 이미 존재하는 플레이리스트에 음악을 추가하는 라우터
router.post('/browse/addmusictoplaylist/', async (req, res) =>{
    console.log(`routes => playlist.js => router.post('/browse/addmusictoplaylist')`);
    const {character_id, thumbnail_image, playlist_name, playlist_id} = req.body;
    let {music_id, album_id, theme_playlist} = req.body;
    // console.log(req.body);
    // console.log(typeof(music_id));

    let array = [];
    let client_array = [];
    let condition_array = [];
    
    // track, 노래 하나 or 다수의 정보를 집어넣을때
    if(album_id == null && theme_playlist == null){
        if(typeof(music_id) == 'object'){
            for(i = 0; i < music_id.length; i++){
                condition_array.push(Number(music_id[i]));
            }
        }else{
            condition_array.push(Number(music_id));
        }
        // console.log(condition_array.length);
        // 다수의 노래를 선택해서 집어넣을때
        if(condition_array.length > 1){
            try{
                const sql = `select thumbnail_image, music_list from playlist where ? and ? and ?`
                conn.query(sql, [{character_id}, {playlist_name}, {playlist_id}], (err, row) =>{
                    if(row[0].music_list == null){
                        const lastValue = condition_array[condition_array.length - 1];
                        // console.log(lastValue);
                        const select_thumbnail_image_query = `select album.org_cover_image from album inner join music on music.album_id = album.album_id where music.music_id = ${lastValue}`;
                        conn.query(select_thumbnail_image_query, (err, row) =>{
                            const insert_music_query = `update playlist set music_list = "[?]", thumbnail_image = ? where ?`;
                            conn.query(insert_music_query, [condition_array, row[0].org_cover_image, {playlist_id: playlist_id}], (err, update_playlist_result, fields) =>{
                                res.json(1);
                            })
                        })
                        
                    }else{
                        array = row[0].music_list;
                        // console.log(condition_array);
                        // console.log(array);
        
                        for(let i=0; i<condition_array.length; i++){
                            for(let j=0; j<row[0].music_list.length; j++){
            
                                if(condition_array[i] === row[0].music_list[j]){
            
                                    array.splice(j, 1);
                                    array.push(condition_array[i]);
                                    break;
                                }
                                if(j === row[0].music_list.length - 1){
                                    array.push(condition_array[i]);
                                }
            
                            }
                        }
                        // console.log("### result ###");
                        // console.log(array);

                        const lastValue = array[array.length - 1];
                        // console.log(lastValue);
                        const select_thumbnail_image_query = `select album.org_cover_image from album inner join music on music.album_id = album.album_id where music.music_id = ${lastValue}`;
                        conn.query(select_thumbnail_image_query, (err, row) =>{
                            const insert_music_query = `update playlist set music_list = "[?]", thumbnail_image = ? where ?`;
                            conn.query(insert_music_query, [array, row[0].org_cover_image, {playlist_id: playlist_id}], (err, update_playlist_result, fields) =>{
                                res.json(1);
                            })
                        })
                    }
                })
    
            }catch(e){
                console.log(err);
            }
        }else{
            // 노래 하나만 플레이리스트에 넣을 때
            try{
                const sql = `select thumbnail_image, music_list from playlist where ? and ? and ?`
                conn.query(sql, [{character_id}, {playlist_name}, {playlist_id}], (err, row) =>{
                    // 노래를 추가하려는 재생목록이 null인 경우
                    if(row[0].music_list == null){
                        // console.log('11');
                        // console.log(Number(music_id));
                        const select_thumbnail_image_query = `select album.org_cover_image from album inner join music on music.album_id = album.album_id where music.music_id = ${Number(music_id)}`;
                        conn.query(select_thumbnail_image_query, (err, row) =>{
                            // console.log(row)
                            const insert_music_query = `update playlist set music_list = "[?]", thumbnail_image = ? where ?`;
                            conn.query(insert_music_query, [Number(music_id), row[0].org_cover_image, {playlist_id: playlist_id}], (err, update_playlist_result, fields) =>{
                                res.json(1);
                            })
                        })
                    }else{
                        client_array.push(music_id);
                        array = row[0].music_list;
                        // console.log(client_array);
                        // console.log(array);
        
                        for(let i=0; i<client_array.length; i++){
                            for(let j=0; j<row[0].music_list.length; j++){
            
                                if(Number(client_array[i]) === row[0].music_list[j]){
            
                                    array.splice(j, 1);
                                    array.push(Number(client_array[i]));
                                    break;
                                }
                                if(j === row[0].music_list.length - 1){
                                    array.push(Number(client_array[i]));
                                }
            
                            }
                        }
                        // console.log("### result ###");
                        // console.log(array);
        
                        const update_playlist_query = `update playlist set music_list = "[?]", thumbnail_image = ? where ?`;
                        conn.query(update_playlist_query, [array, thumbnail_image, {playlist_id: playlist_id}], (err, update_playlist_result, fields) => {
                            if(err){
                                console.error(err)
                            }
                            else{
                                res.json(1);
                            }
                        })
                    }
                })
    
            }catch(e){
                console.log(err);
            }
        }

    }// album트랙의 정보를 가져올 때
    else if(music_id == null && theme_playlist == null){
        try{
            const select_music_query = `select music.music_id from music inner join album on album.album_id = music.album_id where album.album_id = ${req.body.album_id}`;
            
            let [select_music_result] = await pool.query(select_music_query);
        
            for(let i=0; i<select_music_result.length; i++){
                client_array.push(select_music_result[i].music_id);
            }
            // console.log("### client Add ###");
            // console.log(client_array);
            const sql = `select thumbnail_image, music_list from playlist where ? and ? and ?`
            conn.query(sql, [{character_id}, {playlist_name}, {playlist_id}], (err, row) =>{
                if(err){
                    console.error(err)
                }
                else{
                    // console.log("### playlist ###" );
                    // console.log(row[0].music_list);
                    if(row[0].music_list == null){
                        // array = Number(client_array);
                        for(i = 0; i < client_array.length; i++){
                            array.push(Number(client_array[i]));
                        }
                        
                        // console.log("### result ###");
                        // console.log(array);
        
                        const update_playlist_query = `update playlist set music_list = "[?]", thumbnail_image = ? where ?`;
                        conn.query(update_playlist_query, [array, thumbnail_image, {playlist_id: playlist_id}], (err, update_playlist_result, fields) => {
                            if(err){
                                console.error(err)
                            }
                            else{
                                res.json(1);
                            }
                        })
                    }else{
                        array = row[0].music_list;
        
                        for(let i=0; i<client_array.length; i++){
                            for(let j=0; j<row[0].music_list.length; j++){
            
                                if(Number(client_array[i]) === row[0].music_list[j]){
            
                                    array.splice(j, 1);
                                    array.push(Number(client_array[i]));
                                    break;
                                }
                                if(j === row[0].music_list.length - 1){
                                    array.push(Number(client_array[i]));
                                }
            
                            }
                        }
                        // console.log("### result ###");
                        // console.log(array);
        
                        const update_playlist_query = `update playlist set music_list = "[?]", thumbnail_image = ? where ?`;
                        conn.query(update_playlist_query, [array, thumbnail_image, {playlist_id: playlist_id}], (err, update_playlist_result, fields) => {
                            if(err){
                                console.error(err)
                            }
                            else{
                                res.json(1);
                            }
                        })
                    }
                }
            })   
        }
        catch(e){
            console.log(err);
        }
    // 테마 플레이리스트 추가 할 때   
    }else if(music_id == null && album_id == null){
        try{
            const select_music_query = `select music_list from themeplaylist where themeplaylist_id = ${req.body.theme_playlist}`;
            
            let [select_music_result] = await pool.query(select_music_query);

            client_array = select_music_result[0].music_list;
            // console.log("### client Add ###");
            // console.log(client_array);
            const sql = `select thumbnail_image, music_list from playlist where ? and ? and ?`
            conn.query(sql, [{character_id}, {playlist_name}, {playlist_id}], (err, row) =>{
                if(err){
                    console.error(err)
                }
                else{
                    // console.log("### playlist ###" );
                    // console.log(row[0].music_list);
                    if(row[0].music_list == null){
                        // array = Number(client_array);
                        for(i = 0; i < client_array.length; i++){
                            array.push(Number(client_array[i]));
                        }
                        
                        // console.log("### result ###");
                        // console.log(array);

                        const lastValue = array[array.length - 1];
                        // console.log(lastValue);
                        const select_thumbnail_image_query = `select album.org_cover_image from album inner join music on music.album_id = album.album_id where music.music_id = ${lastValue}`;
                        conn.query(select_thumbnail_image_query, (err, row) =>{
                            const update_playlist_query = `update playlist set music_list = "[?]", thumbnail_image = ? where ?`;
                            conn.query(update_playlist_query, [array, row[0].org_cover_image, {playlist_id: playlist_id}], (err, update_playlist_result, fields) => {
                                if(err){
                                    console.error(err)
                                }
                                else{
                                    res.json(1);
                                }
                            })
                        })
        
                    }else{
                        array = row[0].music_list;
        
                        for(let i=0; i<client_array.length; i++){
                            for(let j=0; j<row[0].music_list.length; j++){
            
                                if(Number(client_array[i]) === row[0].music_list[j]){
            
                                    array.splice(j, 1);
                                    array.push(Number(client_array[i]));
                                    break;
                                }
                                if(j === row[0].music_list.length - 1){
                                    array.push(Number(client_array[i]));
                                }
            
                            }
                        }
                        // console.log("### result ###");
                        // console.log(array);
                        
                        const lastValue = array[array.length - 1];
                        // console.log(lastValue);
                        const select_thumbnail_image_query = `select album.org_cover_image from album inner join music on music.album_id = album.album_id where music.music_id = ${lastValue}`;
                        conn.query(select_thumbnail_image_query, (err, row) =>{
                            const update_playlist_query = `update playlist set music_list = "[?]", thumbnail_image = ? where ?`;
                            conn.query(update_playlist_query, [array, row[0].org_cover_image, {playlist_id: playlist_id}], (err, update_playlist_result, fields) => {
                                if(err){
                                    console.error(err)
                                }
                                else{
                                    res.json(1);
                                }
                            })
                        })
                    }
                }
            })   
        }
        catch(e){
            console.log(err);
        }
    }
})


// playlistAdd 모달에서 새 플레이리스트를 만듦과 동시에 해당 플레이리스트에 곡을 추가하는 라우터
router.post('/browse/addnewmusicandplaylist/', (req, res) =>{
    console.log(`routes => playlist.js => router.post('/browse/addnewmusicandplaylist')`);
    const {character_id, thumbnail_image, playlist_name, playlist_id} = req.body;
    let {music_id, album_id, theme_playlist} = req.body;
    // console.log("바디");
    // console.log(req.body);
    
    let client_array = [];
    let condition_array = [];

    const sql = `select playlist_name from playlist where ?`;
    conn.query(sql, [{character_id}], (err, row) =>{
        // console.log(row);
        // 재생목록의 이름이 중복인지 확인하는 for문
        for(i = 0; i < row.length; i++){
            if(req.body.playlist_name == row[i].playlist_name){
                res.json(1);
                return;
            }
        }
        if(album_id == null && theme_playlist == null){
            if(typeof(music_id) == 'object'){
                for(i = 0; i < music_id.length; i++){
                    condition_array.push(Number(music_id[i]));
                }
            }else{
                condition_array.push(Number(music_id));
            }
            // console.log(condition_array);
            // 다수의 노래를 선택해서 집어넣을때
            if(condition_array.length > 1){
                try{
                    const lastValue = condition_array[condition_array.length - 1];
                    const select_thumbnail_image_query = `select album.org_cover_image from album inner join music on music.album_id = album.album_id where music.music_id = ${lastValue}`;
                    // console.log(condition_array);
                    conn.query(select_thumbnail_image_query, (err, row) =>{
                        // console.log(select_thumbnail_image_query);
                        // console.log(row);
                        const insert_music_query = `insert into playlist(character_id, playlist_name, thumbnail_image, music_list) values('${character_id}', '${playlist_name}', '${row[0].org_cover_image}', "[${condition_array}]")`;
                        conn.query(insert_music_query, (err, update_playlist_result, fields) =>{
                            // conn.query(insert_music_query, [{userid}, {playlist_name}, row[0].org_cover_image, condition_array], (err, update_playlist_result, fields) =>{
                            if(err){
                                console.error(err);
                            }
                            else{
                                // console.log(insert_music_query);
                                // console.log(update_playlist_result);
                                res.json(2);
                            }
                        })
                    })
                }catch(e){
                    console.log(err);
                }
            }else{
                // 노래 하나만 플레이리스트에 넣을 때
                try{
                    // console.log(Number(req.body.music_id));
                    const select_thumbnail_image_query = `select album.org_cover_image from album inner join music on music.album_id = album.album_id where music.music_id = ${req.body.music_id}`;
                    conn.query(select_thumbnail_image_query, (err, row) =>{
                        const insert_music_query = `insert into playlist(character_id, playlist_name, thumbnail_image, music_list) values('${character_id}', '${playlist_name}', '${row[0].org_cover_image}', "[${music_id}]")`;
                        conn.query(insert_music_query, (err, row) =>{
                            res.json(2);
                        })
                    })
        
                }catch(e){
                    console.log(err);
                }
            }
        // album트랙의 정보를 가져올 때
        }else if(music_id == null && theme_playlist == null){
            try{
                const select_music_query = `select music.music_id from music inner join album on album.album_id = music.album_id where album.album_id = ${req.body.album_id}`;
                
                conn.query(select_music_query, (err, select_music_result) =>{
                    for(let i=0; i<select_music_result.length; i++){
                        client_array.push(Number(select_music_result[i].music_id));
                    }
                    // console.log(client_array);

                    const lastValue = client_array[client_array.length - 1];
                    // console.log(lastValue);
                    const select_thumbnail_image_query = `select album.org_cover_image from album inner join music on music.album_id = album.album_id where music.music_id = ${lastValue}`;
                    conn.query(select_thumbnail_image_query, (err, row) =>{
                        // const update_playlist_query = `update playlist set playlist = "[?]", thumbnail_image = ? where ?`;
                        const insert_music_query = `insert into playlist(character_id, playlist_name, thumbnail_image, music_list) values('${character_id}', '${playlist_name}', '${row[0].org_cover_image}', "[${client_array}]")`;
                        conn.query(insert_music_query, (err, row, fields) => {
                            if(err){
                                console.error(err)
                            }
                            else{
                                res.json(2);
                            }
                        })
                    })

                })
            }
            catch(e){
                console.log(err);
            }

        }else if(music_id == null && album_id == null){
            try{
                const select_music_query = `select music_list from themeplaylist where themeplaylist_id = ${req.body.theme_playlist}`;
                
                conn.query(select_music_query, (err, select_music_result) =>{
                    // console.log(select_music_result[0].music_list);

                    const lastValue = select_music_result[0].music_list[select_music_result[0].music_list.length - 1];
                    // console.log(lastValue);
                    const select_thumbnail_image_query = `select album.org_cover_image from album inner join music on music.album_id = album.album_id where music.music_id = ${lastValue}`;
                    conn.query(select_thumbnail_image_query, (err, row) =>{
                        // const update_playlist_query = `update playlist set playlist = "[?]", thumbnail_image = ? where ?`;
                        const insert_music_query = `insert into playlist(character_id, playlist_name, thumbnail_image, music_list) values('${character_id}', '${playlist_name}', '${row[0].org_cover_image}', "[${select_music_result[0].music_list}]")`;
                        conn.query(insert_music_query, (err, row, fields) => {
                            if(err){
                                console.error(err)
                            }
                            else{
                                res.json(2);
                            }
                        })
                    })

                })
            }
            catch(e){
                console.log(err);
            }
        }
    })
})


router.post(`/detailmylist/addmusicmodal`, (req, res) =>{
    console.log(`routes => playlist.js => router.post('/detail/detailmylist/detailmylistaddmusicmodal')`);
    // console.log(req.body);
    const {character_id, playlist_id} = req.body;
    const sql = `select music_list from playerlist where ?`
    conn.query(sql, [{character_id}], (err, row) =>{
        
        // userid 에 대한 row 가 없을때 return
        if(row.length === 0){
            res.json(1);
            return ;
        }
        

        let select_musiclistcard_result = `select album.album_title, album.org_cover_image, music.music_id, music.music_title, artist.artist_name 
        from album inner join music on album.album_id = music.album_id inner join artist on music.artist_id = artist.artist_id where `;

        for(let i=0; i< row[0].music_list.length; i++){
            if(i == (row[0].music_list.length - 1)){
                select_musiclistcard_result += "music.music_id = " + row[0].music_list[i];
        }
        else{
            select_musiclistcard_result += "music.music_id = " + row[0].music_list[i] + " or ";
        }
        }
        select_musiclistcard_result += " order by field(music.music_id";

        for(i = row[0].music_list.length - 1; i >= 0; i--){

            select_musiclistcard_result += ", " + row[0].music_list[i];
        }

        select_musiclistcard_result += ")"
        // console.log(select_musiclistcard_result);

        

        conn.query(select_musiclistcard_result, (err, row) =>{
            // console.log(row);
            if(row === undefined){
                res.json(1);
            }else{
                res.send(row);
            }
        })
        return ;
    })
});

router.post("/detailmylist/addmusicmodal/selectlikeylist", (req, res) =>{
    console.log(`routes => playlist.js => router.post('/detail/detailmylist/addmusicmodal/selectlikeylist')`);
    // console.log(req.body);
    const {character_id, playlist_id} = req.body;
    const sql = `select music_list from likey where ? and division = 'liketrack'`;
    conn.query(sql, [{character_id}], (err, row) =>{
        
        // userid 에 대한 row 가 없을때 return
        if(row.length === 0){
            res.json(1);
            return;
        }
        // 재생목록이 비어있을 때
        if(row[0].music_list == null){
            res.json(1);
            return
        }else{
            
            let select_musiclistcard_result = `select distinct album.album_title, album.org_cover_image, music.music_id, music.music_title, artist.artist_name 
            from album inner join music on album.album_id = music.album_id inner join artist on music.artist_id = artist.artist_id where `;

            for(let i=0; i< row[0].music_list.length; i++){
                if(i == (row[0].music_list.length - 1)){
                    select_musiclistcard_result += "music.music_id = " + row[0].music_list[i];
            }
            else{
                select_musiclistcard_result += "music.music_id = " + row[0].music_list[i] + " or ";
            }
            }
            select_musiclistcard_result += " order by field(music.music_id";
    
            for(i = row[0].music_list.length - 1; i >= 0; i--){
    
                select_musiclistcard_result += ", " + row[0].music_list[i];
            }
    
            select_musiclistcard_result += ")"
            // console.log(select_musiclistcard_result);

            conn.query(select_musiclistcard_result, (err, row) =>{
                // console.log(row);
                if(row === undefined){
                    res.json(1);
                }else{
                    res.send(row);
                }
            })

        }
        return ;
    })
});

module.exports = router;