const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const pool = require("../config/mysqlPool");

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
});

router.post('/find', (req,res)=>{
    console.log(req.body)
    const dataFromClient = {
        phoneData: req.body.phone,
        nameData: req.body.name
    }
    const sendDataToClient = {
        user_id: [],
        ticket_type: [],
        emptyData: true,
        databaseError: false,
        databaseErrorLog: ''
    }
    const findQuery = `select user_id from member where phone = '${dataFromClient.phoneData}' and name = '${dataFromClient.nameData}'`;
    // console.log(findQuery)
    conn.query(findQuery, async(error, findResult, fields)=>{
        if(error){
            console.log(error.message);
            sendDataToClient.databaseError = true;
            sendDataToClient.databaseErrorLog = error?.message;
            res.send(sendDataToClient);
        }else{
            console.log(findResult);
            if(findResult.length === 0){
                sendDataToClient.emptyData = true;
                return res.send(sendDataToClient);
            }else{
                // sendDataToClient.user_id = findResult;
                sendDataToClient.emptyData = false;
                findResult.forEach( async(data, index)=>{
                    sendDataToClient.user_id.push(data.user_id);
                    const getVoucherQuery = `select plan_type from voucher where user_id = '${data.user_id}'`;
                    const [ticket] = await pool.query(getVoucherQuery);
                    // console.log(ticket)
                    if(ticket.length === 0){
                        sendDataToClient.ticket_type.push('guest');
                    }else{
                        sendDataToClient.ticket_type.push(ticket[0].plan_type);
                        // console.log(sendDataToClient.ticket_type)
                    }
                    // console.log(index)
                    if(index === findResult.length -1){
                        console.log(sendDataToClient);
                        res.send(sendDataToClient);
                    }
                });
            }            
        }
    });
});

router.post('/validateBeforeChangePassword', (req,res)=>{
    const dataFromClient = {
        useridData: req.body.user_id,
        emailData: req.body.email,
        birthData: req.body.birth
    };
    const sendDataToClient = {
        valid: false,
        databaseError: false,
        databaseErrorLog: ''
    };
    // console.log(req.body)
    const validateQuery = `select exists (select user_id from member where user_id = '${dataFromClient.useridData}' and email = '${dataFromClient.emailData}' and birth = '${dataFromClient.birthData}') as Exist`;
    conn.query(validateQuery, (error, result, fields)=>{
        if(error){
            console.log(error.message);
            sendDataToClient.databaseError = true;
            sendDataToClient.databaseErrorLog = error?.message;
            return res.send(sendDataToClient);
        }else{
            console.log(result);
            // result[0]?.username ? sendDataToClient.valid = true : sendDataToClient.valid = false;
            if(result[0].Exist === 1){
                sendDataToClient.valid = true;
            }
            console.log(sendDataToClient);
            return res.send(sendDataToClient);
        }
    });
});

router.post('/changePassword', async(req,res)=>{
    console.log(req.body);
    const checkDuplicateQuery = `select password from member where user_id = '${req.body.user_id}'`;    
    conn.query(checkDuplicateQuery, async(error, password, fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(password)
            const haveUsed = await bcrypt.compare(req.body.newPassword, password[0].password);
            console.log(haveUsed)
            if(haveUsed){
                // console.log('사용한적 있음')
                return res.send({success: false, haveUsed: true});
            }else{
                // console.log('사용한적 없음')
                let encryptedPassword; 
                const hashPassword = async (password) => {
                    return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
                };
                await hashPassword(req.body.newPassword).then((hashedData)=>{
                    encryptedPassword = hashedData;
                });
                console.log(encryptedPassword)
                const insertNewPasswordQuery = `update member set password = '${encryptedPassword}' where user_id = '${req.body.user_id}'`;
                conn.query(insertNewPasswordQuery, (error, result, fields)=>{
                    if(error){
                        console.log(error);
                        res.send({status: 500, success: false});
                    }
                    else{
                        res.send({status: 200, success: true});
                    }
                });
            }
        }
    })
});

module.exports = router;