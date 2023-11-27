const express = require("express");
const conn = require("../config/mysql");
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/check', (req,res)=>{
    // client app.js -> line 36
    res.send('1');
})

router.post('/info', (req,res)=>{
    const userInfoQuery = `SELECT * FROM member A RIGHT JOIN voucher B ON A.user_id = B.user_id WHERE a.user_id = '${req.body.id}'`;
    conn.query(userInfoQuery, (error, selectResult, fields)=>{
        if(error){
            console.log(error);
        }else{
            if(selectResult.length === 0){
                const noVoucherQuery = `select name, email, purchase from member where user_id = '${req.body.id}'`;
                conn.query(noVoucherQuery, (error, result, fields)=>{
                    if(error){
                        console.log(error);
                    }else{
                        console.log("**************************************");
                        console.log(req.body.id);
                        console.log(result);
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

    const findInvalidSessionQuery = `select * from sessions where session_id = '${sessionid}' or data like '%${clientsid}%'`;
    conn.query(findInvalidSessionQuery, (error,invalidSessions,fields)=>{
        if(error){
            console.log(error);
        }else{
            if(invalidSessions){
                invalidSessions.forEach((data)=>{
                    const deleteInvalidSessionsQuery = `delete from sessions where session_id = '${data.session_id}'`;
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
            if(result[0]){
                let info = JSON.parse(result[0].data);
                data.id = info.passport.user;
                res.send(data);
            }else{
                data.valid = false;
                res.send(data);
            }
        }
    });
});

router.post('/confirmPassword', (req,res)=>{
    console.log(req.body);
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
})

/**
 * @param {string} rawDate : convert to proper format for mysql insert query
 * @return {string}
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
    const getVoucherInfoQuery = `select a.user_id, a.name, a.purchase, date_format(b.purchase_date, '%Y-%m-%d %H:%i') as purchase_date, b.renewal_date, b.plan_type, b.remaining_number from member a right join voucher b on a.user_id = b.user_id where a.user_id = '${req.body.id}'`;
    conn.query(getVoucherInfoQuery, (error, userVoucher, fields)=>{
        if(error){
            console.log(error);
        }else{
            if(userVoucher.length === 0){
                res.send({purchase: false});
            }else{
                userVoucher[0].purchase_date = dateTimeFormmater(userVoucher[0].purchase_date);
                userVoucher[0].renewal_date = dateTimeFormmater(userVoucher[0].renewal_date);
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
            if(standbyVoucher.length === 1){
                standbyVoucher[0].purchase = true;
                standbyVoucher[0].purchase_date = dateTimeFormmater(standbyVoucher[0].purchase_date);
                standbyVoucher[0].renewal_date = dateTimeFormmater(standbyVoucher[0].renewal_date);
                standbyVoucherData = standbyVoucher[0];
            }else{
                standbyVoucherData.purchase = false;
            }
            res.send(standbyVoucherData);
        }
    })
})

router.post('/getExpiredVoucher', (req, res)=>{
    console.log(req.body);
    const getExpiredVoucherQuery = `SELECT * FROM expired_voucher WHERE user_id = '${req.body.id}' order by purchase_date desc`;
    conn.query(getExpiredVoucherQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
            res.send({exist: false, message: error.message});
        }
        else{
            result.forEach((data)=>{
                data.purchase_date = dateTimeFormmater(data.purchase_date, 'addZero');
                data.renewal_date = dateTimeFormmater(data.renewal_date, 'addZero');
            })
            res.send(result);
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
})

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
    console.log('2')
    const withdrawQuery = `delete from member where user_id = '${req.body.id}'`;
    conn.query(withdrawQuery, (error, result, fields)=>{
        if(error){
            console.log(error);
        }else{
            console.log(result);
            conn.query(`delete from sessions where session_id = "${req.body.token}"`, (error,result,fields)=>{
                if(error){console.log(error)}
                else{}
            });
            res.send({status: 200, withdraw: true});
        }
    });
});


module.exports = router;