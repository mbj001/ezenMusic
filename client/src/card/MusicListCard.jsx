import React, {useState, useEffect, MouseEvent, useRef} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";

function MusicListCard({lank, title, album_title, artist, img, music_id}) {

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
    <tr className="">
        <StyledTabletd className="text-center"><input type="checkbox" /></StyledTabletd>
        {
            lank ?
            <StyledTabletd className="text-center"><p className="text-black font-black">{lank}</p></StyledTabletd>
            :
            ""
        }
        <StyledTabletd className="d-flex items-center">
            {/* <img src="/image/album02.jpg" alt="img02" /> */}
            <Link to={"/detail/album/" + music_id + "/albumtrack"}><img src={"/image/album/" + img} alt="img02" className="w-[60px] h-[60px] rounded-[5px]" /></Link>
            <div className="ml-[20px]">
                <p className="mb-[5px]">{title}</p>
                <p className="text-gray-500 font-normal text-[12px]"><Link to={"/detail/album/" + music_id + "/albumtrack"}>{album_title}</Link></p>
            </div> 
        </StyledTabletd>
        <StyledTabletd className="w-[250px]"><p><Link to="#">{artist}</Link></p></StyledTabletd>
        <StyledTabletd className="m-auto w-[70px]"><RiPlayFill className="m-auto text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" /></StyledTabletd>
        <StyledTabletd className="w-[70px]"><RiPlayListAddFill className="m-auto text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" /></StyledTabletd>
        <StyledTabletd className="w-[70px]"><RiFolderAddLine className="m-auto text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" /></StyledTabletd>
        {/* <StyledTabletd className="text-center w-[70px] relative"><RiMore2Line className="m-auto text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" onClick={() => setShowMenu(!showMenu)}/> */}
        {/* <StyledTabletd className="text-center w-[70px] relative"><RiMore2Line className="m-auto text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" ref={selectEl} /> */}
        <StyledTabletd className="text-center w-[70px] relative" ref={moreboxRef}><RiMore2Line className="m-auto text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" onClick={() => {setIsSearchMode(!isSearchMode);}}/>
            {
                isSearchMode ?
                <StyledMusicMenu ref={searchInputRef}>
                    <ul>
                        <li><Link to={"/detail/track/"+music_id+"/details"} className="flex items-center"><RiMusic2Line /><p>곡 정보</p></Link></li>
                        <li><Link to={"/detail/album/"+music_id+"/albumtrack"} className="flex items-center"><RiAlbumLine /><p>앨범 정보</p></Link></li>
                        <li><Link to={"/detail/artist/"+music_id+"/artisttrack"} className="flex items-center"><RiMicLine /><p>아티스트 정보</p></Link></li>
                        <li><Link to="#" className="flex items-center"><RiHeart3Line /><p>종아요</p></Link></li>
                        <li><Link to="#" className="flex items-center"><RiProhibitedLine /><p>이곡 안듣기</p></Link></li>
                    </ul>
                </StyledMusicMenu>
                :
                ""
            }

        </StyledTabletd>
    </tr>
    )
}

const StyledTabletd = styled.td`
    font-size: 13px;
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

export default MusicListCard