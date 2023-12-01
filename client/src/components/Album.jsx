import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';
import styled from 'styled-components';
import { RiPlayListAddFill, RiFolderAddLine, RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import AlbumIntro from './AlbumIntro';
import AlbumTrack from "./AlbumTrack";
import { Cookies } from "react-cookie";
import LikeyBanner from '../card/LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import PlayerBanner from '../card/PlayerBanner';
import icons from '../assets/sp_button.6d54b524.png'
import PlaylistAdd from '../modal/PlaylistAdd';

function Album({album_id, details, handleRender}) {

    const [detailMusic, setDetailMusic] = useState([]);
    const [initNum, setInitNum] = useState();

    // MBJ
    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");
    const [likeyList, setLikeyList] = useState([]);
    const [islikey, setIslikey] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    let array = [];
    // ~ MBJ


    if(!initNum){
        setInitNum(details);
    }

    function HandleLikey(){
        setIslikey(islikey => {return !islikey})
    }

    function addLikeAlbum(){
        Axios.post("http://localhost:8080/ezenmusic/addlikey", {
            userid: userid_cookies,
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
        Axios.post("http://localhost:8080/ezenmusic/dellikey", {
            userid: userid_cookies,
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
        let array = [];

        console.log(typeof(detailMusic[0].album_id));
        // for(let i=0; i<albumTrackMusic.length; i++){
        //     array.push(albumTrackMusic[i].id)
        // }

        Axios.post("http://localhost:8080/playerhandle/playerAdd", {
            userid: userid_cookies,
            page: "albumtrack",
            album_id: detailMusic[0].album_id
        })

        .then(({data}) => {

            setPlayerBannerOn(true);
            handleRender();

        })

        .catch((err) => {
            console.log(err);
        })
    }

    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, album_title, img) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: null,
            album_title: album_title,
            thumbnail_image: img,
            theme_playlist: null
        });
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////


    useEffect(() => {
        if(userid_cookies !== undefined){
            Axios.post("http://localhost:8080/ezenmusic/detail/album_theme/likey", {
                userid: userid_cookies,
                division: "likealbum"
            })
            .then(({data}) => {
                array = data;
                setLikeyList(data);
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

        Axios.get("http://localhost:8080/ezenmusic/detail/album/" + album_id)
        .then(({data}) => {
            setDetailMusic(data);
        })
        .catch((err) => {
            {}
        })

    }, [])

    return (
        <>
        {
            playlistModalOpen?
            <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal}/>
            :
            ""
        }
        {
            playerBannerOn?
            <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} />
            :
            ""
        }
        <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"album"}/>
        {
            loginRequestVal?
            <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} />
            :
            ""
        }
        {
            detailMusic.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div>
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/album/"+item.org_cover_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[10px]" />
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.album_title}</p>
                                <p className="font-normal">{item.artist}</p>
                                <p className="font-light text-gray">{item.album_size}</p>
                                <div className="flex mt-[30px] ">

                                    <button className="artist_listplus ml-[-10px]" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? playerAdd : setLoginrRequestVal}></button>
                                    <button className="artist_box " style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? (e) => clickPlaylistModalOpen(e, item.album_title, item.org_cover_image) : setLoginrRequestVal}></button>
                                    {
                                        islikey?
                                        <button className="redheart" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? delLikeAlbum : setLoginrRequestVal}></button>
                                        :
                                        <button className="iconsheart" style={{backgroundImage:`url(${icons})`}}  onClick={userid_cookies? addLikeAlbum : setLoginrRequestVal}></button>
                                    }  
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="mb-[40px]">
                        {
                            initNum === "albumtrack" || initNum === undefined ?
                            <div>
                                <Link to={"/detail/album/" + album_id + "/intro"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("intro")}>상세정보</Link>
                                <Link to={"/detail/album/" + album_id + "/albumtrack"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("albumtrack")}>수록곡</Link>
                            </div>
                            :
                            <div>
                                <Link to={"/detail/album/" + album_id + "/intro"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("intro")}>상세정보</Link>
                                <Link to={"/detail/album/" + album_id + "/albumtrack"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("albumtrack")}>수록곡</Link>
                            </div>
                        }
                    </div>
                    {
                        initNum === "albumtrack"?
                            <AlbumTrack id={album_id} album_title={item.album_title} handleRender={handleRender}/>
                            :
                            <AlbumIntro album_title={item.album_title} artist={item.artist} intro={item.intro} publisher={item.publisher} agency={item.agency} />
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