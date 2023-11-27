// npm install express
// npm install -D nodemon
// npm install nunjucks
// npm install dotenv
// npm install path
// npm install fs
// npm install multer
// npm install fs-extra
// npm install mysql2
// npm install multer
// npm install passport
// npm install cookie-parser
// npm install express-session
// npm install express-mysql-session
// npm install passport-local
// npm install node-schedule

const express= require("express");
const path = require("path");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MySQLStore = require('express-mysql-session');
const MySQLStoreSession = MySQLStore(session);
const fs = require("fs-extra");
const cors = require("cors");

const MainRouter = require("./routes/main");
const AlbumRouter = require("./routes/album");
const ArtistRouter = require("./routes/artist");
const ClientRouter = require("./routes/client");
const LikeyRouter = require("./routes/likey");
const MusicRouter = require("./routes/music");
const PlaylistRouter = require("./routes/playlist");
const ThemeplaylistRouter = require("./routes/themeplaylist")
const EzenmusicRouter = require("./routes/ezenmusic");
const GuestRouter = require('./routes/guest');
const VerifiedRouter = require('./routes/verifiedClient');
const PlayerHandleRouter = require("./routes/playerHandle");

const { isLoggedIn, isNotLoggedIn} = require("./middleWares/index");
const passportConfig = require("./passport");
const {verify} = require('./middleWares/verifyClient');
const schedule = require('node-schedule');
const conn = require("./config/mysql");



const AutoCheckExpiredData = schedule.scheduleJob('1 * * * * *', function() {
	// console.log("1분에 한번씩 실행");
    // 만료된 세션 존재하면 여기서 삭제

    // 기간 만료된 이용권은 expired_voucher 테이블로 이동하고 standby_voucher 테이블에 사용대기 이용권 존재하면 가져옴
    const findExpiredVoucherQuery = `SELECT user_id FROM voucher WHERE renewal_date - now() < 0`;
    conn.query(findExpiredVoucherQuery, (error, expiredVoucher, fields)=>{
        if(error){console.log(error)}
        else{
            if(expiredVoucher.length >= 1){
                //뽑아온 데이터가 존재할 경우
                expiredVoucher.forEach((data)=>{
                    //loop
                    // voucher -> expired_voucher 이동
                    const relocateExpiredVoucherQuery = `INSERT INTO expired_voucher (user_id, purchase_date, renewal_date, plan_type, remaining_number) (SELECT * FROM voucher WHERE user_id = '${data.id}')`;
                    conn.query(relocateExpiredVoucherQuery, (error, result, fields)=>{
                        if(error){console.log(error)}
                        else{
                            // expired_voucher 로 이동 성공 후 voucher의 기존 데이터 삭제
                            // 삭제후에 standby_voucher 에 데이터 있으면 voucher로 가져오고 없으면 그냥 삭제 + member purhcase = false
                            const removeVoucherQuery = `DELETE FROM voucher WHERE user_id = '${data.id}'`;
                            conn.query(removeVoucherQuery, (error, result, fields)=>{
                                if(error){console.log(error)}
                                else{
                                    const checkStandbyVoucherQuery = `SELECT EXISTS (SELECT * FROM standby_voucher WHERE user_id = '${data.id}') AS isExist`;
                                    conn.query(checkStandbyVoucherQuery, (error, isExist, fields)=>{
                                        if(error){console.log(error)}
                                        else{
                                            if(isExist[0].isExist){
                                                const relocateStanbyVoucherQuery = `INSERT INTO voucher (user_id, purchase_date, renewal_date, plan_type, remaining_number) (SELECT * FROM standby_voucher WHERE user_id = '${data.id}')`;
                                                conn.query(relocateStanbyVoucherQuery, (error, result, fields)=>{
                                                    if(error){console.log(error)}
                                                    else{
                                                        console.log(`${data.id} 's standby_voucher data relocated to voucher !!`);
                                                        const removeStandbyVoucherQuery = `DELETE FROM standby_voucher WHERE user_id = '${data.id}'`;
                                                        conn.query(removeStandbyVoucherQuery, (error, result, fields)=>{
                                                            if(error){console.log(error)}
                                                            else{
                                                                console.log(`removed ${data.id} 's standbyVoucher data !!`);
                                                            }
                                                        })
                                                    }
                                                });
                                            }else{
                                                const resetMemberPurchaseQuery = `UPDATE member SET purchase = 0 WHERE user_id = '${data.id}'`;
                                                conn.query(resetMemberPurchaseQuery, (error, result, fields)=>{
                                                    if(error){console.log(error)}
                                                    else{
                                                        console.log(`${data.id} 's purchase data updated : false`);
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                            });
                            
                            // conn.query(`delete from voucher WHERE id = '${data.id}'`, (error, result, fields)=>{
                            //     if(error){console.log(error)}
                            //     else{
                            //         console.log('Relocated expired voucher data !!');
                            //     }
                            // })
                        }
                    })
                })
            }else{
                //뽑아온 데이터 없음
                console.log('There is no expired voucher data in database !!');
            }
        }
    })
});



try{
    console.log("image/tmp Folder OPEN !!");
    fs.readdirSync("./image/tmp");
}
catch{
    console.log("image/tmp Folder Create !!");
    fs.mkdirSync("./image/tmp");
}


// const MySQLStoreSession = MySQLStore(session);
// const options ={ // 로그인 세션 유지하는데 사용할 db option => flodb > sessions 스키마 생성 후 저장됨
//     host: '127.0.0.1',
//     port: 3306,
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASS,
//     database: process.env.MYSQL_DB
// };
// const sessionStore = new MySQLStoreSession(options);




dotenv.config();
const app = express();
app.use(cors());

app.set("port", process.env.PORT || 8081);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true
})


app.use("/", express.static(path.join(__dirname, "public")));
app.use("/image", express.static(path.join(__dirname, "image")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//쿠키, 세션 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    store: new MySQLStoreSession({ // 로그인 세션 유지하는데 사용할 db option => flodb > sessions 스키마 생성 후 저장됨
        host: '127.0.0.1',
        port: 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB
    }),
    cookie:{
        maxAge: (3.6e+6) * process.env.COOKIE_MAXAGE, // COOKIE_MAXAGE 시간동안 유효
        httpOnly: false,
        secure: false // https ? true : false 
        //secure: true -> server에서 client 로 쿠키를 보내줄 수 없다
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use("/", MainRouter);
app.use("/album", isLoggedIn, AlbumRouter);
app.use("/artist", isLoggedIn, ArtistRouter);
app.use("/client", isLoggedIn, ClientRouter);
app.use("/likey", LikeyRouter);
// app.use("/likey", isLoggedIn, LikeyRouter);
app.use("/music", isLoggedIn, MusicRouter);
app.use("/playlist", PlaylistRouter);
// app.use("/playlist", isLoggedIn, PlaylistRouter);
app.use("/ezenmusic", EzenmusicRouter);
app.use("/themeplaylist", isLoggedIn, ThemeplaylistRouter);
app.use("/guest", GuestRouter);
app.use('/verifiedClient', verify, VerifiedRouter);
app.use("/playerHandle", PlayerHandleRouter);


// 에러처리
app.use((req, res, next) => {
    const error = new Error("에러입니다.");
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send('error');
})

app.listen(app.get("port"), () => {
    console.log(app.get("port") + " PORT OPEN !!");
})