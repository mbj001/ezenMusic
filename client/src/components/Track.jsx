import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';
import styled from 'styled-components';
import Details from './Details';
import Similar from './Similar';
import LikeyBanner from '../card/LikeyBanner';
import { Cookies } from 'react-cookie';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import PlayerBanner from '../card/PlayerBanner';
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import { AppContext } from '../App'

// 승렬
import { MusicListCardAddMyListButton as AddMyListButton } from '../style/StyledIcons';
import { MusicListCardAddPlaylistButton as AddPlaylistButton } from '../style/StyledIcons';
import { ArtistLikeButton as LikeButton } from '../style/StyledIcons';
import { ArtistFilledHeartButton as FilledHeart } from '../style/StyledIcons';

function Track({music_id, details, handleRender}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [detailMusic, setDetailMusic] = useState([]);
    const [initNum, setInitNum] = useState();
    const [islikey, setIslikey] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    let array = [];

    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    if(!initNum){
        setInitNum(details);
    }

    function handleLikey(){
        setIslikey(islikey => {return !islikey})
    }

    function addLikeTrack(){
        Axios.post("/ezenmusic/addlikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            handleLikey();
            setLikeyBannerOn(1)
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeTrack(){
        Axios.post("/ezenmusic/dellikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            handleLikey();
            setLikeyBannerOn(-1); 
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    
    // 2023-12-01 channel 플레이어 추가
    function playerAdd(){
        let array = [];
        array.push(music_id);

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            music_list: array
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }


    //////////// 건우 ////////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, music_id, img) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: music_id,
            album_title: null,
            thumbnail_image: img,
            theme_playlist: null
        });
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////

    
    useEffect(() => {
        if(isSessionValid){
            Axios.post("/ezenmusic/likey/liketrack", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                array = data;
                Axios.get("/ezenmusic/detail/" + music_id)
                .then(({data}) => {
                    data[0].likey = false;
                    for(let i=0; i<array.length; i++){
                        if(Number(data[0].music_id) === array[i]){
                            data[0].likey = true;
                            setIslikey(() => {return true});
                            // setIslikey(!islikey);
                        }
                    }
        
                    setDetailMusic(data);
                })
                .catch((err) => {
                    {}
                })
            })
            .catch((err) => {
                console.log(err);
            })
        }
        
        else{
            Axios.get("/ezenmusic/detail/" + music_id)
            .then(({data}) => {
                data[0].likey = false;
                for(let i=0; i<array.length; i++){
                    if(Number(data[0].music_id) === array[i]){
                        data[0].likey = true;
                        setIslikey(() => {return true});
                    }
                }
    
                setDetailMusic(data);
            })
            .catch((err) => {
                {}
            })
        }
        setInitNum(details);
    
    }, [music_id])
    
    return (
        <>
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"channel"} /> }
        { playlistModalOpen && <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal}  setAddPlaylistBannerOn={setAddPlaylistBannerOn}/> }
        {/* 플레이리스트 추가 베너 */}
        { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        { likeyBannerOn !== 0 && <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"track"}/> }
        {/* 로그인 해주세요 모달 */}
        { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }

        {
            detailMusic.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div className="detail-title-section flex items-center p-[30px]">
                        <div className='album-image'>
                            <img src={"/image/album/"+item.org_cover_image} alt="cover_image"/>
                        </div>
                        <div className="album-info">
                            
                            <Link to={"/detail/album/" + item.album_id + "/albumtrack"}>
                                <p className="music-title">{item.music_title}</p>
                            </Link>
                            <Link to={"/detail/artist/"+item.artist_id+"/track?sortType=POPULARITY"}>
                                <p className="artist-name">{item.artist_name}</p>
                            </Link>
                            <Link to={"/detail/album/" + item.album_id + "/albumtrack"}>
                                <p className="album-title">{item.album_title}</p>
                            </Link>

                            {/* 버튼 박스 */}
                            <div className="button-box">
                                <AddPlaylistButton onClick={isSessionValid? (e) => playerAdd() : (e) => setLoginrRequestVal(true)}></AddPlaylistButton>
                                <AddMyListButton onClick={isSessionValid? (e) => clickPlaylistModalOpen(e, music_id, item.org_cover_image) : (e) => setLoginrRequestVal(true)}></AddMyListButton>
                                {
                                    islikey?
                                    <FilledHeart onClick={isSessionValid? (e) => delLikeTrack() : (e) => setLoginrRequestVal(true)}></FilledHeart>
                                    :
                                    <LikeButton onClick={isSessionValid? (e) => addLikeTrack() : (e) => setLoginrRequestVal(true)}></LikeButton>
                                }    
                            </div>
                        </div>
                    </div>
                    {/* 중간에 있는 navBar */}
                    <div className="mb-[40px]">
                        {
                            initNum === "details" || initNum === undefined?
                                <div>
                                    <Link to={"/detail/track/" + item.music_id + "/details"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("details")}>상세정보</Link>
                                    <Link to={"/detail/track/" + item.music_id + "/similar"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("similar")}>유사곡</Link>
                                </div>
                                :
                                <div>
                                    <Link to={"/detail/track/" + item.music_id + "/details"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("details")}>상세정보</Link>
                                    <Link to={"/detail/track/" + item.music_id + "/similar"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("similar")}>유사곡</Link>
                                </div>

                        }
                    </div>
                    {
                        initNum === "details"?
                            <Details music_id={item.music_id} music_title={item.music_title} composer={item.composer} lyricist={item.lyricist} arranger={item.arranger} lyrics={item.lyrics}/>
                            :
                            <Similar genre={item.genre} music_id={item.music_id} handleRender={handleRender}/>
                    }
                </StyledDetail>
            ))
        }
        </>
    )
}

export default Track

export const StyledDetail = styled.div`
    margin: 0 auto;

    .detail-title-section{
        .album-image{
            max-width: 230px;
            min-width: 230px;
            height: 230px;
            border: 1px solid #efefef;
            border-radius: 6px;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
                object-fit: cover;
                &:hover{
                    filter: brightness(0.7);
                }
            }
        }
        .album-info{
            margin-left: 20px;
            a{
                .music-title{
                    font-size: 28px;
                    font-weight: 700;
                    &:hover{
                        color: var(--main-theme-color);
                    }
                }
                .artist-name{
                    font-size: 16px;
                    font-weight: 400;
                    margin-top: 14px;
                    &:hover{
                        color: var(--main-theme-color);
                    }
                }
                .album-title{
                    font-size: 15px;
                    font-weight: 400;
                    color: #333;
                    margin-top: 10px;
                    &:hover{
                        color: var(--main-theme-color);
                    }
                }
            }
            .button-box{
                display: flex;
                flex-direction: row;
                margin-left: -10px;
                align-items: center;
                justify-content: start;
                @media (min-width: 1280px){ 
                    margin-top: 30px;
                }
                @media (max-width: 1280px){
                    margin-top: 20px;
                }
            }
        }
    }
    .detail-title{
        font-size: 28px;
        font-weight: 700;
    }

    .lyrics{
        white-space: pre-wrap;
    }

    .active{
        background-color: var(--main-theme-color);
        color: white
    }
`