import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react'
import styled from 'styled-components'
import Axios from "axios"
import { Link } from 'react-router-dom'
import { BsRepeat, BsRepeat1 } from "react-icons/bs";
import { IoPlaySkipForward, IoPlaySkipBack, IoPlay, IoVolumeHigh } from "react-icons/io5";
import { LiaRandomSolid } from "react-icons/lia";
import { FaRandom } from "react-icons/fa";
import { PiShuffleLight, PiShuffleFill } from "react-icons/pi";
import { RiPlayList2Fill } from "react-icons/ri";
import { IoMdPause, IoIosHeartEmpty } from "react-icons/io";
// import PlayerBanner from '../card/PlayerBanner';

function Player({listenMusic, showPlaylistFunc}) {

    const [playBtn, setPlayBtn] = useState(false);
    const btnRef = useRef([]);
    const playbar = useRef(null);

    // const [playerBannerOn, setPlayerBannerOn] = useState(false);

    // useEffect(() => {
    //     setPlayerBannerOn(true);
    // }, [playerBannerOn])


    useEffect(() => {
        function handleClickOutside(e){
            e.preventDefault();
            for(let i=0; i<btnRef.current.length; i++){
                // 플레이 바의 버튼들 클릭
                if(btnRef.current[i].contains(e.target)) {
                    return ;
                }
            }
            // 플레이 바 바탕 클릭
            if(playbar.current.contains(e.target)){
                showPlaylistFunc();
            }
        }
        document.addEventListener("mouseup", handleClickOutside);
    }, [btnRef, playbar])
    
    return (
        <>
    <StyledPlayerBar className="flex justify-between items-center px-[30px]" ref={playbar}>
        <div className="flex items-center justify-between w-[100%]">
            <div className="col-2 flex items-center">
                <img src={"/image/album/" + listenMusic.org_cover_image} alt="image" className="w-[45px] h-[45px] rounded-[5px]" />
                <div className="ml-[10px]">
                    <p className="text-[14px] text-white my-[2px]"><Link to={"/detail/track/" + listenMusic.id + "/details"}>{listenMusic.title}</Link></p>
                    <p className="text-[10px] text-gray">{listenMusic.artist}</p>
                </div>
                <div ref={element => btnRef.current[7] = element}><IoIosHeartEmpty className="text-gray text-[26px] hover:text-white ml-[15px]"/></div>
            </div>
            <div className="col-8 justify-center flex items-center">
                <div ref={element => btnRef.current[0] = element}><BsRepeat className="player-icon text-white text-[20px] mr-[15px] cursor-pointer" /></div>
                <div ref={element => btnRef.current[1] = element}><IoPlaySkipBack className="player-icon text-white text-[25px] mx-[15px] cursor-pointer" /></div>
                {
                    !playBtn?
                    <div ref={element => btnRef.current[2] = element}><IoPlay className="player-icon text-white text-[35px] mx-[15px] cursor-pointer" onClick={() => {setPlayBtn(true)}}/></div>
                    :
                    <div ref={element => btnRef.current[2] = element}><IoMdPause className="player-icon text-white text-[30px] mx-[15px] cursor-pointer" onClick={() => {setPlayBtn(false)}}/></div>
                }
                <div ref={element => btnRef.current[3] = element}><IoPlaySkipForward className="player-icon text-white text-[25px] mx-[10px] cursor-pointer" /></div>
                <div ref={element => btnRef.current[4] = element}><PiShuffleFill className="player-icon text-white text-[20px] ml-[20px] cursor-pointer" /></div>
            </div>
            <div className="col-2 justify-end flex items-center">
                <div ref={element => btnRef.current[5] = element}><IoVolumeHigh className="text-gray text-[22px] mr-[10px] hover:text-white" /></div>
                <div ref={element => btnRef.current[6] = element} className="mt-[-10px]"><input type="range" className="input-range" /></div>
                <RiPlayList2Fill className="text-gray text-[30px] ml-[30px] cursor-pointer hover:text-white"/>
            </div>
        </div>
    </StyledPlayerBar>
        </>
    )
}

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