import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine, RiHeart3Fill } from "react-icons/ri";
import Axios from "axios"
import { Cookies } from 'react-cookie';



function MusicListCard({lank, title, album_title, artist_num, artist, img, music_id, album_id, check_all, clickPlaylistModalOpen, likey, handleLikeypage, setLikeyBannerOn, handleRender}) {

    const searchInputRef = useRef(null);
    const moreboxRef = useRef(null);
    const [isSearchMode, setIsSearchMode] = useState(false); 
    const [chkboxChecked, setChkboxChecked] = useState(false);
    const [likeyVal, setLikeyVal] = useState(false);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");


    function addPlayerlistFunc(){
        Axios.post("http://localhost:8080/playerHandle/addplayerlist",{
            userid: userid_cookies,
            id: music_id
        })
        .then(({data}) => {
            console.log("POST COMPLETE !!! : VALUE = " + data);
            handleRender();
        })
    }


    function chkboxClickFunc(e){
        setChkboxChecked(!chkboxChecked);
    }

    function handleLikey(){
        setLikeyVal(likeyVal => {return !likeyVal});
    }
    
    useEffect(() => {
        setLikeyVal(likey);
    },[likey])


    function addLikeyFunc(){
        Axios.post("http://localhost:8080/ezenmusic/addlikey", {
            userid: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            if(handleLikeypage){
                handleLikeypage();
            }
            handleLikey();
            setIsSearchMode(false); 
            setLikeyBannerOn(1)

        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeyFunc(){
        Axios.post("http://localhost:8080/ezenmusic/dellikey", {
            userid: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            console.log(data);
            if(handleLikeypage){
                handleLikeypage();
            }
            handleLikey();
            setIsSearchMode(false);
            setLikeyBannerOn(-1); 
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        if(check_all == true){
            setChkboxChecked(true);
        }
        else{
            setChkboxChecked(false);
        }
    }, [check_all])

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
    <>
    <StyledTableTr className={chkboxChecked? "table-active" : ""}>
        <StyledTabletd className="text-center"><input type="checkbox" checked={chkboxChecked} onClick={chkboxClickFunc} readOnly /></StyledTabletd>
        {
            lank ?
            <StyledTabletd className="text-center"><p className="text-black font-black">{lank}</p></StyledTabletd>
            :
            ""
        }
        <StyledTabletd className="d-flex items-center">
            <Link to={"/detail/album/" + album_id + "/albumtrack"}><img src={"/image/album/" + img} alt="img02" className="w-[60px] h-[60px] rounded-[5px]" /></Link>
            <div className="ml-[20px]">
                <p className="mb-[5px]">{title}</p>
                <p className="text-gray-light font-normal text-[12px]"><Link to={"/detail/album/" + album_id + "/albumtrack"}>{album_title}</Link></p>
            </div> 
        </StyledTabletd>
        <StyledTabletd className="w-[250px]"><p><Link to="#">{artist}</Link></p></StyledTabletd>
        <StyledTabletd className="m-auto w-[70px]"><RiPlayFill className="m-auto text-[24px] text-gray cursor-pointer hover-text-blue" onClick={addPlayerlistFunc}/></StyledTabletd>
        <StyledTabletd className="w-[70px]"><RiPlayListAddFill className="m-auto text-[24px] text-gray cursor-pointer hover-text-blue" /></StyledTabletd>
        <StyledTabletd className="w-[70px]">
            <button type='button' value={music_id} onClick={(e) => clickPlaylistModalOpen(e, music_id, img)}>
                <RiFolderAddLine className="ml-[13px] mt-[4px] text-[24px] text-gray-500 cursor-pointer hover-text-blue" />
            </button>
        </StyledTabletd>
        <StyledTabletd className="text-center w-[70px] relative" ref={moreboxRef}><RiMore2Line className="m-auto text-[24px] text-gray-500 cursor-pointer hover-text-blue" onClick={() => {setIsSearchMode(!isSearchMode);}}/>
            {
                isSearchMode ?
                <StyledMusicMenu ref={searchInputRef} bgcolor={chkboxChecked}>
                    <ul>
                        <li><Link to={"/detail/track/"+music_id+"/details"} className="flex items-center"><RiMusic2Line /><p>곡 정보</p></Link></li>
                        <li><Link to={"/detail/album/"+album_id+"/albumtrack"} className="flex items-center"><RiAlbumLine /><p>앨범 정보</p></Link></li>
                        <li><Link to={"/detail/artist/"+artist_num+"/artisttrack"} className="flex items-center"><RiMicLine /><p>아티스트 정보</p></Link></li>
                        {
                            likeyVal === true || likey === "alltrue" ?
                            <li className="flex items-center cursor-pointer" onClick={delLikeyFunc}><RiHeart3Fill className="text-blue"/><p>종아요</p></li>
                            :
                            <li className="flex items-center cursor-pointer" onClick={addLikeyFunc}><RiHeart3Line /><p>종아요</p></li>
                        }
                        <li><Link to="#" className="flex items-center"><RiProhibitedLine /><p>이곡 안듣기</p></Link></li>
                    </ul>
                </StyledMusicMenu>
                :
                ""
            }
        </StyledTabletd>
    </StyledTableTr>
    </>
    )
}

export const StyledTableTr = styled.tr`

`

export const StyledTabletd = styled.td`
    font-size: 13px;
    vertical-align: middle;
`

export const StyledMusicMenu = styled.div`
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
        color: var(--main-theme-color);
    }


`

export default MusicListCard