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
const schedule = require('node-schedule');

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

const passportConfig = require("./passport");
const conn = require("./config/mysql");
const { isLoggedIn, isNotLoggedIn} = require("./middleWares/index");
const { verify } = require('./middleWares/verifyClient');

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 8081);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true
});

app.use(cors());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/image", express.static(path.join(__dirname, "image")));
//app.use(express.static(path.join(__dirname, '../client/build')))
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    store: new MySQLStoreSession({
        host: '127.0.0.1',
        port: 3306,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB
    }),
    cookie:{
        maxAge: (3.6e+6) * process.env.COOKIE_MAXAGE,
        httpOnly: false,
        secure: false
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();




app.use("/", MainRouter);
app.use("/album", isLoggedIn, AlbumRouter);
app.use("/artist", isLoggedIn, ArtistRouter);
app.use("/client", isLoggedIn, ClientRouter);
app.use("/likey", isLoggedIn, LikeyRouter);
app.use("/music", isLoggedIn, MusicRouter);
app.use("/playlist", PlaylistRouter);
app.use("/themeplaylist", isLoggedIn, ThemeplaylistRouter);

app.use("/ezenmusic", EzenmusicRouter);
app.use("/guest", GuestRouter);
app.use('/verifiedClient', verify, VerifiedRouter);
app.use("/playerHandle", PlayerHandleRouter);


try{
    console.log("image/tmp Folder OPEN !!");
    fs.readdirSync("./image/tmp");
}catch{
    console.log("image/tmp Folder Create !!");
    fs.mkdirSync("./image/tmp");
}

// Client React
// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
//   });

// app.get('*', function (req, res) {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
// ~ Client React


// scheduler
const AutoCheckExpiredData = schedule.scheduleJob('0 * * * * *', function() {
    try{
        conn.query('SELECT * FROM sessions', (error, selectAllSessionsResult, fields)=>{
            if(error){
                console.log(error);
            }else{
                selectAllSessionsResult.forEach((session)=>{
                    const sessionData = JSON.parse(session.data);
                    const now = new Date();
                    const sessionExpireDate = new Date(sessionData.cookie.expires);
                    if(sessionExpireDate - now <= 0){
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
                        // no expired sessions
                    }
                });
            }
        });

        const findExpiredVoucherQuery = `SELECT user_id FROM voucher WHERE renewal_date - now() < 0`;
        conn.query(findExpiredVoucherQuery, (error, expiredVoucher, fields)=>{
            if(error){console.log(error)}
            else{
                if(expiredVoucher.length >= 1){
                    expiredVoucher.forEach((data)=>{
                        //loop
                        const relocateExpiredVoucherQuery = `INSERT INTO expired_voucher (user_id, purchase_date, renewal_date, plan_type, remaining_number) (SELECT * FROM voucher WHERE user_id = ?)`;
                        conn.query(relocateExpiredVoucherQuery, [data.user_id], (error, result, fields)=>{
                            if(error){console.log(error)}
                            else{
                                const removeVoucherQuery = `DELETE FROM voucher WHERE user_id = ?`;
                                conn.query(removeVoucherQuery, [data.user_id], (error, result, fields)=>{
                                    if(error){console.log(error)}
                                    else{
                                        const checkStandbyVoucherQuery = `SELECT EXISTS (SELECT * FROM standby_voucher WHERE user_id = ?) AS isExist`;

                                        conn.query(checkStandbyVoucherQuery, [data.user_id], (error, isExist, fields)=>{
                                            if(error){console.log(error)}
                                            else{
                                                if(isExist[0].isExist){
                                                    const relocateStanbyVoucherQuery = `INSERT INTO voucher (user_id, purchase_date, renewal_date, plan_type, remaining_number) (SELECT * FROM standby_voucher WHERE user_id = ?)`;
                                                    conn.query(relocateStanbyVoucherQuery, [data.user_id], (error, result, fields)=>{
                                                        if(error){console.log(error)}
                                                        else{
                                                            console.log(`${data.user_id} 's standby_voucher data relocated to voucher !!`);
                                                            const removeStandbyVoucherQuery = `DELETE FROM standby_voucher WHERE user_id = ?`;
                                                            conn.query(removeStandbyVoucherQuery, [data.user_id], (error, result, fields)=>{
                                                                if(error){console.log(error)}
                                                                else{
                                                                    console.log(`removed ${data.user_id} 's standbyVoucher data !!`);
                                                                }
                                                            })
                                                        }
                                                    });
                                                }else{
                                                    const resetMemberPurchaseQuery = `UPDATE member SET purchase = 0 WHERE user_id = ?`;
                                                    conn.query(resetMemberPurchaseQuery, [data.user_id], (error, result, fields)=>{
                                                        if(error){console.log(error)}
                                                        else{
                                                            console.log(`${data.user_id} 's purchase data updated : true -> false`);
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                });
                            }
                        });
                        //loop
                    });
                }else{
                    // no expired voucher
                    console.log('There is no expired voucher data in database !!');
                }
            }
        })
    }catch(error){
        console.log(error);
    }

});


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