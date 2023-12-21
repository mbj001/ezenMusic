import React, { useState, useEffect, useContext } from 'react'
import Axios from "axios"
import styled from "styled-components"
import { Link } from "react-router-dom";
import ArtistAlbum from "./ArtistAlbum";
import ArtistTrack from "./ArtistTrack";
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import LikeyBanner from '../card/LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import PlayerBanner from '../card/PlayerBanner';
import { AppContext } from '../App'
//승렬
import { PlayButton } from '../style/StyledIcons';
import { ArtistLikeButton as LikeButton } from '../style/StyledIcons';
import { ArtistFilledHeartButton as FilledHeart } from '../style/StyledIcons';


function Artist({ music_id, handleRender }) {
    
    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [artistInfo, setArtistInfo] = useState([]);
    const [islikey, setIslikey] = useState(false);
    // 좋아요 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 로그인이 필요합니다 모달
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    const {details} = useParams();

    let sortType = decodeURI(useLocation().search).replace("?sortType=", "");

    let array = [];
    let array2 = [];

    function HandleLikey(){
        setIslikey(islikey => {return !islikey})
    }

    function addLikeArtist(){
        Axios.post("/ezenmusic/addlikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "likeartist"
        })
        .then(({data}) => {
            HandleLikey();
            setLikeyBannerOn(1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeArtist(){
        Axios.post("/ezenmusic/dellikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "likeartist"
        })
        .then(({data}) => {
            HandleLikey();
            setLikeyBannerOn(-1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function playerAdd(){
        let array = [];

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "artist",
            artist_id: music_id,
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

    useEffect(() => {
        if(isSessionValid){
            Axios.post("/ezenmusic/detail/album_theme/likey", {
                character_id: userid_cookies,
                division: "likeartist"
            })
            .then(({data}) => {
                array2 = data;
                for(let i=0; i<array2.length; i++){
                    if(array2[i] === Number(music_id)){
                        setIslikey(true);
                    }
                }
    
            })
            .catch((err) => {
                console.log(err)
            })
        }

        Axios.get("/ezenmusic/detail/artist/" + music_id) //music_id 는 artist_id
        .then(({ data }) => {
            array.push(data[0]);        // 아티스트 정보 저장
            setArtistInfo(array);
        })
        .catch((err) => {
            { }
        })

    }, [])

    return (
        <>
        <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"artist"}/>
        { loginRequestVal &&  <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
        {/* 재생목록 추가 베너 */}
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"artist"}/> }
        {
            artistInfo.map((item, index) => (
                <StyledDetail key={index} className='mx-auto md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div className="mx-auto md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
                        <div className="flex items-center">
                            <div className="Imgbox ml-[50px] mt-[50px] mb-[20px]">
                                <div className="w-[230px] h-[230px] rounded-[50%] hover:brightness-75 overflow-hidden" >
                                    <img src={"/image/artist/"+item.org_artist_image} alt="artist_image" className="w-full h-full object-cover"/>
                                </div>
                                <PlayButton title={item.artist_name+" 듣기"} className='absolute bottom-5 right-0' onClick={isSessionValid? () => playerAdd() : () => setLoginrRequestVal(true)}></PlayButton>
                            </div>
                            <div className="mt-[25px] ml-[30px]">
                                <Link to={item.artist_id}><h3 className="detail-title mb-[10px]">{item.artist_name}</h3></Link>
                                <StyledTable>
                                <dl className=" ml-[-6px]">
                                    {item.artist_class === "solo" && <dd className="ml-[0px]">솔로</dd>}
                                    {item.artist_class === "duo" && <dd>듀오</dd>}
                                    {item.artist_class === "group" && <dd>그룹</dd>}
                                    {item.artist_gender === "male" && <dd className="info_list">남성</dd>}
                                    {item.artist_gender === "duo" && <dd className="info_list">듀오</dd>}
                                    {item.artist_gender === "female" && <dd className="info_list">여성</dd>}
                                    <dd className="info_list">{item.genre}</dd>
                                </dl>
                                </StyledTable>
                                <div className="mt-[30px] ml-[-7px]">
                                    {
                                        islikey?
                                        <FilledHeart onClick={isSessionValid? () => delLikeArtist() : () => setLoginrRequestVal(true)}></FilledHeart>
                                        :
                                        <LikeButton onClick={isSessionValid? () => addLikeArtist() : () => setLoginrRequestVal(true)}></LikeButton>
                                    }    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[20px] mb-[40px] mx-auto pl-[10px] md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
                        <NavLink to={"/detail/artist/"+item.artist_id+"/track?sortType=POPULARITY"} className={({ isActive }) => isActive ? "likey-nav active" : "likey-nav text-gray" }>곡</NavLink>
                        <NavLink to={"/detail/artist/"+item.artist_id+"/album?sortType=RECENT"} className={({ isActive }) => isActive ? "likey-nav active" : "likey-nav text-gray" }>앨범</NavLink>
                    </div>
                    {
                        details === "album" && <ArtistAlbum music_id={music_id} album_title={item.album_title} artist_id={item.artist_id} artist_name={item.artist_name} 
                        album_size={item.album_size} handleRender={handleRender} sortType={sortType}/>
                    }
                    {
                        details === "track" && <ArtistTrack artist_image={item.org_artist_image} artist_name={item.artist_name} artist_id={item.artist_id} music_id={music_id} 
                        handleRender={handleRender} sortType={sortType}/>
                    } 
                </StyledDetail>
            ))
        }
        </>
    )

}
export default Artist

const StyledButton = styled.button`
    width: 60px;
    height: 60px;
    font-size: 60px;
    background-color: #fff;
    margin-left: 150px;
    margin-top: -60px;
    padding-left: 3px;
    border-radius: 45%;
    box-shadow: 1px 1px 1px 1px #ddd;
    display: inline-block;
    position: absolute;
    .artist_img_button:hover{
        color:var(--main-theme-color);
        box-shadow: 1px 1px 15px #efefef;
        border-radius: 45%;
    }
    `

const StyledDetail = styled.div`
    width: 100%;
    margin: 0 auto;

    .detail-title{
        font-size: 28px;
        font-weight: 700;
    }

    .lyrics{
        white-space: pre-wrap;
    }

    .likey-nav{
        background-color: #efefef;
        padding: 7px 15px;
        border-radius: 20px;
        font-size: 14px;
        margin-right: 10px;
    }

    .active{
        background-color: var(--main-theme-color);
        color: white;
    }

    a>h3:hover{
        color: var(--main-theme-color);
    }
`

const StyledTable = styled.dl`
    dd{
        font-size: 15px;
        position: relative;
        display: inline-block;
        margin: 0 10px;
    }  
    .info_list:after{
        position: absolute;
        top: 9px;
        left: -10px;
        display: block;
        width: 1px;
        height: 7px;
        content: "";
        background-color: var(--main-text-gray-lighter);
        opacity: 0.7;
    }
`