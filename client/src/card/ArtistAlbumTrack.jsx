import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import Axios from 'axios';
import { getCookie } from '../config/cookie';
import { userid_cookies } from '../config/cookie';
import LikeyBanner from './LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import PlayerBanner from '../card/PlayerBanner';
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import icons from '../assets/sp_button.6d54b524.png'
import {FiChevronRight} from 'react-icons/fi'

function ArtistAlbumTrack({lank, title, album_title, artist_name, artist_id, img, music_id, album_size, artist_class ,artist_gender, id, album_id, album_release_date, handleRender}) {
    
    const [islikey, setIslikey] = useState(false);
    // 좋아요 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    let array = [];

    
    //////////// 건우 ////////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, album_id, img) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: null,
            album_id: album_id,
            thumbnail_image: img,
            theme_playlist: null
        });
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////


    function HandleLikey(){
        
        setIslikey(islikey => {return !islikey})
    }

    function addLikeAlbum(){

        Axios.post("/ezenmusic/addlikey", {
            character_id: userid_cookies,
            id: album_id,
            division: "likealbum"
        })
        .then(({data}) => {
            HandleLikey();
            setLikeyBannerOn(1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeAlbum(){

        Axios.post("/ezenmusic/dellikey", {
            character_id: userid_cookies,
            id: album_id,
            division: "likealbum"
        })
        .then(({data}) => {
            HandleLikey();
            setLikeyBannerOn(-1);
        })
        .catch((err) => {
            console.log(err);
        })
    }


    // 2023-12-01 album 플레이어 추가
    function playerAdd(){

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "albumtrack",
            album_id: album_id
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }


    useEffect(() => {
        if(userid_cookies !== undefined){
            Axios.post("/ezenmusic/detail/album_theme/likey", {
                character_id: userid_cookies,
                division: "likealbum"
            })
            .then(({data}) => {
                array = data;
                for(let i=0; i<array.length; i++){
                    if(array[i] === Number(album_id)){
                        setIslikey(!islikey);
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }, [])
        

    return (    
    <>
    {/* modal */}
    { playlistModalOpen && <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
    {/* 플레이리스트 추가 베너 */}
    { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
    { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
    { likeyBannerOn !== 0 && <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"album"} /> }
    { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
    {/* ~ modal */}

    <li className="artist_Album_li">
        <StyledTablediv className="d-flex w-[412px] items-center">
            <div className="thumbnail w-[175px] h-[175px]">
                <Link to={"/detail/album/" + album_id + "/albumtrack"}><img src={"/image/album/" + img} alt="img02" className="w-[175px] h-[175px] rounded-[5px] text-bold" /></Link>
                    <button className="libutton absolute" style={{ backgroundImage: `url(${icons})` }}></button>
                    </div>
            <div className="ml-5 w-[204px]">
                <p className="text-sm font-bold text-truncate"><Link to={"/detail/album/" + album_id + "/albumtrack"}>{album_title}</Link></p>
                    <StyledTablediv className="mb-2"><p className="text-xs flex"><Link to={"/detail/artist/" + artist_id + "/artisttrack"}>{`${artist_name}`}</Link><span className="py-1"><FiChevronRight /></span></p></StyledTablediv>
                    <StyledTablediv><p className="mb-1 font-normal text-xs text-gray-900">{album_size}</p></StyledTablediv>
                    <StyledTablediv><p className="font-normal text-xs text-gray-400">{`${album_release_date}`}</p></StyledTablediv>   
                    <div className="d-flex mt-[30px] ml-[-2px]">
                        <button className="iconslistplus ml-0 mr-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? playerAdd : setLoginrRequestVal}></button>
                        <button className="iconsbox ml-2 mr-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? (e) => clickPlaylistModalOpen(e, album_id, img) : setLoginrRequestVal} ></button>
                        {
                            userid_cookies?
                            <>
                            {
                                islikey?
                                <button className="redheart2 ml-2" style={{backgroundImage:`url(${icons})`}} onClick={delLikeAlbum}></button>
                                :
                                <button className="iconsheart2 ml-2" style={{backgroundImage:`url(${icons})`}} onClick={addLikeAlbum}></button>
                            }    
                            </>
                            :
                            <button className="iconsheart2 ml-2" style={{backgroundImage:`url(${icons})`}} onClick={() => setLoginrRequestVal(true)}></button>
                        }
                    </div>
            </div> 
        </StyledTablediv>
    </li>
    </>
    )
}

export const StyledTablediv = styled.div`
    vertical-align: middle;

   a:hover{
    color:blue;
   }

   p>a{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

   }

    // p{
    //     font-weight: 400;
    // }     
`

export const StyledTableli = styled.div`
    font-size: 20px;
    vertical-align: middle;

   a:hover{
       color: var(--main-theme-color);
    }
   p>a{
       display: block;
       overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

   }

    // p{
    //     font-weight: 400;
    // }     
`

const StyledMusicMenu = styled.div`
    position: absolute;
    box-shadow: 0 0 30px 5px #efefef;
    width: 200px;
    left: -150px;
    top: 60px;
    background-color: white;
    z-index: 100;

    ul>li:first-child{
        padding-left: 15px;
        padding-top: 15px;
        padding-bottom: 8px;
    }

    li{
        padding-left: 15px;
        padding-top: 8px;
        padding-bottom: 8px;
    }

    ul>li:last-child{
        padding-left: 15px;
        padding-top: 8px;
        padding-bottom: 15px;
    }

    ul>*{
        font-size: 14px;
        color: var(--main-text-gray);
    }

    li p{
        margin-left: 10px;
    }

    li:hover{
        color: var(--main-theme-color);
    }
`

export default ArtistAlbumTrack