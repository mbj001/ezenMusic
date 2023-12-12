const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

router.post('/initializeSessions',(req, res)=>{
    const selectAllSessionsQuery = `select * from sessions`;
    conn.query(selectAllSessionsQuery, (error,selectAllSessionsResult, fields)=>{
        if(error){
            console.log(error);
        }else{
            selectAllSessionsResult.forEach((session)=>{
                const sessionData = JSON.parse(session.data);
                const now = new Date();
                const sessionExpireDate = new Date(sessionData.cookie.expires);
                if(sessionExpireDate - now <= 0){
                    // 만료된 세션 존재 -> 삭제
                    const deleteExpiredSessionQuery = `delete from sessions where session_id = '${session.session_id}'`;
                    conn.query(deleteExpiredSessionQuery, (error,rs,fields)=>{
                        if(error){
                            console.log(error);
                        }else{
                            console.log('initializeSessions');
                            console.log(`${session.session_id} has been deleted!`);
                        }
                    });
                }else{
                    // 만료된 세션 없음
                }
            });
        }
    });
    res.send('removed all expired sessions !!');
});

router.post('/resister', async(req,res)=>{
    const originBirth = req.body.birth;
    const resisterNumber = req.body.resisterNumber;
    let formattedBirth;
    if((resisterNumber === '3' || resisterNumber === '4')){
        formattedBirth = '20'+ originBirth.slice(0,2) + '-' + originBirth.slice(2,4) + '-' + originBirth.slice(4);
    }else{
        formattedBirth = '19'+ originBirth.slice(0,2) + '-' + originBirth.slice(2,4) + '-' + originBirth.slice(4);
    }
    // const encryptedPassword = await bcrypt.hash(req.body.password, process.env.SALT_ROUNDS);
    let encryptedPassword; 
    const hashPassword = async (password) => {
        return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
    };
    await hashPassword(req.body.password).then((hashedData)=>{
        encryptedPassword = hashedData;
    });
    const resisterData = {
        id: req.body.id,
        name: req.body.name,
        password: encryptedPassword,
        birth: formattedBirth,
        email: req.body.email+'@'+req.body.emailUrl,
        phone: req.body.phone
    };
    // const doesMatch = await bcrypt.compare(planPassword, resisterData.password);
    // console.log(doesMatch)

    const resisterQuery = `insert into member (user_id, name, password, birth, email, phone, purchase) values ('${resisterData.id}','${resisterData.name}','${resisterData.password}','${resisterData.birth}','${resisterData.email}','${resisterData.phone}', false)`;
    conn.query(resisterQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
            res.send({status: 500, resisterComplete: false, message: error.message});
        }else{
            console.log(result);
            const createDefaultCharacterQuery = `insert into characters (character_id, user_id, character_num, character_name, profile_image, prefer_artist, prefer_genre, prefer_chart) values ('${req.body.id}#ch01', '${req.body.id}', 1, '캐릭터1', 'character01.png', null, null, null)`;
            conn.query(createDefaultCharacterQuery, (error, result, fields)=>{
                if(error){
                    console.log(error);
                }else{
                    const createDefaultPreferPlaylistQuery = `insert into prefer_playlist (character_id, music_list ) values ('${req.body.id}#ch01','[]')`;
                    conn.query(createDefaultPreferPlaylistQuery, (error, result, fields)=>{
                        if(error){
                            console.log(error);
                        }else{
                            console.log(result);
                            res.send({status: 200, resisterComplete: true});
                        }
                    });
                }
            })
        }
    });
})

router.post('/check_duplication',(req,res)=>{
    const isExist = {
        useable: false
    }
    const checkDuplicateQuery = `select user_id from member where user_id = '${req.body.id}'`;
    conn.query(checkDuplicateQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            // if(result.length){
            //     isExist.useable = false;
            // }else{
            //     isExist.useable = true;
            // }
            result.length ? isExist.useable = false : isExist.useable = true;
            res.send(isExist);
        }
    })
})

module.exports = router;