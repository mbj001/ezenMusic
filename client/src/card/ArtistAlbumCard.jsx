import React, {useState, useContext} from 'react'
import styled from 'styled-components'; 
import { Link } from 'react-router-dom';
import Axios from 'axios'
import { Cookies } from 'react-cookie';
import LikeyBanner from '../card/LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import PlayerBanner from '../card/PlayerBanner';
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import {FiChevronRight} from 'react-icons/fi'
import { AppContext } from '../App'

// 승렬
import { ArtistAlbumAddPlaylistButton as AddPlaylistButton } from '../style/StyledIcons';
import { ArtistAlbumAddMylistButton as AddMylistButton} from '../style/StyledIcons';
import { ArtistAlbumLikeButton as LikeButton } from '../style/StyledIcons';
import { ArtistAlbumFilledHeartButton as FilledHeart } from '../style/StyledIcons';
import { TransTinyPlayButton as PlayButton } from '../style/StyledIcons';


const ArtistAlbumCard = ({artistAlbum, setArtistAlbum, handleRender}) => {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));
    // 좋아요 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

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
    
    function addLikeAlbum(index, album_id){

        Axios.post("/ezenmusic/addlikey", {
            character_id: userid_cookies,
            id: album_id,
            division: "likealbum"
        })
        .then(({data}) => {
            setLikeyBannerOn(1);
            let array = [];
            for(let i=0; i<artistAlbum.length; i++){
                // console.log("addlikey")
                array.push(artistAlbum[i]);
                if(i === index){
                    array[i].likey = true;
                }
            }
            setArtistAlbum(array);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeAlbum(index, album_id){

        Axios.post("/ezenmusic/dellikey", {
            character_id: userid_cookies,
            id: album_id,
            division: "likealbum"
        })
        .then(({data}) => {
            setLikeyBannerOn(-1);
            let array = [];
            for(let i=0; i<artistAlbum.length; i++){
                // console.log("dellikey");
                array.push(artistAlbum[i]);
                if(i === index){
                    array[i].likey = false;
                }
            }
            setArtistAlbum(array);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function playerAdd(album_id, change_now_play){

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "albumtrack",
            album_id: album_id,
            change_now_play: change_now_play
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

  return (
    <>
    { playlistModalOpen && <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
    {/* 플레이리스트 추가 베너 */}
    { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
    { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
    { likeyBannerOn !== 0 && <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"album"} /> }
    { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
    {  artistAlbum.map((item, index) => (
        <EachLiBox >
            <StyledTablediv className="d-flex w-[450px] items-center">
                <div className="album-cover-image relative">
                    <Link to={"/detail/album/" + item.album_id + "/albumtrack"}> 
                        <img src={"/image/album/" + item.org_cover_image} alt={item.org_cover_image} className="hover:brightness-75" />
                    </Link>
                    <PlayButton onClick={isSessionValid? () => playerAdd(item.album_id, true) : () => setLoginrRequestVal(true)} > </PlayButton>
                </div>
                <div className="album-info">
                    <p className="album-title">
                        <Link to={"/detail/album/" + item.album_id + "/albumtrack"}>
                            {item.album_title}
                        </Link>
                    </p>
                    <div className="album-artist">
                        <Link to={"/detail/artist/"+item.artist_id+"/track?sortType=POPULARITY"}>
                            <p className='artist-name'>
                                {item.artist_name}
                            </p>
                            <span className="right-icon"><FiChevronRight /></span>
                        </Link>
                    </div>

                    <div className="album-size">
                        <p>{item.album_size}</p>
                    </div>

                    <div className='album-release'>
                        <p>{`${item.release_date_format}`}</p>
                    </div>   
                    <div className="album-icon-box">
                        <AddPlaylistButton onClick={isSessionValid? () => playerAdd(item.album_id, false) : () => setLoginrRequestVal(true)}></AddPlaylistButton>
                        <AddMylistButton onClick={isSessionValid? (e) => clickPlaylistModalOpen(e, item.album_id, item.org_cover_image) : () => setLoginrRequestVal(true)} ></AddMylistButton>
                        {
                            item.likey === true?
                            <FilledHeart onClick={isSessionValid? () => delLikeAlbum(index, item.album_id) : () => setLoginrRequestVal(true)}></FilledHeart>
                            :
                            <LikeButton onClick={isSessionValid? () => addLikeAlbum(index, item.album_id) : () => setLoginrRequestVal(true)}></LikeButton>
                        }    
                    </div>
                </div> 
            </StyledTablediv>
        </EachLiBox>
    ))}
    </>
  )
}

// 승렬
const EachLiBox = styled.li`
    margin: 20px 0;

    div{
        .album-cover-image{
            width: 175px;
            heigth: 175px;
            border-radius: 6px;
            overflow: hidden;
            a{
                width: 100%;
                height: 100%;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .album-info{
            width: 220px;
            height: 175px;
            padding-left: 20px;
            .album-title{
                width: 100%;
                a{
                    
                }
                font-size: 15px;
                font-weight: 700;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                margin-top: 10px;
                &:hover{
                    color: var(--main-theme-color);
                }
            }
            .album-artist{
                a{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: start;
                    margin-bottom: 15px;
                    .artist-name{
                        max-width: 189px;
                        font-size: 14px;
                        font-weight: 400;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: inline-block;
                    }
                    .right-icon{
                        width: 13px;
                        height: 13px;
                        margin-top: 2px;
                        svg{
                            width: 100%;
                            height: 100%;
                            display: block;
                            margin-left: -2px;
                            margin-top: 1px;
                        }
                    }
                }
            }
            .album-size{
                margin-bottom: 5px;
                p{
                    color: #333;
                    font-size: 13px;
                    font-weight: 400;   
                }
            }
            .album-release{
                p{
                    color: #969696;
                    font-size: 13px;
                    font-weight: 400;
                }
            }
            .album-icon-box{
                display: flex;
                flex-direction: row;
                margin-top: 20px;
                button{
                    margin-left: -3px;
                    margin-right: 14px;
                }
            }
        }
    }
    .active{
        font-size: 14px;
        color: var(--main-theme-color);
    }

    .not-active{
        font-size: 14px;
    }
`;

export const StyledTablediv = styled.div`
    vertical-align: middle;
    p>a{
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

`

export default ArtistAlbumCard