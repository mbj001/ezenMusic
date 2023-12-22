const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require("../config/mysqlPool");

router.post('/check', (req,res)=>{
    res.send({valid: true});
});

router.post('/issuanceCharacterCookie', (req,res)=>{
    const selectCharacterQuery = `SELECT * FROM characters WHERE user_id = ?`;
    conn.query(selectCharacterQuery, [req.body.clientId], (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(result)
            if(result.length === 0 ){
                return res.send({valid: false});
            }else{
                return res.send({characterId: result[0].character_id, characterNum: result[0].character_num});
            }
        }
    });
});

router.post('/checkCharacterCookie', (req,res)=>{
    const checkCharacterCookieQuery = `select exists (select * from characters where character_id = ?) as isExist`;
    conn.query(checkCharacterCookieQuery, [req.body.characterId], (error, check, fields)=>{
        if(error){
            console.log(error);
        }else{
            if(check.length !== 0 && check[0].isExist === 1){
                res.send({isExist: true});
            }else{
                res.send({isExist: false});
            }
        }
    })
});

router.post('/checkCharacterCount', (req, res)=>{
    conn.query(`select character_num from characters where user_id = ?`, [req.body.clientId], (error, result, fields)=>{
            if(error){
            console.log(error);
        }else{
            if(result.length === 0){
                return res.send({valid: false});
            }else{
                let sendData = [];
                result.forEach((data)=>{
                    sendData.push(data.character_num);
                })
                return res.send(sendData);
            }
        }
    });
});

router.post('/info', (req,res)=>{
    const userInfoQuery = `SELECT * FROM member A RIGHT JOIN voucher B ON A.user_id = B.user_id WHERE A.user_id = ?`;
    conn.query(userInfoQuery, [req.body.user_id], (error, selectResult, fields)=>{
        if(error){
            console.log(error);
        }else{
            if(selectResult.length === 0){
                const noVoucherQuery = `SELECT name, email, purchase FROM member WHERE user_id = ?`;
                conn.query(noVoucherQuery, [req.body.user_id], (error, result, fields)=>{
                    if(error){
                        console.log(error);
                    }else{
                        const sendNoVoucherDataToClient = {
                            email: result[0].email,
                            purchase: result[0].purchase,
                            plan_type: 'none'
                        }
                        res.send(sendNoVoucherDataToClient);
                    }
                })
            }else{
                const sendDataToClient = {
                    email: selectResult[0].email,
                    purchase: Boolean(selectResult[0].purchase),
                    purchase_date: selectResult[0].purchase_date,
                    plan_type: selectResult[0].plan_type
                };
                res.send(sendDataToClient);
            }
        }
    });
});

router.post('/removeInvalidSessions', (req,res)=>{
    const findInvalidSessionQuery = `SELECT * FROM sessions WHERE session_id = ? OR data LIKE ?`;
    conn.query(findInvalidSessionQuery, [req.body.token, "%" + req.body.user_id + "%"], (error,invalidSessions,fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(findInvalidSessionQuery)
            if(invalidSessions){
                invalidSessions.forEach((data)=>{
                    const deleteInvalidSessionsQuery = `DELETE FROM sessions WHERE session_id = ?`;
                    conn.query(deleteInvalidSessionsQuery, [data.session_id], (error,rs,fields)=>{
                        if(error){
                            console.log(error);
                        }else{
                            console.log('removeInvalidSessions');
                            console.log(`${data.session_id} has been deleted!`);
                            res.send({removeSuccess: true});
                        }
                    });
                });
            }
        }
    });
});

router.post('/reissuance', (req,res)=>{
    const query = `SELECT * FROM sessions WHERE session_id = ?`;
    conn.query(query, [req.body.token], (error, result, fields)=>{
        if(error){
            console.error(error);
        }else{
            if(result.length === 0){
                return res.send({valid: false});
            }else{
                let info = JSON.parse(result[0].data);
                return res.send({user_id: info.passport.user});
            }
        }
    });
});

router.post('/getCharacter', (req,res)=>{
    let sendData = [];
    const getCharacterQuery = `SELECT * FROM characters WHERE user_id = ? ORDER BY character_num asc`;
    const getEmailQuery = `SELECT email FROM member WHERE user_id = ?`;
    const getPlanTypeQuery = `SELECT plan_type FROM voucher WHERE user_id = ?`;

    conn.query(getCharacterQuery, [req.body.user_id],(error, characterData, fields)=>{
        if(error){
            console.log(error);
        }
        else{ 
            if(characterData.length === 0){
                // return res.send({valid: false});
            }else{
                sendData = characterData;
                sendData.forEach((data)=>{
                    if(data.prefer_genre !== null){
                        let getGenreDescriptionQuery = `SELECT description FROM genre_table WHERE`;
                        data.prefer_genre.forEach((el,index)=>{
                            if(data.prefer_genre.length - 1 === index){
                                getGenreDescriptionQuery += ` genre_id = ${el} `;
                            }else{
                                getGenreDescriptionQuery += ` genre_id = ${el} OR `;
                            }
                        });
                        conn.query(getGenreDescriptionQuery, (error, result, fields)=>{
                            if(error){
                                console.log(error)
                            }else{
                                let arr = [];
                                result.forEach((data)=>{
                                    arr.push(data.description);
                                });
                                data.prefer_genre = arr;
                            }
                        });
                    }
                });
            }
        }
    });
    conn.query(getEmailQuery, [req.body.user_id], (error, additionalInfo, fields)=>{
        if(error){
            console.log(error);
        }else{
            if(additionalInfo.length === 0){
                // return res.send({valid: false});
            }else{
                let additionalData = {email: '', plan_type: ''};
                additionalData.email = additionalInfo[0].email;
                conn.query(getPlanTypeQuery , [req.body.user_id], (error, planType, fields)=>{
                    if(error){
                        console.log(error);
                    }else{
                        if(planType.length === 1){
                            additionalData.plan_type = planType[0].plan_type;
                        }else{
                            additionalData.plan_type = 'none';
                        }
                        sendData.push(additionalData);
                        return res.send(sendData);
                    }
                });
            }
        }
    });
});

router.post('/getCharacterData', (req,res)=>{
    const getCharacterDataQuery = `SELECT character_id, character_num FROM characters WHERE user_id = ? and character_num = ?`;
    conn.query(getCharacterDataQuery, [req.body.user_id, req.body.characterNum], (error, result, fields)=>{
        if(error){
            console.log(error);
            res.send({success: false});
        }else{
            const sendData = result[0];
            res.send(sendData);
        }
    })
})

router.post('/createCharacter', (req,res)=>{
    const characterId = `${req.body.id}#ch0${req.body.characterNumber}`;
    const profileImageUrl = `character0${req.body.characterNumber}.png`;

    const createCharacterQuery = `insert into characters (character_id, user_id, character_num, character_name, profile_image, prefer_artist, prefer_genre, prefer_chart) values ('${characterId}', '${req.body.id}', ${req.body.characterNumber}, '${req.body.characterName}', '${profileImageUrl}', null, null, null)`;
    conn.query(createCharacterQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
            res.send({success: false});
        }else{
            // create prefer_playlist default data
            const createDefaultPreferPlaylist = `insert into prefer_playlist (character_id, music_list) values ( ? ,'[]')`;
            conn.query(createDefaultPreferPlaylist, [characterId], (error, result, fields)=>{
                if(error){
                    console.log(error);
                }else{
                    res.send({success: true, characterNum : req.body.characterNumber, characterId: characterId});
                }
            });
        }
    });
});

router.post('/characterControl', (req,res)=>{
    const getCharacterDataQuery = `select character_name, prefer_artist, prefer_genre, prefer_chart from characters where character_id = ?`;
    conn.query(getCharacterDataQuery, [req.body.characterId], (error, characterData, fields)=>{
        if(error){
            console.log(error);
        }else{
            let sendData = characterData[0];
            if(sendData.prefer_genre !== null){
                let getGenreDescriptionQuery = `select description from genre_table where`;
                sendData.prefer_genre.forEach((data, index)=>{
                    if(sendData.prefer_genre.length - 1 === index){
                        getGenreDescriptionQuery += ` genre_id = ${data} `;
                    }else{
                        getGenreDescriptionQuery += ` genre_id = ${data} or `;
                    }
                });
                conn.query(getGenreDescriptionQuery, (error, description, fields)=>{
                    if(error){
                        console.log(error);
                    }else{
                        // console.log(description);
                        let arr = [];
                        description.forEach(data => {
                            arr.push(data.description);
                        });
                        sendData.prefer_genre = arr;
                        return res.send(sendData);
                    }
                })
            }else{
                return res.send(sendData);
            }

        }
    })
});

router.post('/updateCharacterName', (req,res)=>{
    // console.log(req.body);
    const updateCharacterNameQuery = `update characters set character_name = '${req.body.newName}' where character_id = '${req.body.characterId}'`;
    conn.query(updateCharacterNameQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            res.send({success: true});
        }
    })
});

router.post('/deleteCharacter', (req,res)=>{
    const checkBeforeDeleteQuery = `select count(*) as count from characters where user_id = '${req.body.id}'`;
    try{
        
        conn.query(checkBeforeDeleteQuery, (error, count, fields)=>{
            if(error){
                console.log(error);
            }else{
                if(count[0].count === 1){
                    // 삭제하면 안됨
                    res.send({success: false});
                }else if(count[0].count > 1 && count[0].count <= 3){
                    // 삭제해도 됨
                    const deleteCharacterQuery = `delete from characters where character_id ='${req.body.characterId}' and user_id = '${req.body.id}' and character_num = '${req.body.characterNum}'`;
                    conn.query(deleteCharacterQuery, async (error, result, fields)=>{
                        if(error){
                            console.log(error);
                            res.send({success: false});
                        }else{
                            // 2023-12-13 MBJ (캐릭터 삭제하면 likey, playlist, playerlist 정보들도 함께 삭제)
                            const deleteLikeyQuery = `delete from likey where ?`;
                            let [deleteLikeyResult] = await pool.query(deleteLikeyQuery, [{character_id: req.body.characterId}]);
                            const deletePlaylistQuery = `delete from playlist where ?`;
                            let [deletePlaylistResult] = await pool.query(deletePlaylistQuery, [{character_id: req.body.characterId}]);
                            const deletePlayerlistQuery = `delete from playerlist where ?`;
                            let [deletePlayerlistResult] = await pool.query(deletePlayerlistQuery, [{character_id: req.body.characterId}]);
                            // ~ 2023-12-13 MBJ

                            const deletePreferPlaylistQuery = `delete from prefer_playlist where character_id = '${req.body.characterId}'`;
                            conn.query(deletePreferPlaylistQuery, (error, result, fields)=>{
                                if(error){
                                    console.log(error);
                                }else{
                                    const getRemainCharacterQuery = `select * from characters where user_id = '${req.body.id}'`;
                                    conn.query(getRemainCharacterQuery, (error, result, fields)=>{
                                        if(error){
                                            console.log(error);
                                        }else{
                                            const sendData = result;
                                            sendData.push({success: true});
                                            res.send(sendData);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        })
    }
    catch(err){
        console.error(err);
    }

});

router.post('/getPreferData', (req,res)=>{
    const getCharacterPreferQuery = `select * from characters where character_id = '${req.body.characterId}'`;
    conn.query(getCharacterPreferQuery, (error, prefer, fields)=>{
        if(error){
            console.log(error);
        }else{
            if(prefer.length === 0){
                console.log('/getPreferData -> prefer = [] :: empty array');
            }else{
                const preferData = prefer[0];
                if(preferData.prefer_artist !== null){
                    let userSelectedArtistQuery = `select artist_id, org_artist_image, artist_name, genre from artist where `;
                    preferData.prefer_artist.forEach((data, index)=>{
                        if(index + 1 === preferData.prefer_artist.length){
                            userSelectedArtistQuery += `(artist_id = ${data})`;
                        }else{
                            userSelectedArtistQuery += `(artist_id = ${data}) or `;
                        }
                    });
                    conn.query(userSelectedArtistQuery, (error, result, fields)=>{
                        if(error){
                            console.log(error);
                        }else{
                            preferData.prefer_artist = result;
                            if(preferData.prefer_genre !== null){
                                let userSelectedGenreQuery = `select * from genre_table where `;
                                preferData.prefer_genre.forEach((data, index)=>{
                                    if(index + 1 === preferData.prefer_genre.length){
                                        userSelectedGenreQuery += `(genre_id = ${data})`;
                                    }else{
                                        userSelectedGenreQuery += `(genre_id = ${data}) or `;
                                    }
                                });
                                conn.query(userSelectedGenreQuery, (error, result, fields)=>{
                                    if(error){
                                        console.log(error);
                                    }else{
                                        preferData.prefer_genre = result;
                                        res.send(prefer);
                                    }
                                });                      
                            }else{
                                return res.send(prefer);
                            }
                        }
                    });
                }else{
                    // prefer_artsit = null
                    if(preferData.prefer_genre !== null){
                        let userSelectedGenreQuery = `select * from genre_table where `;
                        preferData.prefer_genre.forEach((data, index)=>{
                            if(index + 1 === preferData.prefer_genre.length){
                                userSelectedGenreQuery += `(genre_id = ${data})`;
                            }else{
                                userSelectedGenreQuery += `(genre_id = ${data}) or `;
                            }
                        });
                        conn.query(userSelectedGenreQuery, (error, result, fields)=>{
                            if(error){
                                console.log(error);
                            }else{
                                preferData.prefer_genre = result;
                                res.send(prefer);
                            }
                        });                      
                    }else{
                        return res.send(prefer);
                    }

                }
                
            }
            
        }
    })
})

router.post('/getArtistData', (req,res)=>{
    const getArtistQuery = `select * from artist`;
    conn.query(getArtistQuery, (error, artist, fields)=>{
        if(error){
            console.log(error);
        }else{
            const getGernreQuery = `select * from genre_table`;
            conn.query(getGernreQuery, (error, genre, fields)=>{
                if(error){
                    console.log(error);
                }else{
                    artist.forEach((artist)=>{
                        if(artist.genre.indexOf(',') !== -1){
                            artist.genre = artist.genre.split(',')[0];
                        }
                    });
                    // genre.forEach((genre) => {
                    // });
                    const sendData = [genre, artist];
                    res.send(sendData);
                }
            });
        }
    });
});

router.post('/getGenreTable', (req,res)=>{
    const getGenreTableQuery = `select * from genre_table`;
    conn.query(getGenreTableQuery, (error, genreTable, fields)=>{
        if(error){
            console.log(error);
        }else{
            res.send(genreTable);
        }
    })
})

router.post('/updatePrefer', (req,res)=>{
    const selectedArtist = req.body.preferArtist;
    const selectedGenre = req.body.preferGenre;
    // 선택한 아티스트 업데이트 쿼리
    let updatePreferArtistQuery = '';
    if(selectedArtist.length === 0){
        updatePreferArtistQuery = `update characters set prefer_artist = null where character_id = '${req.body.characterId}'`;
    }else{
        updatePreferArtistQuery = `update characters set prefer_artist = '[`;
        selectedArtist.forEach((data, index)=>{
            if(selectedArtist.length === index + 1){
                updatePreferArtistQuery += `${data.artist_id}]' where character_id = '${req.body.characterId}'`;    
            }else{
                updatePreferArtistQuery += `${data.artist_id},`;
            }
        });
    }
    // 선택한 장르 업데이트 쿼리
    let updatePreferGenreQuery = '';
    if(selectedGenre.length === 0){
        updatePreferGenreQuery = `update characters set prefer_genre = null where character_id = '${req.body.characterId}'`;
    }else{
        updatePreferGenreQuery = `update characters set prefer_genre = '[`;
        selectedGenre.forEach((data, index)=>{
            if(selectedGenre.length === index + 1){
                updatePreferGenreQuery += `${data.genre_id}]' where character_id = '${req.body.characterId}'`;    
            }else{
                updatePreferGenreQuery += `${data.genre_id},`;
            }
        });
    }
    conn.query(updatePreferArtistQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            conn.query(updatePreferGenreQuery, (error, result, fields)=>{
                if(error){
                    console.log(error);
                }else{
                    res.send({success: true});
                }
            });
        }
    });
});

router.post('/createPreferPlaylist', (req,res)=>{
    const playlistMax = 50;
    const countArea = 3;
    const analysisData = {
        genre: [],
        gender: [],
        class: []
    };
    const selectPreferDataQuery = `select prefer_artist, prefer_genre from characters where character_id = ?`;
    conn.query(selectPreferDataQuery, [req.body.characterId], (error, selectedArr, fields)=>{
        if(error){
            console.log(error)
        }else{
            console.log(selectedArr);
            if(selectedArr.length === 0){
                // 선택한 아티스트, 장르 모두 null
            }else{
                const selectedArtistArr = selectedArr[0].prefer_artist;
                const selectedGenreArr = selectedArr[0].prefer_genre;

                let selectedGenreId = [];

                let selectPreferArtistQuery = `select * from artist where `;
                if(selectedArtistArr !== null){
                    selectedArtistArr.forEach((data, index)=>{
                        if(selectedArtistArr.length - 1 === index){
                            selectPreferArtistQuery += `(artist_id = ${data})`;
                        }else{
                            selectPreferArtistQuery += `(artist_id = ${data}) or `;
                        }
                    });
                }else{
                    selectPreferArtistQuery += 'false';
                }

                let selectPreferGenreQuery = `select * from genre_table where `;
                if(selectedGenreArr !== null){
                    selectedGenreArr.forEach((data, index)=>{
                        if(selectedGenreArr.length - 1 === index){
                            selectPreferGenreQuery += `(genre_id = ${data})`;
                        }else{
                            selectPreferGenreQuery += `(genre_id = ${data}) or `;
                        }
                    });
                }else{
                    selectPreferGenreQuery += `false`;
                }

                conn.query(selectPreferGenreQuery, (error, selectedGenre, fields)=>{
                    if(error){
                        console.log(error);
                    }else{
                        selectedGenreId = selectedGenre;
                        conn.query(selectPreferArtistQuery, (error, selectedArtist, fields)=>{
                            if(error){
                                console.log(error);
                            }else{
                                // ########################################################################
                                // class (group / solo / duo)
                                let group = 0;
                                let solo = 0;
                                let duo = 0;
                                selectedArtist.forEach((data, index)=>{
                                    if(data.artist_class === 'group'){
                                        group++;
                                    }else if(data.artist_class === 'solo'){
                                        solo++;
                                    }else if(data.artist_class === 'duo'){
                                        duo++;
                                    }else{
                                        // console.log(data);
                                    }
                                });
                                let percentageOfClass = [
                                    {group: group/(group + solo + duo)*100},
                                    {solo: solo/(group + solo + duo)*100},
                                    {duo: duo/(group + solo + duo)*100}
                                ];
                                analysisData.class = percentageOfClass;
                                // #############################################################
                                // gender (male / female)
                                let male = 0;
                                let female = 0;
                                selectedArtist.forEach((data,index)=>{
                                    if(data.artist_gender === 'male'){
                                        male++;
                                    }else if(data.artist_gender === 'female'){
                                        female++;
                                    }else{
                                        //console.log(data);
                                    }
                                });
                                let percentageOfGender = [
                                    {male: male / (male + female) * 100},
                                    {female: female / (male + female) * 100}
                                ]
                                analysisData.gender = percentageOfGender;
                                // #############################################################
                                // genre
                                let genre;
                                let kor = [];
                                let foreign = [];
                                let all = [];
                                selectedArtist.forEach((data,index)=>{
                                    if(data.genre.indexOf(',') !== -1){
                                        if(data.genre.indexOf(', ') !== -1){
                                            genre = data.genre.split(', ');
                                        }else{
                                            genre = data.genre.split(',');
                                        }
                                        if(data.area === 'pop'){
                                            genre.forEach((splitGenre)=>{foreign.push(splitGenre)});
                                        }else if(data.area ==='kpop'){
                                            genre.forEach((splitGenre)=>{kor.push(splitGenre)});
                                        }else if(data.area ==='all'){
                                            genre.forEach((splitGenre)=>{all.push(splitGenre)});
                                        }else{
                                            // all
                                        }
                                    }else{
                                        if(data.area === 'pop'){
                                            foreign.push(data.genre);
                                        }else if(data.area ==='kpop'){
                                            kor.push(data.genre);
                                        }else if(data.area ==='all'){
                                            all.push(data.genre);
                                        }else{
                                            // all
                                        }
                                    }
                                });
                                const classifiedGenre = {
                                    kpop: kor,
                                    pop: foreign,
                                    all: all
                                }
                                if(selectedGenreId.length === 0){
                                    // 사용자가 고른 장르 없음
                                }else{
                                    selectedGenreId.forEach((data) => {
                                        // push genre twenty times which is selected by client in array 
                                        if(data.area === 'pop'){
                                            for(let i = 0; i < 20; i++){
                                                classifiedGenre.pop.push(data.genre);
                                            }
                                        }else if(data.area === 'kpop'){
                                            for(let i = 0; i < 20; i++){
                                                classifiedGenre.kpop.push(data.genre);
                                            }
                                        }else if(data.area === 'all'){
                                            for(let i = 0; i < 20; i++){
                                                classifiedGenre.all.push(data.genre);
                                            }
                                        }else{
                                            console.log('selectedGenreId : '+data);
                                        }
                                        
                                    });
                                }

                                let selectedGenreobj = {
                                    pop:{},
                                    kpop:{},
                                    all: {}
                                };

                                // pop
                                classifiedGenre.pop.forEach((data) => {
                                    selectedGenreobj.pop[data] = (selectedGenreobj.pop[data] || 0) + 1;
                                });
                                let total = 0;
                                for(const key in selectedGenreobj.pop){
                                    total += selectedGenreobj.pop[key];
                                }
                                for(const key in selectedGenreobj.pop){
                                    selectedGenreobj.pop[key] = Math.round(selectedGenreobj.pop[key] * 100 / total);
                                };

                                //kpop
                                classifiedGenre.kpop.forEach((data) => {
                                    selectedGenreobj.kpop[data] = (selectedGenreobj.kpop[data] || 0) + 1;
                                });
                                total = 0;
                                for(const key in selectedGenreobj.kpop){
                                    total += selectedGenreobj.kpop[key];
                                }
                                for(const key in selectedGenreobj.kpop){
                                    selectedGenreobj.kpop[key] = Math.round(selectedGenreobj.kpop[key] * 100 / total);
                                };

                                //all
                                classifiedGenre.all.forEach((data) => {
                                    selectedGenreobj.all[data] = (selectedGenreobj.all[data] || 0) + 1;
                                });
                                total = 0;
                                for(const key in selectedGenreobj.all){
                                    total += selectedGenreobj.all[key];
                                }
                                for(const key in selectedGenreobj.all){
                                    selectedGenreobj.all[key] = Math.round(selectedGenreobj.all[key] * 100 / total);
                                };

                                let query = {
                                    pop:{},
                                    kpop:{},
                                    all:{}
                                };

                                for(const area in selectedGenreobj){
                                    for(const genre in selectedGenreobj[area]){
                                        let artistOfSelectedGenre = [];
                                        selectedArtist.forEach((data)=>{
                                            if(data.genre.indexOf(genre) !== -1){
                                                artistOfSelectedGenre.push(data.artist_id);
                                            }
                                        });
                                        let queryStr = `select music_id from music inner join artist on music.artist_id = artist.artist_id where music.genre = '${genre}' and music.area = '${area}' `;
                                        if(artistOfSelectedGenre.length === 0){
                                            
                                        }else{
                                            queryStr += `and (music.genre = '${genre}' or `;
                                            artistOfSelectedGenre.forEach((artist, index) => {
                                                if(artistOfSelectedGenre.length - 1 === index){
                                                    queryStr += ` (artist.artist_id = ${artist}))`;
                                                }else{
                                                    queryStr += ` (artist.artist_id = ${artist}) or`;
                                                }
                                            });
                                        }
                                    
                                        queryStr += ` order by hit desc limit ${Math.round(selectedGenreobj[area][genre] * playlistMax / 100 / countArea)}`;
                                        if(area === 'pop'){
                                            query.pop[genre] = queryStr;
                                        }else if(area === 'kpop'){
                                            query.kpop[genre] = queryStr;
                                        }else if(area === 'all'){
                                            query.all[genre] = queryStr;
                                        }else{
                                            // all
                                        }
                                        
                                    };
                                }
                                
                                let playlist = [];
                                let indexOfSortedObj = 0;
                                for(const i in query){
                                    for(const j in query[i]){
                                        indexOfSortedObj++;
                                    }
                                };
                                let index = 0;
                                for(const area in query){
                                    for(const querySrting in query[area]){
                                        conn.query(query[area][querySrting], (error,result,fields)=>{
                                            if(error){
                                                console.log(error);
                                            }else{
                                                index++; // variable that count for in loop
                                                result.forEach((data)=>{
                                                    playlist.push(data.music_id);
                                                });
                                                if(indexOfSortedObj === index){
                                                    const updatePreferPlaylistQuery = `update prefer_playlist set music_list = '[${playlist}]' where character_id = '${req.body.characterId}'`;
                                                    conn.query(updatePreferPlaylistQuery, (err, result, fields)=>{
                                                        if(err){
                                                            console.log(err);
                                                            return res.send({createSuccess: false});
                                                        }else{
                                                            return res.send({createSuccess: true});
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    }
                });
            }
        }
    });
});

router.post('/getPrefer', (req,res)=>{
    const sendData = {
        coverImage: '',
        description:'',
        music_list: []
    }
    const getPreferMusicIdQuery =`select music_list from prefer_playlist where character_id = ?`;
    conn.query(getPreferMusicIdQuery, [req.body.characterId], (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            const arr = result[0].music_list;
            if(arr.length === 0){   
                res.send({data: false});
            }else{
                let getmusicDataQuery = `select music.*, album.org_cover_image, artist.artist_name, album.album_title from music 
                inner join album on music.album_id = album.album_id inner join artist on music.artist_id = artist.artist_id where`;
                arr.forEach((data, idx)=>{
                    if(arr.length - 1 === idx){
                        getmusicDataQuery += ` music.music_id = '${data}'`;
                    }else{
                        getmusicDataQuery += ` music.music_id = '${data}' or`;
                    }
                });
                conn.query(getmusicDataQuery, (error,result,fields)=>{
                    if(error){
                        console.log(error);
                    }else{
                        const shuffledList = [...result].sort(()=>Math.random() - 0.5);
                        sendData.music_list = shuffledList;
                        sendData.coverImage = shuffledList[0].org_cover_image;
                        sendData.description = '좋아할만한 아티스트 MIX';
                        return res.send(sendData);
                    }
                });
            }
        }
    })
});

router.post('/getBannerImage', async(req,res)=>{
    const [isExist] = await pool.query(`select exists (select * from characters where character_id = '${req.body.characterId}') as isExist`);
    if(!JSON.parse(isExist[0].isExist)){
        return res.send({valid: false});
    }else{
        const getPreferMusicDataQuery = `select prefer_artist from characters where character_id = ?`;
        conn.query(getPreferMusicDataQuery, [req.body.characterId], (error, artist, fields)=>{
            if(error){
                console.error(error);
            }else{
                console.log(artist)
                if(artist[0].prefer_artist === null){
                    const preferMusicQuery = `select * from prefer_playlist where character_id = ?`;
                    conn.query(preferMusicQuery, [req.body.characterId], async(error, music, fields)=>{
                        if(error){
                            console.error(error)
                        }else{
                            let getMusicListFullDataQuery = `select distinct artist_id from music where`;
                            if(music[0]?.music_list?.length !== 0){
                                music[0].music_list.forEach((data, index)=>{
                                    if(music[0].music_list.length - 1 === index){
                                        getMusicListFullDataQuery += ` music_id = '${data} '`
                                    }else{
                                        getMusicListFullDataQuery += ` music_id = '${data}' or`
                                    }
                                })
                            }
                            else{
                                res.json(-1);
                                return ;
                            }
                            let [distinctData] = await pool.query(getMusicListFullDataQuery);
                            let distinctArray = [];
                            distinctData.forEach((data)=>{
                                distinctArray.push(data.artist_id);
                            });
                            const generateImage = (array) => {
                                let total = array.length - 1;
                                let random1;
                                let random2;
                                let random3;
                                do{
                                    random1 = array[Math.round(Math.random() * total)];
                                    random2 = array[Math.round(Math.random() * total)];
                                    random3 = array[Math.round(Math.random() * total)];
                                }while(random1 === random2 || random2 === random3 || random3 === random1);
                                return [random1, random2, random3];
                            }
                            
                            if(music[0].music_list.length === 0){
                                return res.json(-1);                                        
                            }else{
                                const bannerImageArr = generateImage(distinctArray);
                                const getBannerImageUrlQuery = `select org_artist_image as img from artist where (artist_id = ? ) or (artist_id = ? ) or (artist_id = ? )`;
                                conn.query(getBannerImageUrlQuery, [bannerImageArr[0], bannerImageArr[1], bannerImageArr[2]], (error, imageUrl, fields)=>{
                                    if(error){
                                        console.error(error);
                                    }else{
                                        let sendData = [];
                                        imageUrl.forEach((data, index) => {
                                            sendData.push(imageUrl[index].img);
                                        });
                                        res.send(sendData);
                                    }
                                });
                            }
                        }
                    });
                }else if(artist[0].prefer_artist !== null){
                    if(artist[0].prefer_artist.length >= 3){
                        const artistArray = artist[0].prefer_artist;
                        const getArtistImageQuery = `select org_artist_image from artist where artist_id = ? or artist_id = ? or artist_id = ?`;
                        conn.query(getArtistImageQuery, [artistArray[0], artistArray[1], artistArray[2]], (error, result, fields)=>{
                            if(error){
                                console.log(error)
                            }else{
                                let sendData = [];
                                result.forEach((data) => {
                                    sendData.push(data.org_artist_image);
                                });
                                return res.send(sendData);
                            }
                        })
                    }else{
                        const preferMusicQuery = `select * from prefer_playlist where character_id = ?`;
                        conn.query(preferMusicQuery, [req.body.characterId], async(error, music, fields)=>{
                            if(error){
                                console.error(error)
                            }else{
                                let getMusicListFullDataQuery = `select distinct artist_id from music where`;
                                if(music[0]?.music_list?.length !== 0){
                                    music[0].music_list.forEach((data, index)=>{
                                        if(music[0].music_list.length - 1 === index){
                                            getMusicListFullDataQuery += ` music_id = '${data} '`
                                        }else{
                                            getMusicListFullDataQuery += ` music_id = '${data}' or`
                                        }
                                    })
                                }
                                let [distinctData] = await pool.query(getMusicListFullDataQuery);
                                let distinctArray = [];
                                distinctData.forEach((data)=>{
                                    distinctArray.push(data.artist_id);
                                });
                                const generateImage = (array) => {
                                    let total = array.length - 1;
                                    let random1;
                                    let random2;
                                    let random3;
                                    do{
                                        random1 = array[Math.round(Math.random() * total)];
                                        random2 = array[Math.round(Math.random() * total)];
                                        random3 = array[Math.round(Math.random() * total)];
                                    }while(random1 === random2 || random2 === random3 || random3 === random1);
                                    return [random1, random2, random3];
                                }
                                if(music[0].music_list.length === 0){
                                    return res.json(-1);                                        
                                }else{
                                    const bannerImageArr = generateImage(distinctArray);
                                    const getBannerImageUrlQuery = `select org_artist_image as img from artist where (artist_id = '${bannerImageArr[0]}') or (artist_id = '${bannerImageArr[1]}') or (artist_id = '${bannerImageArr[2]}')`;
                                    conn.query(getBannerImageUrlQuery, (error, imageUrl, fields)=>{
                                        if(error){
                                            console.error(error);
                                        }else{
                                            let sendData = [];
                                            imageUrl.forEach((data, index) => {
                                                sendData.push(imageUrl[index].img);
                                            });
                                            res.send(sendData);
                                        }
                                    })
                                }
                            }
                        });
                    }
                }
                else{
                    res.send({recommend: false});
                }
            }
        });
    }
})

router.post('/confirmPassword', (req,res)=>{
    const getPasswordQuery = `select password from member where user_id = ?`;
    conn.query(getPasswordQuery, [req.body.user_id], async(error, hashedPassword, fields)=>{
        if(error){console.log(error)}
        else{
            if(hashedPassword.length === 1){
                const confirmed = await bcrypt.compare(req.body.password, hashedPassword[0].password);
                if(confirmed){
                    res.send({confirmed: true});
                }else{
                    res.send({confirmed: false});    
                }
            }else{
                res.send({confirmed: false});
            }
        }
    });
});

router.post('/changePassword', async(req,res)=>{
    let encryptedPassword;
    const hashPassword = async (password) => {
        return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    };
    await hashPassword(req.body.newPassword).then((hashedData)=>{
        encryptedPassword = hashedData;
    });
    const insertNewPasswordQuery = `update member set password = ? where user_id = ?`;
    conn.query(insertNewPasswordQuery, [encryptedPassword, req.body.user_id], (error, result, fields)=>{
        if(error){
            console.log(error);
            res.send({status: 500, success: false});
        }
        else{
            res.send({status: 200, success: true});
        }
    })
});

router.post('/myinfo/phone', async(req, res) =>{
    const SelectUserPhone = `select phone from member where ?`;
    conn.query(SelectUserPhone, [{user_id: req.body.id}], (err, row) =>{
        res.send(row);
    })
});

router.post('/changePhone', async(req,res)=>{
    const SelectUserPhone = `select phone from member`;
    conn.query(SelectUserPhone, (err, row) =>{
        for(i = 0; i < row.length; i++){
            if(req.body.newPhone === row[i].phone){
                res.json(1);
                return;
            }
        }
        const UpdateUserPhone = `update member set ? where ?`;
        conn.query(UpdateUserPhone, [{phone: req.body.newPhone}, {user_id: req.body.id}], (err, row) =>{
            res.send(row);
        })
    });
});

/**
 * @param {string} rawDate : convert to proper format for mysql insert query
 * @return {string} 'addZero'
 */
const dateTimeFormmater = (rawDate, str) => {
    const date = new Date(rawDate);
    let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    if(str === 'addZero'){
        let month = date.getMonth() + 1;
        month = month >= 10 ? month : '0' + month;
        let day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        let hours = date.getHours();
        hours = hours >= 10 ? hours : '0' + hours;
        let minutes = date.getMinutes();
        minutes =  minutes >= 10 ? minutes : '0' + minutes;
        let seconds = date.getSeconds();
        seconds = seconds >= 10 ? seconds : '0' + seconds;
        formattedDate = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds} `;
    }
    return formattedDate;
}

/**
 * @param {object} date : convert to yyyy-mm-dd hh:mm:ss formatted date string
 * @return {string}
 */
const getTimestamp = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month >= 10 ? month : '0' + month;
    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;
    let hours = date.getHours();
    hours = hours >= 10 ? hours : '0' + hours;
    let minutes = date.getMinutes();
    minutes =  minutes >= 10 ? minutes : '0' + minutes;
    let seconds = date.getSeconds();
    seconds = seconds >= 10 ? seconds : '0' + seconds;
    let timeStamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} `;
    return timeStamp;
    // return `${year}-${month}-${day} ${hours}:${minutes} `
}

router.post('/getVoucher', (req,res)=>{
    const getVoucherInfoQuery = `select a.user_id, a.name, a.purchase, b.purchase_date, b.renewal_date, b.plan_type, b.remaining_number from member a right join voucher b on a.user_id = b.user_id where a.user_id = ?`;
    conn.query(getVoucherInfoQuery, [req.body.user_id], (error, userVoucher, fields)=>{
        if(error){
            console.log(error);
        }else{
            if(userVoucher.length === 0){
                res.send({purchase: false});
            }else{
                userVoucher[0].purchase_date = dateTimeFormmater(userVoucher[0].purchase_date, 'addZero');
                userVoucher[0].renewal_date = dateTimeFormmater(userVoucher[0].renewal_date, 'addZero');
                res.send(userVoucher[0]);
            }
        }
    })
});

router.post('/getStandbyVoucher', (req,res)=>{
    let standbyVoucherData = {};
    const getStandbyVoucherQuery = `select * from standby_voucher where user_id = ?`;
    conn.query(getStandbyVoucherQuery, [req.body.user_id], (error, standbyVoucher, fields)=>{
        if(error){console.log(error)}
        else{
            if(standbyVoucher.length === 1){
                standbyVoucher[0].purchase = true;
                standbyVoucher[0].purchase_date = dateTimeFormmater(standbyVoucher[0].purchase_date, 'addZero');
                standbyVoucher[0].renewal_date = dateTimeFormmater(standbyVoucher[0].renewal_date, 'addZero');
                standbyVoucherData = standbyVoucher[0];
            }else{
                standbyVoucherData.purchase = false;
            }
            res.send(standbyVoucherData);
        }
    })
})

router.post('/getExpiredVoucher', (req, res)=>{
    const getExpiredVoucherQuery = `SELECT * FROM expired_voucher WHERE user_id = ? order by purchase_date desc`;
    conn.query(getExpiredVoucherQuery, [req.body.user_id], (error, expiredVoucher, fields)=>{
        if(error){
            console.log(error);
            res.send({exist: false, message: error.message});
        }
        else{
            expiredVoucher.forEach((data)=>{
                data.purchase_date = dateTimeFormmater(data.purchase_date, 'addZero');
                data.renewal_date = dateTimeFormmater(data.renewal_date, 'addZero');
            })
            res.send(expiredVoucher);
        }
    })
})


router.post('/buy' , (req,res)=>{
    const now = new Date();
    const currentVoucherEndDate = new Date(req.body.currentVoucherEndDate);
    let renewalDate;
    const purchaseData = {
        id: req.body.user_id,
        purchaseDate: '',
        renewalDate: '',
        planType: req.body.type,
        remainingNumber: ''
    }
    if(req.body.currentVoucher === false){
        switch(req.body.type){
            case 'oneday':
                renewalDate = new Date(now.setDate(now.getDate()+1));
                purchaseData.remainingNumber = null;
                break;
            case 'oneweek':
                renewalDate = new Date(now.setDate(now.getDate()+7));
                purchaseData.remainingNumber = null;
                break;
            case 'twoweek':
                renewalDate = new Date(now.setDate(now.getDate()+14));
                purchaseData.remainingNumber = null;
                break;
            case 'onemonth':
                renewalDate = new Date(now.setMonth(now.getMonth()+1));
                purchaseData.remainingNumber = null;
                break;
            case 'onlyfifty':
                renewalDate = new Date(now.setMonth(now.getMonth()+1));
                purchaseData.remainingNumber = 50;
                break;
            case 'onlyhundred':
                renewalDate = new Date(now.setMonth(now.getMonth()+1));
                purchaseData.remainingNumber = 100;
                break;
            default: 
                return res.send({success: false});
                break;
        }
        
        purchaseData.purchaseDate = getTimestamp(new Date());
        purchaseData.renewalDate = getTimestamp(renewalDate);
        
    }else{
        // 현재 이용권 존재해서 standby_voucher 테이블로 구매정보 저장
        switch(req.body.type){
            case 'oneday':
                renewalDate = new Date(currentVoucherEndDate.setDate(currentVoucherEndDate.getDate()+1));
                purchaseData.remainingNumber = null;
                break;
            case 'oneweek':
                renewalDate = new Date(currentVoucherEndDate.setDate(currentVoucherEndDate.getDate()+7));
                purchaseData.remainingNumber = null;
                break;
            case 'twoweek':
                renewalDate = new Date(currentVoucherEndDate.setDate(currentVoucherEndDate.getDate()+14));
                purchaseData.remainingNumber = null;
                break;
            case 'onemonth':
                renewalDate = new Date(currentVoucherEndDate.setMonth(currentVoucherEndDate.getMonth()+1));
                purchaseData.remainingNumber = null;
                break;
            case 'onlyfifty':
                renewalDate = new Date(currentVoucherEndDate.setMonth(currentVoucherEndDate.getMonth()+1));
                purchaseData.remainingNumber = 50;
                break;
            case 'onlyhundred':
                renewalDate = new Date(currentVoucherEndDate.setMonth(currentVoucherEndDate.getMonth()+1));
                purchaseData.remainingNumber = 100;
                break;
            default: 
                return res.send({success: false});
                break;
        }
        
        purchaseData.purchaseDate = getTimestamp(new Date(req.body.currentVoucherEndDate));
        purchaseData.renewalDate = getTimestamp(renewalDate);
    }
    const updateMemberPurchaseQuery = `update member set purchase = 1 where user_id = ?`;

    let updateVoucherInformationQuery = `insert into ${req.body.database} (user_id, purchase_date, renewal_date, plan_type, remaining_number) values ('${purchaseData.id}', '${purchaseData.purchaseDate}', '${purchaseData.renewalDate}', '${purchaseData.planType}', ${purchaseData.remainingNumber})`;
    if(purchaseData.remainingNumber == null){
        updateVoucherInformationQuery = `insert into ${req.body.database} (user_id, purchase_date, renewal_date, plan_type, remaining_number) values ('${purchaseData.id}', '${purchaseData.purchaseDate}', '${purchaseData.renewalDate}', '${purchaseData.planType}', null)`;
    }
    console.log(updateVoucherInformationQuery)
    conn.query(updateMemberPurchaseQuery, [req.body.user_id], (error, result, fields)=>{
        if(error){
            console.log(error); 
            res.send({success: false});
        }
        else{
            conn.query(updateVoucherInformationQuery, (error, result, fields)=>{
                if(error){
                    console.log(error);
                    res.send({success: false});
                }
                else{
                    res.send({success: true});
                }
            });
        }
    });
    
});

router.post('/checkCurrentVoucher', (req,res)=>{
    const checkCurrentVoucherQuery = `select * from member a right join voucher b on a.user_id = b.user_id where a.user_id = ?`;
    conn.query(checkCurrentVoucherQuery, [req.body.user_id], (error, result, fields)=>{
        if(error){console.log(error)}
        else{
            if(result.length === 1){ // 현재 이용권 존재 => 사용대기 이용권 있는지도 확인해서 보내주자
                const checkStandbyVoucherQuery = `select user_id from standby_voucher where user_id = ? `;
                conn.query(checkStandbyVoucherQuery, [req.body.user_id], (error, standbyVoucher, fields)=>{
                    if(error){console.log(error)}
                    else{
                        if(standbyVoucher.length === 1){
                            res.send({currentVoucher: true, renewalDate: result[0].renewal_date, standbyVoucher: true});
                        }else{
                            res.send({currentVoucher: true, renewalDate: result[0].renewal_date, standbyVoucher: false});
                        }
                    }
                })
            }else{ // 현재 이용권 없음 => 사용대기 이용권 당연히 없음
                res.send({currentVoucher: false});
            }
        }
    })
});



router.post('/logout', (req,res)=>{
    const removeSessionQuery = `DELETE FROM sessions WHERE session_id = ?`;
    conn.query(removeSessionQuery, [req.body.token], (error, rs, fields)=>{
        if(error){
            console.log(error);
            res.send({logoutSuccess: false});
        }else{
            res.send({logoutSuccess: true});
        }
    })
});

router.post('/withdraw', (req,res)=>{
    const withdrawQuery = `delete from member where user_id = ?`;
    conn.query(withdrawQuery, [req.body.user_id], (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            conn.query(`delete from sessions where session_id = "${req.body.token}"`, (error,result,fields)=>{
                if(error){console.log(error)}
                else{}
            });
            res.send({status: 200, withdraw: true});
        }
    });
});


module.exports = router;