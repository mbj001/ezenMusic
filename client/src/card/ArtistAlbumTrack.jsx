import React, {useState, useEffect, MouseEvent, useRef} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";

function ArtistAlbumTrack({lank, title, album_title, artist_num, artist, img, music_id, album_size, artist_class ,artist_gender, id, album_id}) {

    const searchInputRef = useRef(null);
    const moreboxRef = useRef(null);
    const [isSearchMode, setIsSearchMode] = useState(false); 
  
    useEffect(() => {
        function handleClickOutside(e){
            if(searchInputRef.current && !searchInputRef.current.contains(e.target)) {
                if(moreboxRef.current.contains(e.target)){
                }
                else{
                    setIsSearchMode(false); 
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
    }, [searchInputRef]);
    
    
    return (    
    <li className="inline-block ">
        <StyledTableli className="d-flex items-center mt-[100px] ">
            <Link to={"/detail/album/" + album_id + "/albumtrack"}><img src={"/image/album/" + img} alt="img02" className="w-[175px] h-[175px] rounded-[5px]" /></Link>
            <div className="ml-5 overflow-hidden w-72">
                <p className="text-neutral-950 font-normal text-[16px]"><Link to={"/detail/album/" + album_id + "/albumtrack"}>{album_title}</Link></p>
                <StyledTableli className=""><p className="text-sm"><Link to={"/detail/artist/"+ artist_num +"/artisttrack"}>{artist}</Link></p></StyledTableli>
            </div> 
        </StyledTableli>
        <div className="d-flex ml-44 absolute mt-[-50px]">
            <StyledTableli className="w-[30px]"><RiPlayFill className="m-auto text-[20px] text-gray-500 cursor-pointer hover:text-blue-500" /></StyledTableli>
            <StyledTableli className="w-[30px]"><RiPlayListAddFill className="m-auto text-[20px] text-gray-500 cursor-pointer hover:text-blue-500" /></StyledTableli>
            <StyledTableli className="w-[30px]"><RiFolderAddLine className="m-auto text-[20px] text-gray-500 cursor-pointer hover:text-blue-500" /></StyledTableli>
            <StyledTableli className="w-[30px]"><RiHeart3Line className="m-auto text-[20px] text-gray-500 cursor-pointer hover:text-blue-500" /></StyledTableli>
        </div>
    </li>
    )
}

export const StyledTableli = styled.div`
    font-size: 20px;
    vertical-align: middle;

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

export default ArtistAlbumTrack