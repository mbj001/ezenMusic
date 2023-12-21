import React, {useState, useEffect, useRef, useContext} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import Axios from "axios"
import { Cookies } from 'react-cookie';
import { AppContext } from '../App'

// 승렬
import { MusicListCardPlayButton as PlayButton } from '../style/StyledIcons';
import { MusicListCardAddPlaylistButton as AddPlaylistButton } from '../style/StyledIcons';
import { MusicListCardAddMyListButton as AddMyListButton } from '../style/StyledIcons';
import { MusicListCardSeeMoreButton as SeeMoreButton } from '../style/StyledIcons';

function MusicListCard({lank, music_title, album_title, artist_id, artist_name, img, music_id, album_id, 
                        clickPlaylistModalOpen, likey, handleLikeypage, setLikeyBannerOn, handleRender,
                        setLoginrRequestVal, selectMusic, setPlayerBannerOn, setAddplayerCount, page, index, checked}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));
    
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
        <StyledTabletd className="text-center">
            <input type="checkbox" checked={checked} id={music_id} onClick={(e) => {selectMusic(e, index)}} readOnly />
        </StyledTabletd>

        { lank && <StyledTabletd className="text-center"><p className="text-black font-black">{lank}</p></StyledTabletd> }
        {/* 앨범 */}

        {/* 12.14 수정 */}
        {/* detailmylistaddmusic은 오직 해당 재생목록에 음악을 추가하는 기능만 넣을거라 그 외 기능(링크)는 제거 */}
        {/* 원상복구 하려면 조건 아래꺼만 쓰면 됨 */}
        {
            page === "detailmylistaddmusic"?
            <>
                <StyledTabletd className="d-flex items-center">
                    <div className="min-w-[60px] w-[60px] min-h-[60px] h-[60px] rounded-[5px] overflow-hidden border-[0.5px] M-img-border">
                        <img src={"/image/album/" + img} alt="img02" className="w-full h-full object-cover"/>
                    </div>
                    <div className="album-and-music ml-[20px] whitespace-nowrap overflow-hidden">
                        <p className="music-title mb-[5px]">
                            {music_title}
                        </p>
                        <p className="album-title text-gray-light font-normal text-[12px]">
                            {album_title}
                        </p>
                    </div> 
                </StyledTabletd>
                {/* 아티스트 */}
                <StyledTabletd className="w-[250px]">
                    <MoveToArtistPageNOTLink>
                        <span>{artist_name}</span>
                    </MoveToArtistPageNOTLink>
                </StyledTabletd>
            </>
            :
            <>
                <StyledTabletd className="d-flex items-center">
                    <Link to={"/detail/album/" + album_id + "/albumtrack"}>
                        <div className="min-w-[60px] w-[60px] min-h-[60px] h-[60px] rounded-[5px] overflow-hidden border-[0.5px] M-img-border">
                            <img src={"/image/album/" + img} alt="img02" className="w-full h-full object-cover"/>
                        </div>
                    </Link>
                    <div className="album-and-music ml-[20px] whitespace-nowrap overflow-hidden">
                        <p className="music-title mb-[5px] cursor-pointer" onClick={(e) => addPlayerlistFunc(e, 1)}>
                            {music_title}
                        </p>
                        <p className="album-title text-gray-light font-normal text-[12px]">
                            <Link to={"/detail/album/" + album_id + "/albumtrack"}>{album_title}</Link>
                        </p>
                    </div> 
                </StyledTabletd>
                {/* 아티스트 */}
                <StyledTabletd className="w-[250px]">
                    <MoveToArtistPageLink>
                        <Link to={"/detail/artist/"+artist_id+"/track?sortType=POPULARITY"}>{artist_name}</Link>
                    </MoveToArtistPageLink>
                </StyledTabletd>
            </>
        }
        {
            page !== "detailmylistaddmusic" &&
            <>
            <StyledTabletd className="m-auto w-[70px]">
                <PlayButton className="ml-1 mt-[2px]" onClick={isSessionValid? (e) => addPlayerlistFunc(e, 1) : () => setLoginrRequestVal(true)}/>
            </StyledTabletd>
            <StyledTabletd className="w-[70px]">
                <AddPlaylistButton className="ml-2 mt-[2px]" onClick={isSessionValid? (e) => addPlayerlistFunc(e, -1) : () => setLoginrRequestVal(true)} ></AddPlaylistButton>
            </StyledTabletd>
            <StyledTabletd className="w-[70px]">
                <AddMyListButton className="ml-2 mt-[2px]" onClick={isSessionValid? (e) => clickPlaylistModalOpen(e, music_id, img) : () => setLoginrRequestVal(true)}></AddMyListButton>
            </StyledTabletd>
            <StyledTabletd className="text-center w-[70px] relative" ref={moreboxRef}>
                <SeeMoreButton className="mt-[3px]" onClick={() => {setIsSearchMode(!isSearchMode)}}></SeeMoreButton>
                {
                    isSearchMode ?
                    <StyledMusicMenu ref={searchInputRef}>
                        <ul>
                            <li><Link to={"/detail/track/"+music_id+"/details"} className="flex items-center"><RiMusic2Line /><p>곡 정보</p></Link></li>
                            <li><Link to={"/detail/album/"+album_id+"/albumtrack"} className="flex items-center"><RiAlbumLine /><p>앨범 정보</p></Link></li>
                            <li><Link to={"/detail/artist/"+artist_id+"/track?sortType=POPULARITY"} className="flex items-center"><RiMicLine /><p>아티스트 정보</p></Link></li>
                            {
                                likey === true || likeyVal === true ?
                                <li className="flex items-center cursor-pointer" onClick={isSessionValid? () => delLikeyFunc() : () => setLoginrRequestVal(true)}><RiHeart3Fill className="text-blue"/><p>좋아요</p></li>
                                :
                                <li className="flex items-center cursor-pointer" onClick={isSessionValid? () => addLikeyFunc() : () => setLoginrRequestVal(true)}><RiHeart3Line /><p>좋아요</p></li>
                            }
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
export default MusicListCard

const StyledTableTr = styled.tr`
    input[type=checkbox]{
        accent-color: var(--main-theme-color);
        border-color: #d9d9d9;
    }
`
//승렬
const MoveToArtistPageLink = styled.p`
    a{
        max-width: 200px;
        min-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 15px;
        color: #333;
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
`;
// 건우
const MoveToArtistPageNOTLink = styled.p`
    span{
        max-width: 200px;
        min-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 15px;
        color: #333;
        cursor: pointer;
        &:hover{
            text-decoration: underline;
        }
    }
`;

export const StyledTabletd = styled.td`
    font-size: 13px;
    vertical-align: middle;
    .album-and-music{
        .music-title{
            max-width: 350px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 15px;
            color: #333;
            font-weight: 400;
        }
        .album-title{
            max-width: 350px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 13px;
            color: #969696;
            font-weight: 300;
        }
    }
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

