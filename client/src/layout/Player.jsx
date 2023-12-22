import React, {useState, useEffect, useRef, useContext} from 'react'
import styled from 'styled-components'
import Axios from "axios"
import { Link, useLocation } from 'react-router-dom'
import { BsRepeat } from "react-icons/bs";
import { IoPlaySkipForward, IoPlaySkipBack, IoPlay, IoVolumeHigh } from "react-icons/io5";
import { PiShuffleFill } from "react-icons/pi";
import { RiPlayList2Fill } from "react-icons/ri";
import { IoMdPause } from "react-icons/io";
import { Cookies } from 'react-cookie';
import { AppContext } from '../App'
import PleaseBuyVoucher from '../modal/PleaseBuyVoucher';

// 승렬
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";

function Player({listenMusic, showPlaylistFunc, handleRender, delLikeyFunc, addLikeyFunc}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const userid = cookies.get("client.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [voucherModalOpen, setVoucherModalOpen] = useState(false);
    const [playBtn, setPlayBtn] = useState(false);
    const btnRef = useRef([]);
    const playbar = useRef(null);


    function playerNext(){
        Axios.post("/playerHandle/playerNext", {
            character_id: userid_cookies
        })
        .then(({data}) => {
            handleRender();
            setPlayBtn(false);
            pauseSound();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function playerBefore(){
        Axios.post("/playerHandle/playerBefore", {
            character_id: userid_cookies
        })
        .then(({data}) => {
            handleRender();
            setPlayBtn(false);
            pauseSound();
        })
        .catch((err) => {
            console.log(err);
        })
    }


    useEffect(() => {
        function handleClickOutside(e){
            e.preventDefault();
            for(let i=0; i<btnRef?.current?.length; i++){
                // 플레이 바의 버튼들 클릭
                if(btnRef.current[i]?.contains(e.target)) {
                    return ;
                }
            }
            // 플레이 바 바탕 클릭
            if(playbar?.current?.contains(e.target)){
                showPlaylistFunc();
            }
        }

        document.addEventListener("mouseup", handleClickOutside);
    }, [btnRef, playbar])


    //////////////////// Audio Setting
    useEffect(() => {
        setPlayBtn(false);
        pauseSound();
        setAudioTune(new Audio("/audio/"+listenMusic.music_audio));
    }, [listenMusic])

    const [audioTune, setAudioTune] = useState(new Audio("/audio/"+listenMusic.music_audio));
    const [playInLoop, setPlayInLoop] = useState(false);

    // load audio file on component load
    useEffect(() => {
        audioTune.load();
    }, [])

    // set the loop of audio tune
    useEffect(() => {
        audioTune.loop = playInLoop;
    }, [playInLoop])
    // play audio sound
    const playSound = () => {
        Axios.post("/playerHandle/voucherConfirm", {
            user_id: userid
        })
        .then(({data}) => {
            if(data === 1){
                audioTune.play();
                setPlayBtn(true); 
            }
            else if(data === -1){
                setVoucherModalOpen(true);
            }
        })
    }

    // pause audio sound
    const pauseSound = () => {
        audioTune.pause();
    }

    // stop audio sound
    const stopSound = () => {
        audioTune.pause();
        audioTune.currentTime = 0;
    }

    // variable to play audio in loop
    //////////////////// ~ Audio Setting

    const locationNow = useLocation();
    if (locationNow.pathname === "/discovery"){
        return null;   
    }

    return (
    <>
    { voucherModalOpen === true && <PleaseBuyVoucher setVoucherModalOpen={setVoucherModalOpen} /> }
    <StyledPlayerBar className="flex justify-between items-center px-[70px]" ref={playbar}>
    {/* <ReactAudioPlayer src={"/audio/audio02.mp3"} autoPlay controls/> */}
        <div className="flex items-center justify-between w-[100%]">
            {
                listenMusic.length === 0?
                <div className="col-2 flex items-center">
                    <div className="w-[45px] h-[45px] rounded-[5px] bg-gray-light"></div>
                    <div className="ml-[10px]">
                        <p className="text-[11px] text-gray-light">재생목록이 비어있습니다.</p>
                    </div>
                    <div ref={element => btnRef.current[7] = element}></div>
                </div>
                :
                <PlayerMusicInfo>
                    <div className='album-image-cover'>
                        <img src={"/image/album/" + listenMusic.org_cover_image} alt={listenMusic.org_cover_image}/>
                    </div>
                    <div className="album-info-cover">
                        <p className='music-title'>
                            <Link to={"/detail/track/" + listenMusic.music_id + "/details"}>
                                {listenMusic.music_title}
                            </Link>
                        </p>
                        <p className="artist-name">{listenMusic.artist_name}</p>
                    </div>
                    {
                        listenMusic.likey === true?
                        <div className='like-icon filled-heart' ref={element => btnRef.current[7] = element} onClick={() => delLikeyFunc(listenMusic.music_id)}>
                            <IoMdHeart />
                        </div>
                        :
                        <div className='like-icon empty-heart' ref={element => btnRef.current[7] = element} onClick={() => addLikeyFunc(listenMusic.music_id)}>
                            <IoMdHeartEmpty />
                        </div>
                    }
                </PlayerMusicInfo>
            }
            {
                listenMusic.length === 0?               
                <>
                <div className="col-8 justify-center flex items-center">
                    <div ref={element => btnRef.current[0] = element}><BsRepeat className="player-icon text-gray-dark text-[20px] mr-[15px] cursor-pointer" /></div>
                    <div ref={element => btnRef.current[1] = element}><IoPlaySkipBack className="player-icon text-gray-dark text-[25px] mx-[15px] cursor-pointer" /></div>
                    <div ref={element => btnRef.current[2] = element}><IoPlay className="player-icon text-gray-dark text-[35px] mx-[15px] cursor-pointer" /></div>
                    <div ref={element => btnRef.current[3] = element}><IoPlaySkipForward className="player-icon text-gray-dark text-[25px] mx-[10px] cursor-pointer" /></div>
                    <div ref={element => btnRef.current[4] = element}><PiShuffleFill className="player-icon text-gray-dark text-[20px] ml-[20px] cursor-pointer" /></div>
                </div>
                <div className="col-2 justify-end flex items-center">
                    <div ref={element => btnRef.current[5] = element}><IoVolumeHigh className="text-gray-dark text-[22px] mr-[10px]" /></div>
                    <div ref={element => btnRef.current[6] = element} className="mt-[-10px]"><input type="range" className="input-range" /></div>
                    <RiPlayList2Fill className="text-gray-dark text-[30px] ml-[30px] cursor-pointer"/>
                </div>
                </>
                :
                <>
                <div className="col-8 justify-center flex items-center">
                    <div ref={element => btnRef.current[0] = element}><BsRepeat className="player-icon text-white text-[20px] mr-[15px] cursor-pointer" /></div>
                    <div ref={element => btnRef.current[1] = element}><IoPlaySkipBack className="player-icon text-white text-[25px] mx-[15px] cursor-pointer" onClick={() => playerBefore()}/></div>
                    {
                        !playBtn?
                        // <div ref={element => btnRef.current[2] = element}><IoPlay className="player-icon text-white text-[35px] mx-[15px] cursor-pointer" onClick={() => {setPlayBtn(true);}}/></div>
                        <div ref={element => btnRef.current[2] = element}><IoPlay className="player-icon text-white text-[35px] mx-[15px] cursor-pointer" onClick={() => {playSound();}}/></div>
                        :
                        <div ref={element => btnRef.current[2] = element}><IoMdPause className="player-icon text-white text-[30px] mx-[15px] cursor-pointer" onClick={() => {setPlayBtn(false); pauseSound();}}/></div>
                    }
                    <div ref={element => btnRef.current[3] = element}><IoPlaySkipForward className="player-icon text-white text-[25px] mx-[10px] cursor-pointer" onClick={() => playerNext()}/></div>
                    <div ref={element => btnRef.current[4] = element}><PiShuffleFill className="player-icon text-white text-[20px] ml-[20px] cursor-pointer" /></div>
                </div>
                <div className="col-2 justify-end flex items-center">
                    <div ref={element => btnRef.current[5] = element}><IoVolumeHigh className="text-gray cursor-pointer text-[22px] mr-[10px] hover:text-white" /></div>
                    <div ref={element => btnRef.current[6] = element} className="mt-[-10px]"><input type="range" className="input-range cursor-pointer" /></div>
                    <RiPlayList2Fill className="text-gray text-[30px] ml-[30px] cursor-pointer hover:text-white"/>
                </div>
                </>
            }
        </div>
    </StyledPlayerBar>
        </>
    )
}
// 승렬
const PlayerMusicInfo = styled.div`
    max-width: 200px;
    min-width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .album-image-cover{
        width: 45px;
        height: 45px;
        border-radius: 6px;
        overflow: hidden;
        img{
            width: 100%;
            heigth: 100%;
        }
    }
    .album-info-cover{
        margin-left: 10px;
        .music-title{
            max-width: 100px;
            min-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 13px;
            color: var(--main-text-white);
        }
        .artist-name{
            max-width: 100px;
            min-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
            color: #989898;
        }
    }
    .like-icon{
        width: 44px;
        height: 44px;
        padding: 10px;
        cursor: pointer;
        svg{
            width: 100%;
            height: 100%;   
        }
    }
    .like-icon.empty-heart{
        color: var(--main-text-gray);
    }
    .like-icon.filled-heart{
        color: var(--main-theme-color);
    }
`;

const StyledPlayerBar = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80px;
    background-color: black;
    z-index: 10002;

    .player-icon:hover{
        transform: scale(1.1);
    }

    input[type="range"] {
        overflow: hidden;
        width: 120px;
        -webkit-appearance: none;
        background-color: #828282;
        height: 2px;
        border-radius: 5px;
      }

      input[type="range"]:hover{
        height: 5px;
      }

      input[type="range"]::-webkit-slider-thumb:hover{
        box-shadow: -80px 0 0 80px white;
      }
      
      input[type="range"]::-webkit-slider-runnable-track {
        // height: 10px;
        -webkit-appearance: none;
        color: var(--main-text-gray);
        // margin-top: 15px;
      }
      
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 0px;
        height: 0px;
        background: black;
        box-shadow: -80px 0 0 80px rgba(196, 196, 196);
      }
    
`

export default Player