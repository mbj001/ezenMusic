import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine, RiHeart3Fill } from "react-icons/ri";
import Axios from "axios"
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import icons from '../assets/sp_button.6d54b524.png'
import { userid_cookies } from '../config/cookie';


function MusicListCard({lank, music_title, album_title, artist_id, artist_name, img, music_id, album_id, check_all, setAllcheckVal, 
                        clickPlaylistModalOpen, likey, handleLikeypage, setLikeyBannerOn, handleRender,
                        setLoginrRequestVal, selectMusic, setPlayerBannerOn, setAddplayerCount, page, index, checked}) {

    const searchInputRef = useRef(null);
    const moreboxRef = useRef(null);
    const [isSearchMode, setIsSearchMode] = useState(false); 
    const [likeyVal, setLikeyVal] = useState(false);


    // playerlist 추가
    function addPlayerlistFunc(e, addplayer){
        e.preventDefault();
        Axios.post("/playerHandle/addplayerlist",{
            character_id: userid_cookies,
            music_id: music_id,
            play_now: addplayer
        })
        .then(({data}) => {
            setAddplayerCount(1);
            setPlayerBannerOn(true);
            handleRender();
        })
    }

    function handleLikey(){
        setLikeyVal(likeyVal => {return !likeyVal});
    }
    
    useEffect(() => {
        setLikeyVal(likey);
    },[likey])


    function addLikeyFunc(){
        Axios.post("/ezenmusic/addlikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            setIsSearchMode(false); 
            setLikeyBannerOn(1)
            if(handleLikeypage){
                handleLikeypage();
            }
            else{
                handleLikey();
            }
            handleRender();

        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeyFunc(){
        Axios.post("/ezenmusic/dellikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            setIsSearchMode(false);
            setLikeyBannerOn(-1); 
            if(handleLikeypage){
                handleLikeypage();
            }
            else{
                // liketrack 페이지에서는 파랑하트 유지
                handleLikey();
            }
            handleRender();

        })
        .catch((err) => {
            console.log(err);
        })
    }

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
    
    useEffect(() => {
        
    }, [])
    
    return (    
    <>
    <StyledTableTr className={checked? "table-active" : ""}>
        
        <StyledTabletd className="text-center"><input type="checkbox" checked={checked} id={music_id} onClick={(e) => {selectMusic(e, index)}} readOnly /></StyledTabletd>
        { lank && <StyledTabletd className="text-center"><p className="text-black font-black">{lank}</p></StyledTabletd> }
        <StyledTabletd className="d-flex items-center">
            <Link to={"/detail/album/" + album_id + "/albumtrack"}>
                <div className="min-w-[60px] w-[60px] min-h-[60px] h-[60px] rounded-[5px] overflow-hidden border-[1px] M-img-border">
                    <img src={"/image/album/" + img} alt="img02" className="w-full h-full object-cover"/>
                </div>
            </Link>
            <div className="ml-[20px] whitespace-nowrap overflow-hidden">
                <p className="mb-[5px] cursor-pointer" onClick={(e) => addPlayerlistFunc(e, 1)}>{music_title}</p>
                <p className="text-gray-light font-normal text-[12px]"><Link to={"/detail/album/" + album_id + "/albumtrack"}>{album_title}</Link></p>
            </div> 
        </StyledTabletd>
        <StyledTabletd className="w-[250px]"><p><Link to={"/detail/artist/"+artist_id+"/artisttrack"}>{artist_name}</Link></p></StyledTabletd>
        {
            page === "detailmylistaddmusic"?
            ""
            :
            <>
            <StyledTabletd className="m-auto w-[70px]">
                {
                    userid_cookies?
                    <button className="artist_listen ml-1 mt-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={(e) => addPlayerlistFunc(e, 1)}/>
                    :
                    <button className="artist_listen ml-1 mt-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={setLoginrRequestVal}/>   
    
                }
            </StyledTabletd>
            <StyledTabletd className="w-[70px]">
                {
                    userid_cookies?
                    <button className="artist_listplus ml-2 mt-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={(e) => addPlayerlistFunc(e, -1)} ></button>
                    :
                    <button className="artist_listplus ml-2 mt-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={setLoginrRequestVal}></button>
                }
            </StyledTabletd>
            <StyledTabletd className="w-[70px]">
                {
                    userid_cookies?
                    <button className="artist_box ml-2 mt-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={(e) => clickPlaylistModalOpen(e, music_id, img)}></button>
                    :
                    <button className="artist_box ml-2 mt-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={setLoginrRequestVal}></button>
                }
            </StyledTabletd>
            <StyledTabletd className="text-center w-[70px] relative" ref={moreboxRef}><button className="see_more mt-[4px]" style={{backgroundImage:`url(${icons})`}} onClick={() => {setIsSearchMode(!isSearchMode)}}></button>
                {
                    isSearchMode ?
                    <StyledMusicMenu ref={searchInputRef}>
                        <ul>
                            <li><Link to={"/detail/track/"+music_id+"/details"} className="flex items-center"><RiMusic2Line /><p>곡 정보</p></Link></li>
                            <li><Link to={"/detail/album/"+album_id+"/albumtrack"} className="flex items-center"><RiAlbumLine /><p>앨범 정보</p></Link></li>
                            <li><Link to={"/detail/artist/"+artist_id+"/artisttrack"} className="flex items-center"><RiMicLine /><p>아티스트 정보</p></Link></li>
                            {
                                userid_cookies?
                                <>
                                {
                                    // likeyVal === true || likey === "alltrue" ?
                                    likey === true || likeyVal === true ?
                                    <li className="flex items-center cursor-pointer" onClick={delLikeyFunc}><RiHeart3Fill className="text-blue"/><p>좋아요</p></li>
                                    :
                                    <li className="flex items-center cursor-pointer" onClick={addLikeyFunc}><RiHeart3Line /><p>좋아요</p></li>
                                }
                                </>
                                :
                                <li className="flex items-center cursor-pointer" onClick={setLoginrRequestVal}><RiHeart3Line /><p>좋아요</p></li>
                            }
                            {/* <li><Link to="#" className="flex items-center"><RiProhibitedLine /><p>이곡 안듣기</p></Link></li> */}
                        </ul>
                    </StyledMusicMenu>
                    :
                    ""
                }
            </StyledTabletd>
            </>
        }
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
    border-radius: 5px;

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