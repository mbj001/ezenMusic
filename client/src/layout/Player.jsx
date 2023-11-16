import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Axios from "axios"
import { Link } from 'react-router-dom'


function Player({listenMusic, showPlaylistFunc}) {
    console.log(listenMusic);
    return (
    <StyledPlayerBar className="flex justify-between items-center px-[30px]">
        <div className="flex items-center">
            <img src={"/image/album/" + listenMusic.org_cover_image} alt="image" className="w-[45px] h-[45px] rounded-[5px]" />
            <div className="ml-[10px]">
                
                <p className="text-[14px] text-white my-[2px]" onClick={showPlaylistFunc}><Link to={"/detail/track/" + listenMusic.id + "/details"}>{listenMusic.title}</Link></p>
                <p className="text-[10px] text-gray-400">{listenMusic.artist}</p>
            </div>
        </div>
        <div>

        </div>
        <div>

        </div>
    </StyledPlayerBar>
    )
}

const StyledPlayerBar = styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80px;
    background-color: black;
    z-index: 10002;

    // p{
    //     color: white;
    // }

`

export default Player