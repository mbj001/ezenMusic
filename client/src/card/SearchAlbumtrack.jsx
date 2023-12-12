import React, {useState, useEffect, MouseEvent, useRef} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import {RiArrowRightSLine ,RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";
import {FiChevronRight} from 'react-icons/fi'
import icons from '../assets/sp_button.6d54b524.png'
import { BsChevronRight } from "react-icons/bs";

function SearchAlbumtrack({lank, music_title, album_title, artist_id, artist_name, img, music_id, album_size, artist_class ,artist_gender, id, album_id,album_release_date}) {
    
    return (    
        <li className="artist_Album_li">
        <StyledTablediv className="d-flex items-center w-[412px]">
        <div className="thumbnail">
            <Link to={"/detail/album/" + album_id + "/albumtrack"}><img src={"/image/album/" + img} alt="img02" className="w-[175px] h-[175px] min-w-[175px] min-h-[175px] rounded-[5px] text-bold" /></Link>
            <button className="libutton absolute" style={{ backgroundImage: `url(${icons})` }}></button>
        </div>
        <div className="ml-5 w-[204px] relative mt-[-40px] pt-[14px]">
            <p className="text-sm font-bold text-truncate"><Link to={"/detail/album/" + album_id + "/albumtrack"}>{album_title}</Link></p>
                <StyledTablediv className="mb-2"><p className="text-xs flex artist_name"><Link to={"/detail/artist/" + artist_id + "/artisttrack"}>{`${artist_name}`}</Link><span className="py-1"><FiChevronRight /></span></p></StyledTablediv>
                <StyledTablediv><p className="mb-1 font-normal text-xs text-gray-900">{album_size}</p></StyledTablediv>
                <StyledTablediv><p className="font-normal text-xs text-gray-400">{`${album_release_date}`}</p></StyledTablediv>   
        </div> 
        </StyledTablediv>
    <div className="d-flex ml-48 absolute mt-[-40px] ">
        <button className="iconslistplus ml-2" style={{backgroundImage:`url(${icons})`}}></button>
        <button className="iconsbox ml-2" style={{backgroundImage:`url(${icons})`}}></button>
    </div>
</li>

    )
}

export const StyledTablediv = styled.div`
    vertical-align: middle;

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
        color: gray;
    }

    li p{
        margin-left: 10px;
    }

    li:hover{
        color: blue;
    }
`

export default SearchAlbumtrack