import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';
import styled from 'styled-components';
import AlbumIntro from './AlbumIntro';
import AlbumTrack from "./AlbumTrack";
import { Cookies } from 'react-cookie';
import LikeyBanner from '../card/LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import PlayerBanner from '../card/PlayerBanner';
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import { AppContext } from '../App'
//승렬
import { MusicListCardAddMyListButton as AddMyListButton } from '../style/StyledIcons';
import { MusicListCardAddPlaylistButton as AddPlaylistButton } from '../style/StyledIcons';
import { ArtistLikeButton as LikeButton } from '../style/StyledIcons';
import { ArtistFilledHeartButton as FilledHeart } from '../style/StyledIcons';
import { TinyPlayButton as PlayButton } from '../style/StyledIcons';

function Album({album_id, details, handleRender}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [detailMusic, setDetailMusic] = useState([]);
    const [initNum, setInitNum] = useState();

    const [islikey, setIslikey] = useState(false);
    // 좋아요 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    // 로그인이 필요합니다 모달
    const [loginRequestVal, setLoginrRequestVal] = useState(false);

    let array = [];

    useEffect(() => {
        setInitNum(details);
    }, [details])

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
            handleRender();
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
            handleRender();

        })
        .catch((err) => {
            console.log(err);
        })
    }

    function playerAdd(bool){
        let array = [];

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "albumtrack",
            album_id: detailMusic[0].album_id,
            change_now_play: bool
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


    useEffect(() => {
        if(isSessionValid){
            Axios.post("/ezenmusic/detail/album_theme/likey", {
                character_id: userid_cookies,
                division: "likealbum"
            })
            .then(({data}) => {
                array = data;
                // 앨범 좋아요 확인
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

        Axios.get("/ezenmusic/detail/album/" + album_id)
        .then(({data}) => {
            setDetailMusic(data);
        })
        .catch((err) => {
            {}
        })

    }, [])

    return (
        <>
        { playlistModalOpen && <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        {/* 플레이리스트 추가 베너 */}
        { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
        { likeyBannerOn !== 0 && <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"album"}/> }
        { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
        
        {
            detailMusic.map((item, index) => (
                <StyledDetail key={index} className='mx-auto md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div className="mx-auto md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
                        <div className="flex items-center p-[30px]">
                            <div className="relative">
                                <div className="w-[230px] h-[230px] rounded-[6px] hover:brightness-75 overflow-hidden border-1 M-img-border">
                                    <img src={"/image/album/" + item.org_cover_image} alt="cover_image" className="w-full h-full object-cover"/>
                                </div>
                                <PlayButton onClick={isSessionValid? () =>  playerAdd(true) : () => setLoginrRequestVal(true)}></PlayButton>
                            </div>
                            <div className="m-[30px]">
                                <Link to={"/detail/album/"+item.album_id+"/albumtrack"}><p className="detail-title mb-[10px] hover-text-blue">{item.album_title}</p></Link>
                                <Link to={"/detail/artist/"+item.artist_id+"/track?sortType=POPULARITY"}><p className="font-normal hover-text-blue">{item.artist_name}</p></Link>
                                <p className="font-light text-gray mt-[15px]">{item.album_size}</p>
                                <div className="flex ml-[-10px] mt-[15px] ">

                                    <AddPlaylistButton onClick={isSessionValid? () =>  playerAdd(false) : () => setLoginrRequestVal(true)}></AddPlaylistButton>
                                    <AddMyListButton onClick={isSessionValid? (e) => clickPlaylistModalOpen(e, item.album_id, item.org_cover_image) : () => setLoginrRequestVal(true)}></AddMyListButton>
                                    {
                                        islikey?
                                        <FilledHeart onClick={isSessionValid? () => delLikeAlbum() : () => setLoginrRequestVal(true)}></FilledHeart>
                                        :
                                        <LikeButton onClick={isSessionValid? () => addLikeAlbum() : () => setLoginrRequestVal(true)}></LikeButton>
                                    }  
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="">
                        {
                            initNum === "albumtrack" || initNum === undefined ?
                            <div className='mt-[20px] mb-[40px] mx-auto pl-[10px] md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                                <Link to={"/detail/album/" + album_id + "/intro"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("intro")}>상세정보</Link>
                                <Link to={"/detail/album/" + album_id + "/albumtrack"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("albumtrack")}>수록곡</Link>
                            </div>
                            :
                            <div className='mt-[20px] mb-[40px] mx-auto pl-[10px] md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                                <Link to={"/detail/album/" + album_id + "/intro"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("intro")}>상세정보</Link>
                                <Link to={"/detail/album/" + album_id + "/albumtrack"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("albumtrack")}>수록곡</Link>
                            </div>
                        }
                    </div>
                    {
                        initNum === "albumtrack"?
                            <AlbumTrack album_id={album_id} album_title={item.album_title} handleRender={handleRender}/>
                            :
                            <AlbumIntro album_title={item.album_title} artist_name={item.artist_name} intro={item.intro} publisher={item.publisher} agency={item.agency} />
                    }
                </StyledDetail>
            ))
        }
        </>
    )
}

export default Album

const StyledDetail = styled.div`
    // width: 1440px;
    margin: 0 auto;

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