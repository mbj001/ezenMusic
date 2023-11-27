import React, {useState, useEffect, useRef} from 'react'
import Axios from "axios"
import Player from './Player';
import styled from 'styled-components';
import { Link, Router } from 'react-router-dom';
import { Cookies } from "react-cookie";
// import { StyledMusicMenu } from '../card/MusicListCard';
// import styled from 'styled-components';
import PlayerBanner from '../card/PlayerBanner';


import { RiSearchLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";

function Playlist({handleRender, render}) {
    const [playerMusic, setPlayerMusic] = useState([]);
    const [listenMusic, setListenMusic] = useState([]);
    const [showPlaylist, setShowPlaylist] = useState(true);
    const [showMorebox, setShowMorebox] = useState([]); 

    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    let array = [];

    useEffect(() => {
        console.log("playerlist useeffect");
        
        if(!userid_cookies){
            // 로그인 안되어 있을 때
        }
        else{
            Axios.post("http://localhost:8080/ezenmusic/playerbar", {
                userid: userid_cookies
            })
            .then(({data}) => {
                for(let i=0; i<data.length; i++){
                    if(data[i].now_play_music === true){
                        // 아래 player에 나올 노래
                        setListenMusic(data[i]);
                    }
                }
                // 플레이리스트에 들어갈 노래들
                setPlayerMusic(data);
    
                for(let i=0; i<data.length; i++){
                    array.push("false");
                }
                setShowMorebox(array);
            })
            .catch((err) => {
                {}
            })

        }
    }, [handleRender])

    useEffect(() => {
        setPlayerBannerOn(true);
    }, [render])

    function changeMusicFunc(e, item){
        e.preventDefault();
        setListenMusic(item);
        // 현재 재생중인 곡 수정(playerlist -> now_play_list)
        Axios.post("http://localhost:8080/playerHandle/changeNowMusic", {
            userid: userid_cookies,
            id: item.id
        })
    }

    function showPlaylistFunc(){
        // 이렇게 set 함수 안에 함수형태로 넣으면 비동기 식으로 넘어가지 않음.
        setShowPlaylist(showPlaylist => {return !showPlaylist});
    }

    function handleShowMoreBox(e, index){
        e.preventDefault();
        let handleArray = [];

        for(let i=0; i<showMorebox.length; i++){
            handleArray.push(showMorebox[i]);
        }

        if(handleArray[index] === "false"){
            handleArray[index] = "true";
        }
        else{
            handleArray[index] = "false";
        }
        setShowMorebox(handleArray); 
    }

    return (
        <>
        <StyledPlaylist showVal={showPlaylist} img={listenMusic.org_cover_image}>
            <div className="blur-box">
                <div className="flex items-center">
                    <div className="col-7">
                        <div className="text-center">
                            <p className="text-white text-[22px] font-bold mb-[10px]" onClick={showPlaylistFunc}><Link to={"/detail/track/" + listenMusic.id + "/details"}>{listenMusic.title}</Link></p>
                            <p className="text-gray-500 text-[14px] mb-[15px]">{listenMusic.artist}</p>

                            <img src={"/image/album/" + listenMusic.org_cover_image} alt="cover_image" className="w-[350px] h-[350px] m-auto rounded-[20px]"  />
                        </div>
                    </div>
                    <div className="col-5 mt-[100px] pr-[100px]">
                        <div>
                            <div className="flex justify-between border-b-[1px] border-b-gray-500 mb-[15px]">
                                <div className="flex">
                                    <p className="text-white border-b-[2px] border-b-blue-600 mr-[20px] cursor-pointer">음악</p>
                                    <p className="text-white border-b-[2px] border-b-blue-600 cursor-pointer">오디오</p>
                                </div>
                                <p>편집</p>
                            </div>
                            <div className="flex items-center relative justify-between">
                                <div>
                                    <RiSearchLine className="text-gray-400 absolute left-[10px] top-[15px]" />
                                    <input type="text" placeholder='재생목록에서 검색해주세요' className="text-white rounded-[20px] bg-slate-500 text-[12px] w-[250px] h-[40px] bg-opacity-30 pl-[30px]" />
                                </div>
                                <div className="flex">
                                    <p className="text-gray-400 text-[14px] mr-[15px]">내 리스트 가져오기</p>
                                    <p className="text-gray-400 text-[14px]">그룹접기</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-[600px] overflow-scroll">
                            {
                                playerMusic.map((item, index) => (
                                    <div key={index} className="flex my-[20px] items-center">
                                        <img src={"/image/album/" + item.org_cover_image} alt="cover_image" className="w-[50px] h-[50px] rounded-[5px]" />
                                        <div onClick={(e) => changeMusicFunc(e, item)} className="col-10 cursor-pointer pl-[15px]">
                                            <p className="text-white text-[15px]">{item.title}</p>
                                            <p className="text-gray-400 text-[11px]">{item.artist}</p>
                                        </div>
                                        
                                        <div className="col-1"><RiMore2Line className="text-gray-400 text-[22px] cursor-pointer relative" onClick={(e) => handleShowMoreBox(e, index)} />
                                        {
                                            showMorebox[index] === "true" ?
                                                <Styledlist>
                                                    <ul>
                                                        <li><Link to={"/detail/track/"+item.id+"/details"} className="flex items-center"><RiMusic2Line /><p>곡 정보</p></Link></li>
                                                        <li><Link to={"/detail/album/"+item.album_id+"/albumtrack"} className="flex items-center"><RiAlbumLine /><p>앨범 정보</p></Link></li>
                                                        <li><Link to={"/detail/artist/"+item.id+"/artisttrack"} className="flex items-center"><RiMicLine /><p>아티스트 정보</p></Link></li>
                                                        <li><Link to="#" className="flex items-center"><RiHeart3Line /><p>종아요</p></Link></li>
                                                        <li><Link to="#" className="flex items-center"><RiProhibitedLine /><p>이곡 안듣기</p></Link></li>
                                                    </ul>
                                                </Styledlist>
                                                :
                                                ""
                                        }
                                        </div>

                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </StyledPlaylist>
        <div>
            <Player listenMusic={listenMusic} showPlaylistFunc={showPlaylistFunc}/>
        </div>
        {
            playerBannerOn?
            <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn}/>
            :
            ""
        }
        </>
    )
}

const StyledPlaylist = styled.div`
    -webkit-scrollbar, 
    div::-webkit-scrollbar{
        display: none;
    }

    position: fixed;
    top: 0;
    z-index: 10001;
    width: 100%;
    height: 100%;
    background-image: ${(props) => "url(/image/album/"+props.img+")"};
    background-size: 90% 90%;


    transform: ${(props) => props.showVal? "translateY(100%)" : "translateY(0%)"};
    transition: 0.5s;

    .blur-box{
        width: 100%;
        height: 100%;
        background-color: rgba(10, 10, 10, 0.8);
        backdrop-filter: blur(50px);
    }
`

export const Styledlist = styled.div`
    position: absolute;
    box-shadow: 0 0 30px 5px #efefef;
    width: 200px;
    right: 150px;
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
        color: gray;
    }

    li p{
        margin-left: 10px;
    }

    li:hover{
        color: var(--main-theme-color);
    }
`
export default Playlist