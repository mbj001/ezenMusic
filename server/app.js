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

const express= require("express");
const path = require("path");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MySQLStore = require('express-mysql-session');
const fs = require("fs-extra");

const MainRouter = require("./routes/main");
const AlbumRouter = require("./routes/album");
const ArtistRouter = require("./routes/artist");
const ClientRouter = require("./routes/client");
const LikeyRouter = require("./routes/likey");
const MusicRouter = require("./routes/music");
const PlaylistRouter = require("./routes/playlist");

const passportConfig = require("./passport");

try{
    console.log("image/tmp Folder OPEN !!");
    fs.readdirSync("./image/tmp");
}
catch{
    console.log("image/tmp Folder Create !!");
    fs.mkdirSync("./image/tmp");
}


const MySQLStoreSession = MySQLStore(session);
const options ={ // 로그인 세션 유지하는데 사용할 db option => flodb > sessions 스키마 생성 후 저장됨
    host: '127.0.0.1',
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
};
const sessionStore = new MySQLStoreSession(options);




dotenv.config();
const app = express();

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
    store: sessionStore,
    cookie:{
        maxAge: (3.6e+6) * process.env.COOKIE_MAXAGE, // COOKIE_MAXAGE 시간동안 유효
        httpOnly: true,
        secure: false // https ? true : false
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use("/", MainRouter);
app.use("/album", AlbumRouter);
app.use("/artist", ArtistRouter);
app.use("/client", ClientRouter);
app.use("/likey", LikeyRouter);
app.use("/music", MusicRouter);
app.use("/playlist", PlaylistRouter);

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