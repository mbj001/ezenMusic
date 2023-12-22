import Axios from "axios";
import { Cookies } from "react-cookie";
export function playerAdd(page, id, handleRender, setPlayerBannerOn){

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");

    if(page === "mainbanner_theme" || page === "theme")
    {
        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "mainbanner_theme",
            themeplaylist_id: id,
            change_now_play: true
        })
        .then(({data}) => {
            handleRender();
            setPlayerBannerOn(true);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    if(page === "mainbanner_album")
    {
        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "mainbanner_album",
            album_id: id,
            change_now_play: true
        })
        .then(({data}) => {
            handleRender();
            setPlayerBannerOn(true);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    if(page === "search_artist" || page === "like_artist")
    {
        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "search_artist",
            artist_id: id,
            change_now_play: true
        })
        .then(({data}) => {
            handleRender();
            setPlayerBannerOn(true);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    if(page === "mainbanner_prefer_playlist"){
        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "mainbanner_prefer_playlist",
            change_now_play: true
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })

    }
}

export function playerAddGenre(page, area, genre, handleRender, setPlayerBannerOn){

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    // page : mainbanner_genre
    Axios.post("/playerHandle/playerAdd", {
        character_id: userid_cookies,
        page: page,
        area: area,
        genre: genre,
        change_now_play: true
    })
    .then(({data}) => {
        handleRender();
        setPlayerBannerOn(true);
    })
    .catch((err) => {
        console.log(err);
    })

    
}