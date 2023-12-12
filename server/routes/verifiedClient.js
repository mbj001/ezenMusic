const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/issuanceCharacterCookie', (req,res)=>{
    const selectCharacterQuery = `select * from characters where user_id = '${req.body.clientId}'`;
    conn.query(selectCharacterQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            // console.log(result);
            if(result.length === 0 ){
                console.log('verifiedClient.js 16line 이건 찍히면 안돼 절대 안돼;');
                return res.send({valid: false});
            }else{
                return res.send({characterId: result[0].character_id, characterNum: result[0].character_num});
            }
        }
    });
});

router.post('/checkCharacterCookie', (req,res)=>{
    const checkCharacterCookieQuery = `select exists (select * from characters where character_id = '${req.body.characterId}') as isExist`;
    conn.query(checkCharacterCookieQuery, (error, check, fields)=>{
        if(error){
            console.log(error);
        }else{
            // console.log(check)
            res.send({isExist: check[0].isExist});
        }
    })
});

router.post('/checkCharacterCount', (req, res)=>{
    conn.query(`select character_num from characters where user_id = '${req.body.clientId}'`, (error, result, fields)=>{
            if(error){
            console.log(error);
        }else{
            // console.log(result);
            let sendData = [];
            result.forEach((data)=>{
                sendData.push(data.character_num);
            })
            res.send(sendData);
        }
    });
});

router.post('/check', (req,res)=>{
    // client app.js -> line 36
    res.send({valid: true});
})

router.post('/info', (req,res)=>{
    const userInfoQuery = `SELECT * FROM member A RIGHT JOIN voucher B ON A.user_id = B.user_id WHERE A.user_id = '${req.body.id}'`;
    conn.query(userInfoQuery, (error, selectResult, fields)=>{
        if(error){
            console.log(error);
        }else{
            if(selectResult.length === 0){
                const noVoucherQuery = `SELECT name, email, purchase FROM member WHERE user_id = '${req.body.id}'`;
                conn.query(noVoucherQuery, (error, result, fields)=>{
                    if(error){
                        console.log(error);
                    }else{
                        // console.log("**************************************");
                        // console.log(req.body.id);
                        // console.log(result);
                        const sendNoVoucherDataToClient = {
                            email: result[0]?.email,
                            purchase: result[0]?.purchase,
                            plan_type: 'none'
                        }
                        // if(result[0].purchase === null){
                        //     conn.query(`update member set purchase = 0 where user_id ='${req.body.id}'`, (error,result,fields)=>{
                        //         if(error){console.log(error)}
                        //         else{}
                        //     });
                        //     sendNoVoucherDataToClient.purchase = 0;
                        // }
                        res.send(sendNoVoucherDataToClient);
                    }
                })
            }else{
                const sendDataToClient = {
                    email: selectResult[0].email,
                    purchase: Boolean(selectResult[0].purchase),
                    purchase_date: selectResult[0]?.purchase_date,
                    plan_type: selectResult[0]?.plan_type
                };
                // console.log(sendDataToClient);
                res.send(sendDataToClient);
            }
        }
    });
});

router.post('/removeInvalidSessions', (req,res)=>{
    const sessionid = req.body.token;
    const clientsid = req.body.clientsid;

    const findInvalidSessionQuery = `SELECT * FROM sessions WHERE session_id = '${sessionid}' OR data LIKE '%${clientsid}%'`;
    conn.query(findInvalidSessionQuery, (error,invalidSessions,fields)=>{
        if(error){
            console.log(error);
        }else{
            if(invalidSessions){
                invalidSessions.forEach((data)=>{
                    const deleteInvalidSessionsQuery = `DELETE FROM sessions WHERE session_id = '${data.session_id}'`;
                    conn.query(deleteInvalidSessionsQuery, (error,rs,fields)=>{
                        if(error){
                            console.log(error);
                        }else{
                            console.log('removeInvalidSessions');
                            console.log(`${data.session_id} has been deleted!`);
                        }
                    });
                });
                console.log('delete ok');
                // res.send('reset');
            }
        }
    });
    res.send('세션데이터 체크 완료');
});

router.post('/reissuance', (req,res)=>{
    let data = {
        id: '',
        valid: true
    };
    const query = `SELECT * FROM sessions WHERE session_id = '${req.body.token}'`;
    conn.query(query, (error, result, fields)=>{
        if(error){
            console.error(error);
        }else{
            if(result.length === 0){
                data.valid = false;
                res.send(data);
            }else{
                let info = JSON.parse(result[0].data);
                data.id = info.passport.user;
                // console.log('%%%%%%%%%%%%')
                // console.log(data)
                // console.log('%%%%%%%%%%%%')
                res.send(data);
            }
        }
    });
});

router.post('/getCharacter', (req,res)=>{
    let sendData = [];
    let additionalData = {
        email: '',
        plan_type: ''
    };
    const query = `SELECT * FROM sessions WHERE session_id = '${req.body.token}'`;
    conn.query(query, (error, result, fields)=>{
        if(error){
            console.error(error);
        }else{
            if(result.length === 0){
                sendData.valid = false;
                res.send(sendData);
            }else{
                let info = JSON.parse(result[0].data);
                // console.log('@@@@@@@@@@@@@@@@@@@@ info @@@@@@@@@@@@@@@@@@@@')
                // console.log(info);
                // console.log('@@@@@@@@@@@@@@@@@@@@ info @@@@@@@@@@@@@@@@@@@@')   
                const getCharacterQuery = `SELECT * FROM characters WHERE user_id = '${info.passport.user}' ORDER BY character_num asc`;
                const getEmailQuery = `SELECT email FROM member WHERE user_id = '${info.passport.user}'`;
                const getPlanTypeQuery = `SELECT plan_type FROM voucher WHERE user_id = '${info.passport.user}'`;

                conn.query(getCharacterQuery, (error, characterData, fields)=>{
                    if(error){
                        console.log(error);
                        res.send({message: error.message});
                    }
                    else{
                        // console.log('@@@@@@@@@@@@@@@@@@@@ characterData @@@@@@@@@@@@@@@@@@@@')
                        // console.log(characterData);
                        // console.log('@@@@@@@@@@@@@@@@@@@@ characterData @@@@@@@@@@@@@@@@@@@@')  
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
                                        // console.log(result)
                                        let arr = [];
                                        result.forEach((data)=>{
                                            arr.push(data.description);
                                        });
                                        data.prefer_genre = arr;
                                    }
                                });
                            }
                        })
                    }
                });
                conn.query(getEmailQuery, (error, additionalInfo, fields)=>{
                    if(error){
                        console.log(error);
                        res.send({message: error.message});
                    }else{
                        // console.log('@@@@@@@@@@@@@@@@@@@@ additionalInfo @@@@@@@@@@@@@@@@@@@@')
                        // console.log(additionalInfo);
                        // console.log('@@@@@@@@@@@@@@@@@@@@ additionalInfo @@@@@@@@@@@@@@@@@@@@') 
                        if(additionalInfo.length === 0){
                            res.json(-1);
                        }else{
                            additionalData.email = additionalInfo[0].email;
                            conn.query(getPlanTypeQuery ,async(error, planType, fields)=>{
                                if(error){
                                    console.log(error);
                                }else{
                                    if(planType.length === 1){
                                        additionalData.plan_type = planType[0].plan_type;
                                    }else{
                                        additionalData.plan_type = 'none';
                                    }
                                    sendData.push(additionalData);
                                    // console.log(sendData);

                                    // console.log('send ok'); 
                                    res.send(sendData)
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

router.post('/getCharacterData', (req,res)=>{
    const getCharacterDataQuery = `SELECT character_id, character_num FROM characters WHERE user_id = '${req.body.id}' and character_num = ${req.body.characterNum}`;
    conn.query(getCharacterDataQuery, (error, result, fields)=>{
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
    // console.log(req.body);
    const characterId = `${req.body.id}#ch0${req.body.characterNumber}`;
    // console.log('characterId:'+characterId)
    const profileImageUrl = `character0${req.body.characterNumber}.png`;
    const createCharacterQuery = `insert into characters (character_id, user_id, character_num, character_name, profile_image, prefer_artist, prefer_genre, prefer_chart) values ('${characterId}', '${req.body.id}', ${req.body.characterNumber}, '${req.body.characterName}', '${profileImageUrl}', null, null, null)`;
    conn.query(createCharacterQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
            res.send({success: false});
        }else{
            // 캐릭터 선호 플레이리스트 생성
            const createDefaultPreferPlaylist = `insert into prefer_playlist (character_id, music_list) values ('${characterId}','[]')`;
            conn.query(createDefaultPreferPlaylist, (error, result, fields)=>{
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
    const getCharacterDataQuery = `select character_name, prefer_artist, prefer_genre, prefer_chart from characters where character_id = '${req.body.characterId}'`;
    // console.log(getCharacterDataQuery);
    conn.query(getCharacterDataQuery, (error, characterData, fields)=>{
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

router.post('/deleteCharacter' ,(req,res)=>{
    const checkBeforeDeleteQuery = `select count(*) as count from characters where user_id = '${req.body.id}'`;
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
                conn.query(deleteCharacterQuery, (error, result, fields)=>{
                    if(error){
                        console.log(error);
                        res.send({success: false});
                    }else{
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

});

router.post('/getPreferData', (req,res)=>{
    const getCharacterPreferQuery = `select * from characters where character_id = '${req.body.characterId}'`;
    conn.query(getCharacterPreferQuery, (error, prefer, fields)=>{
        if(error){
            console.log(error);
        }else{
            if(prefer.length === 0){
                console.log('/getPreferData -> prefer = []');
            }else{
                const preferData = prefer[0];
                // console.log('******************************')
                // console.log(preferData)
                // console.log('******************************')
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
                                // console.log('$$$$$$$$$$$$$$$$$$$$')
                                // console.log(userSelectedGenreQuery)
                                // console.log('$$$$$$$$$$$$$$$$$$$$')                        
                            }else{
                                return res.send(prefer);
                            }
                        }
                    });
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
                    // console.log(artist);
                    // console.log(genre);
                    artist.forEach((artist)=>{
                        // artist의 genre 컬럼의 데이터가 여러개 들어있는 아티스트는 그냥 제일 앞의 장르 하나만
                        // 여러개 장르 중복되지 않도록
                        if(artist.genre.indexOf(',') !== -1){
                            artist.genre = artist.genre.split(',')[0];
                        }
                    });
                    genre.forEach((genre) => {
                        // console.log(genre);
                    });
                    const sendData = [genre, artist];
                    // console.log(sendData);
                    res.send(sendData);
                }
            });
        }
    });
});

router.post('/getGenreData', (req,res)=>{
    const getGernreQuery = `select * from genre_table`;
    conn.query(getGernreQuery, (error, genre, fields)=>{
        if(error){
            console.log(error);
        }else{
            // console.log(genre);
            res.send(genre);
        }
    });
});

router.post('/getGenreTable', (req,res)=>{
    const getGenreTableQuery = `select * from genre_table`;
    conn.query(getGenreTableQuery, (error, genreTable, fields)=>{
        if(error){
            console.log(error);
        }else{
            // console.log(genreTable);
            res.send(genreTable);
        }
    })
})

router.post('/updatePrefer', (req,res)=>{
    // console.log(req.body);
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
    // console.log(req.body);
    const playlistMax = 50; // 플레이리스트 노래 개수
    const analysisData = {
        genre: [],
        gender: [],
        class: []
    };
    // console.log(analysisData);
    conn.query(`select prefer_artist, prefer_genre from characters where character_id = '${req.body.characterId}'`, (error, selectedArr, fields)=>{
        if(error){
            console.log(error)
        }else{
            console.log(selectedArr);
            if(selectedArr[0].prefer_artist === null){

            }else{
                const selectedArtistArr = selectedArr[0].prefer_artist;
                const selectedGenreArr = selectedArr[0].prefer_genre;
                console.log('### selectedGenre ###')
                console.log(selectedGenreArr);
                let selectedGenreId = [];

                let selectPreferArtistQuery = `select * from artist where `;
                selectedArtistArr.forEach((data, index)=>{
                    if(selectedArtistArr.length - 1 === index){
                        selectPreferArtistQuery += `(artist_id = ${data})`;
                    }else{
                        selectPreferArtistQuery += `(artist_id = ${data}) or `;
                    }
                });

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

                // console.log(selectPreferArtistQuery);
                console.log(selectPreferGenreQuery); 
                conn.query(selectPreferGenreQuery, (error, selectedGenre, fields)=>{
                    if(error){
                        console.log(error);
                    }else{
                        selectedGenreId = selectedGenre;
                        console.log('### selectedGenre ###')
                        console.log(selectedGenre);
                        conn.query(selectPreferArtistQuery, (error, selectedArtist, fields)=>{
                            if(error){
                                console.log(error);
                            }else{
                                /*
                                    selectedArtist : 사용자가 고른 아티스트 전체 데이터 뽑아온 배열
                                */
                                // console.log(selectedArtist)
                                // #################### ALGORITHM of prefer with genre ####################
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
                                // console.log(percentageOfClass)
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
                                // console.log(percentageOfGender)
                                analysisData.gender = percentageOfGender;
                                // #############################################################
                                // genre
                                let genre;
                                let selectedGenreName = [];
                                let kor = [];
                                let foreign = [];
                                let all = [];
                                selectedArtist.forEach((data,index)=>{
                                    if(data.genre.indexOf(',') !== -1){ // , 를 포함하면
                                        // 문자열 , 기준 쪼개고
                                        if(data.genre.indexOf(', ') !== -1){
                                            genre = data.genre.split(', ');
                                        }else{
                                            genre = data.genre.split(',');
                                        }
                                        // area 구분
                                        if(data.area === 'pop'){
                                            genre.forEach((splitGenre)=>{foreign.push(splitGenre)});
                                        }else if(data.area ==='kpop'){
                                            genre.forEach((splitGenre)=>{kor.push(splitGenre)});
                                        }else{
                                            // all
                                        }
                                    }else{
                                        // area 구분
                                        if(data.area === 'pop'){
                                            foreign.push(data.genre);
                                        }else if(data.area ==='kpop'){
                                            kor.push(data.genre);
                                        }else{
                                            // all
                                        }
                                    }

                                    
                                });
                                const classifiedGenre = {
                                    kpop: kor,
                                    pop: foreign
                                    //all: all
                                }
                                console.log(classifiedGenre)
                                // selectedGenreName: 사용자가 선택한 아티스트의 장르 다 잘라서 배열에 싹 담아둠 ( 여기서 중복 존재, genre도 여기에 추가 )
                                // console.log('before weighting')
                                // console.log(selectedGenreName);
                                if(selectedGenreId.length === 0){
                                    // 사용자가 고른 장르 없음
                                }else{
                                    selectedGenreId.forEach((data) => {
                                        if(data.area === 'pop'){
                                            for(let i = 0; i < 20; i++){
                                                classifiedGenre.pop.push(data.genre);
                                            }
                                        }else if(data.area === 'kpop'){
                                            for(let i = 0; i < 20; i++){
                                                classifiedGenre.kpop.push(data.genre);
                                            }
                                        }else{
                                            console.log('selectedGenreId : '+data);
                                        }
                                        
                                    });
                                }
                                // console.log('after weighting')
                                // console.log(selectedGenreName);
                                console.log('### classifiedGenre ###')
                                console.log(classifiedGenre)

                                // console.log('### selectedGenreId ###')
                                // console.log(selectedGenreId);

                                let selectedGenreobj = {
                                    pop:{},
                                    kpop:{}
                                };
                                let countSelectedGenreobj = {
                                    pop:{},
                                    kpop:{}
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
                                
                                console.log('### selectedGenreobj ###')
                                console.log(selectedGenreobj)
                                
                                // percentage 높은 순 정렬
                                // const sortedByValue = Object.entries(countSelectedGenreobj);
                                // sortedByValue.sort(([, valueA], [, valueB]) => valueB - valueA);
                                // sortedByValue.reduce((acc, [key, value]) => {
                                //     acc[key] = value;
                                //     return acc;
                                // }, {});
                                // const sortedObject = sortedByValue.reduce((acc, [key, value]) => {
                                //     acc[key] = value;
                                //     return acc;
                                // }, {});
                                // console.log('### sortedObject ###')
                                // console.log(sortedObject); 
        
                                // {'':'', '':''}
                                const percentageOfGenre = selectedGenreobj;
                                // #############################################################
                                // create playlist
            
                                /**
                                 * sortedObject = {
                                 *      kpop:{
                                 *          Dance: 12,
                                 *          Pop: 56,
                                 *          ...
                                 *      },
                                 *      pop:{
                                 *      
                                 *      }
                                 * }
                                 */
                                
                                let query = {
                                    pop:{},
                                    kpop:{}
                                };
                                let countArea = 0;
                                for(const area in selectedGenreobj){
                                    countArea++;
                                    for(const genre in selectedGenreobj[area]){
                                        // console.log('### area in selectedGenreobj ###')
                                        // console.log(area)
                                        let artistOfSelectedGenre = [];
                                        selectedArtist.forEach((data)=>{
                                            if(data.genre.indexOf(genre) !== -1){
                                                artistOfSelectedGenre.push(data.artist_id);
                                            }
                                        });
                                        let queryStr = `select music_id from music inner join artist on music.artist_id = artist.artist_id where music.genre = '${genre}' and music.area = '${area}' `;
                                        // console.log('### artistOfSelectedGenre ###')
                                        // console.log(artistOfSelectedGenre)
                                        if(artistOfSelectedGenre.length === 0){
    
                                        }else{
                                            queryStr += `and (music.genre = '${genre}' or `;
                                            artistOfSelectedGenre.forEach((artist, index) => {
                                                if(artistOfSelectedGenre.length - 1 === index){
                                                    // console.log(artist);
                                                    queryStr += ` (artist.artist_id = ${artist}))`;
                                                }else{
                                                    // console.log(artist);
                                                    queryStr += ` (artist.artist_id = ${artist}) or`;
                                                }
                                            });
                                        }
                                    
                                        queryStr += ` order by hit desc limit ${Math.round(selectedGenreobj[area][genre] * playlistMax / 100 / countArea)}`;
                                        console.log('******************************')
                                        console.log(queryStr)
                                        console.log('******************************')
                                        if(area === 'pop'){
                                            query.pop[genre] = queryStr;
                                        }else if(area === 'kpop'){
                                            query.kpop[genre] = queryStr;
                                        }else{
                                            // all
                                        }
                                        
                                    };
                                }
                                console.log(query);
                                
                                let playlist = [];
                                let indexOfSortedObj = 0;
                                for(const i in query){
                                    for(const j in query[i]){
                                        indexOfSortedObj++;
                                    }
                                };
                                console.log(indexOfSortedObj);
                                let index = 0;
                                for(const area in query){
                                    for(const querySrting in query[area]){
                                        conn.query(query[area][querySrting], (error,result,fields)=>{
                                            if(error){
                                                console.log(error);
                                            }else{
                                                index++;
                                                console.log(result)
                                                result.forEach((data)=>{
                                                    playlist.push(data.music_id);
                                                });
                                                // console.log(index)
                                                console.log(playlist)
                                                if(indexOfSortedObj === index){
                                                    // for (const i in query) 마지막 반복일때
                                                    // const shuffledPlaylist = [...playlist].sort(()=>Math.random() - 0.5);
                                                    // console.log(playlist);
                                                    // console.log('############# shuffledPlaylist #############')
                                                    // console.log(shuffledPlaylist)
                                                    // console.log('############# shuffledPlaylist #############')
    
                                                    // console.log(playlist);
                                                    const updatePreferPlaylistQuery = `update prefer_playlist set music_list = '[${playlist}]' where character_id = '${req.body.characterId}'`;
                                                    // console.log(updatePreferPlaylistQuery);
                                                    conn.query(updatePreferPlaylistQuery, (err, result, fields)=>{
                                                        if(err){
                                                            console.log(err);
                                                        }else{
                                                            // console.log(result);
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                                
            
                                // #################### ALGORITHM of prefer with artist ###################
                                // ########################################################################
                                let selectWithOnlyArtist = `select music_id from music inner join artist on music.artist_id = artist.artist_id where`;
                                selectedArtist.forEach((data, index)=>{
                                    if(selectedArtist.length - 1 === index){
                                        selectWithOnlyArtist += ` artist_name like '${data.artist_name}' order by hit desc limit ${playlistMax}`;
                                    }else{
                                        selectWithOnlyArtist += ` artist_name like '${data.artist_name}' or`;
                                    }
                                });
                                // console.log(selectWithOnlyArtist);
                            }
                        });
                    }
                });
                
            }
        }
    });
    res.send('1');
})

router.post('/getPrefer', (req,res)=>{
    const sendData = {
        coverImage: '',
        description:'',
        music_list: []
    }
    // let arr = [];
    // console.log("character ID");
    // console.log(req.body.characterId);
    const getPreferMusicIdQuery =`select music_list from prefer_playlist where character_id = '${req.body.characterId}'`;
    conn.query(getPreferMusicIdQuery, (err,result,f)=>{
        if(err){
            console.log(err);
        }else{
            const arr = result[0].music_list;
            // console.log(arr);
            if(arr.length === 0){   
                // 선호 취향이 빈 배열
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
                console.log(getmusicDataQuery)
                conn.query(getmusicDataQuery, (error,result,fields)=>{
                    if(error){
                        console.log(error);
                    }else{
                        // console.log(r)
                        const shuffledList = [...result].sort(()=>Math.random() - 0.5);
                        sendData.music_list = shuffledList;
                        sendData.coverImage = shuffledList[0].org_cover_image;
                        sendData.description = '좋아할만한 아티스트 MIX';
                        // console.log(sendData)
                        return res.send(sendData);
                    }
                });
            }
            // res.send('1')
        }
    })
});

router.post('/getBannerImage', (req,res)=>{
    // console.log('###############')
    // // console.log(req.body);
    // console.log('###############')  
    const getPreferMusicDataQuery = `select prefer_artist from characters where character_id = '${req.body.characterId}'`;
    conn.query(getPreferMusicDataQuery, (error, artist, fields)=>{
        if(error){
            console.error(error);
        }else{
            // console.log(artist);
            if(artist.length === 0 ){
                res.json(-1);
            }else{
                if(artist[0].prefer_artist !== null){
                    if(artist[0].prefer_artist.length === 0){
                        // prefer_playlist 에도 데이터 없음
                    }else if(artist[0].prefer_artist.length >= 3){
                        // 3개 이상일땐 아티스트 이미지 보여주고
                        const artistArray = artist[0].prefer_artist;
                        const getArtistImageQuery = `select org_artist_image from artist where artist_id = '${artistArray[0]}' or artist_id = '${artistArray[1]}' or artist_id = '${artistArray[2]}'`;
                        conn.query(getArtistImageQuery, (error, result, fields)=>{
                            if(error){
                                console.log(error)
                            }else{
                                // console.log(result);
                                let sendData = [];
                                result.forEach((data) => {
                                    sendData.push(data.org_artist_image);
                                });
                                return res.send(sendData);
                            }
                        })
                    }else{
                        // 0~3 사이일땐 어쩔수없이 추천 플레이리스트 중 가수 골라서 이미지 보여줌
                        const preferMusicQuery = `select * from prefer_playlist where character_id = '${req.body.characterId}'`;
                        conn.query(preferMusicQuery, (error, music, fields)=>{
                            if(error){
                                console.error(error)
                            }else{
                                // console.log(music[0].music.length);
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
                                    const bannerImageArr = generateImage(music[0].music_list);
                                    // console.log(bannerImageArr)
                                    
                                    const getBannerImageUrlQuery = `select artist.artist_name from music inner join artist on artist.artist_id = music.artist_id 
                                    where (music.music_id = '${bannerImageArr[0]}') or (music.music_id = '${bannerImageArr[1]}') or (music.music_id = '${bannerImageArr[2]}')`;
                                    conn.query(getBannerImageUrlQuery, (error, imageUrl, fields)=>{
                                        if(error){
                                            console.error(error);
                                        }else{
                                            // console.log(imageUrl);
                                            let sendData = [];
                                            imageUrl.forEach((data, index) => {
                                                conn.query(`select org_artist_image as img from artist where artist_name = '${data.artist_name}'`,(error,result,fields)=>{
                                                    if(error){
                                                        console.error(error);
                                                    }else{
                                                        // console.log(result);
                                                        sendData.push(result[0]?.img);
                                                        // console.log(sendData);
                                                        // console.log(index)
                                                        if(index === 2){
                                                            // console.log(sendData)
                                                            res.send(sendData);
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    })
                                }
                                
                                
                                
                            }
                        });
                    }
                }
                else{
                    res.json(-1);
                }
            }
        }
    });
})

router.post('/confirmPassword', (req,res)=>{
    const getPasswordQuery = `select password from member where user_id = '${req.body.id}'`;
    conn.query(getPasswordQuery, async(error, hashedPassword, fields)=>{
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
    const insertNewPasswordQuery = `update member set password = '${encryptedPassword}' where user_id = '${req.body.id}'`;
    conn.query(insertNewPasswordQuery, (error, result, fields)=>{
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
    // console.log('myinfo/phone');
    // console.log(req.body.id);
    const SelectUserPhone = `select phone from member where ?`;
    conn.query(SelectUserPhone, [{user_id: req.body.id}], (err, row) =>{
        // console.log(row);
        res.send(row);
    })
});

router.post('/changePhone', async(req,res)=>{
    // console.log('changePhone');
    // console.log(req.body);
    const SelectUserPhone = `select phone from member`;
    conn.query(SelectUserPhone, (err, row) =>{
        // console.log(row);
        for(i = 0; i < row.length; i++){
            if(req.body.newPhone === row[i].phone){
                res.json(1);
                return;
            }
        }
        const UpdateUserPhone = `update member set ? where ?`;
        conn.query(UpdateUserPhone, [{phone: req.body.newPhone}, {user_id: req.body.id}], (err, row) =>{
            // console.log(row);
            res.send(row);
        })
    })
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
        // console.log('$$$$$$$$$$$ formattedData $$$$$$$$$$$')
        // console.log(formattedDate)
        // console.log('$$$$$$$$$$$ formattedData $$$$$$$$$$$')
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
    const getVoucherInfoQuery = `select a.user_id, a.name, a.purchase, b.purchase_date, b.renewal_date, b.plan_type, b.remaining_number from member a right join voucher b on a.user_id = b.user_id where a.user_id = '${req.body.id}'`;
    conn.query(getVoucherInfoQuery, (error, userVoucher, fields)=>{
        if(error){
            console.log(error);
        }else{
            // console.log('************** userVoucher **************');
            // console.log(userVoucher);
            if(userVoucher.length === 0){
                res.send({purchase: false});
            }else{
                userVoucher[0].purchase_date = dateTimeFormmater(userVoucher[0].purchase_date, 'addZero');
                userVoucher[0].renewal_date = dateTimeFormmater(userVoucher[0].renewal_date, 'addZero');
                // console.log('$$$$$$$$$$$ userVoucher $$$$$$$$$$$')
                // console.log(userVoucher[0])
                // console.log('$$$$$$$$$$$ userVoucher $$$$$$$$$$$')
                res.send(userVoucher[0]);
            }
        }
    })
});

router.post('/getStandbyVoucher', (req,res)=>{
    let standbyVoucherData = {};
    const getStandbyVoucherQuery = `select * from standby_voucher where user_id = '${req.body.id}'`;
    conn.query(getStandbyVoucherQuery, (error, standbyVoucher, fields)=>{
        if(error){console.log(error)}
        else{
            // console.log('************** standbyVoucher **************');
            // console.log(standbyVoucher);
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
    // console.log(req.body);
    const getExpiredVoucherQuery = `SELECT * FROM expired_voucher WHERE user_id = '${req.body.id}' order by purchase_date desc`;
    conn.query(getExpiredVoucherQuery, (error, expiredVoucher, fields)=>{
        if(error){
            console.log(error);
            res.send({exist: false, message: error.message});
        }
        else{
            // console.log('************** expiredVoucher **************');
            // console.log(expiredVoucher);
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
        id: req.body.id,
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
    const updateMemberPurchaseQuery = `update member set purchase = 1 where user_id ='${req.body.id}'`;
    let updateVoucherInformationQuery = `insert into ${req.body.database} (user_id, purchase_date, renewal_date, plan_type, remaining_number) values ('${purchaseData.id}', '${purchaseData.purchaseDate}', '${purchaseData.renewalDate}', '${purchaseData.planType}', ${purchaseData.remainingNumber})`;
    if(purchaseData.remainingNumber == null){
        updateVoucherInformationQuery = `insert into ${req.body.database} (user_id, purchase_date, renewal_date, plan_type, remaining_number) values ('${purchaseData.id}', '${purchaseData.purchaseDate}', '${purchaseData.renewalDate}', '${purchaseData.planType}', null)`;
    }
    // console.log(updateVoucherInformationQuery);
    
    conn.query(updateMemberPurchaseQuery, (error, result, fields)=>{
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
                    console.log('success');
                    res.send({success: true});
                }
            })
        }
    })
    
})

router.post('/checkCurrentVoucher', (req,res)=>{
    const checkCurrentVoucherQuery = `select * from member a right join voucher b on a.user_id = b.user_id where a.user_id = '${req.body.id}'`;
    conn.query(checkCurrentVoucherQuery, (error, result, fields)=>{
        if(error){console.log(error)}
        else{
            if(result.length === 1){ // 현재 이용권 존재 => 사용대기 이용권 있는지도 확인해서 보내주자
                const checkStandbyVoucherQuery = `select user_id from standby_voucher where user_id = '${req.body.id}'`;
                conn.query(checkStandbyVoucherQuery, (error, standbyVoucher, fields)=>{
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
    const dataFromClient = {
        sessionID: req.body.token
    };
    console.log(`user session: ${dataFromClient.sessionID}`);
    const removeSessionQuery = `DELETE FROM sessions WHERE session_id = '${dataFromClient.sessionID}' `;
    conn.query(removeSessionQuery, (error, rs, fields)=>{
        if(error){
            console.log(error);
            res.send({logoutSuccess: false});
        }else{
            res.send({logoutSuccess: true});
        }
    })
});

router.post('/withdraw', (req,res)=>{
    const withdrawQuery = `delete from member where user_id = '${req.body.id}'`;
    conn.query(withdrawQuery, (error, result, fields)=>{
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