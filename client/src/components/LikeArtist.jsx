import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import styled from 'styled-components'
import { Cookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { RiCheckFill } from "react-icons/ri";
import { StyledMylistDiv } from './LikeTrack';
import LoginRequest from '../card/LoginRequest';
import MylistSelectModal from '../modal/MylistSelectModal';
import MylistDeleteConfirm from '../modal/MylistDeleteConfirm';
import { AppContext } from '../App'
import { playerAdd } from '../procedure/playerAddButton';
import { PlayButton } from '../style/StyledIcons';
import PlayerBanner from '../card/PlayerBanner';

function LikeArtist({division, handleRender}) {
    
    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [likeAlbumList, setLikeAlbumList] = useState([]);
    const [hasLikeyList, setHasLikeyList] = useState(false);
    // Detete and Delete Confirm Variables
    const [editMode, setEditMode] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(false);
    const [renderPlaylistPage, setRenderPlaylistPage] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [selectedAll, setSelectedAll] = useState(false);
    // ~ Detete and Delete Confirm Variables

    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    // Delete and Delete Confirm Functions
    // edit mode click
    const clickToEditMode = async() =>{
        if(editMode == false){
            setEditMode(true);
        }else{
            setEditMode(false);
            // 완료 누르면 하단의 모달 꺼지게함
            setSelectedIcon(false);
            // 선택했던 항목들 false 로 리셋
            let array = [];
            for(let i=0; i<likeAlbumList.length; i++){
                array.push(likeAlbumList[i]);
                array[i].delcheckVal = false;
            }
            setLikeAlbumList(array);
            
        }
    }

    // checkbox click
    const clickToSelectPlaylist = async(e, index) =>{
        e.preventDefault();
        let delcheckArray = [];

        for(let i=0; i<likeAlbumList.length; i++){
            delcheckArray.push(likeAlbumList[i]);
        }

        delcheckArray[index].delcheckVal = !delcheckArray[index].delcheckVal;
        setLikeAlbumList(delcheckArray);

        for(let i=0; i<delcheckArray.length; i++){
            if(delcheckArray[i].delcheckVal === true){
                setSelectedIcon(true);
                break;
            }
            if(i === delcheckArray.length - 1){
                setSelectedIcon(false);
            }
        }
    }


    const clickToSelectdelAllPlaylist = () => {
        setSelectedIcon(false);

        let delcheckArray = [];

        for(let i=0; i<likeAlbumList.length; i++){
                delcheckArray.push(likeAlbumList[i]);
            if(delcheckArray[i].delcheckVal === true){
                delcheckArray[i].delcheckVal = false;
            }
        }

        setLikeAlbumList(delcheckArray);
    }


    const handleDeleteConfirm = () => {
        setDeleteConfirm(() => {return !deleteConfirm});
    }


    const delPlaylist = () => {
        let array = [];
        for(let i=0; i<likeAlbumList.length; i++){
            if(likeAlbumList[i].delcheckVal === true){
                array.push(likeAlbumList[i].artist_id);
            }
        }
        Axios.post("/ezenmusic/likey/delLikeAlbum", {
            character_id: userid_cookies,
            likey_id_array: array,
            division: division
        })
        .then(({data}) => {
            setSelectedIcon(false);
            handleDeleteConfirm();
            setRenderPlaylistPage(!renderPlaylistPage);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const handleDeleteAll = () => {
        setSelectedIcon(true);

        let delcheckArray = [];

        for(let i=0; i<likeAlbumList.length; i++){
            delcheckArray.push(likeAlbumList[i]);
            delcheckArray[i].delcheckVal = true;
        }
        setSelectedAll(true);
        setLikeAlbumList(delcheckArray);
    }
    
    const handleDeleteNone = () => {
        setSelectedAll(false);
        let delcheckArray = [];
        
        for(let i=0; i<likeAlbumList.length; i++){
            delcheckArray.push(likeAlbumList[i]);
            delcheckArray[i].delcheckVal = false;
        }
    
        setSelectedIcon(false);
        setLikeAlbumList(delcheckArray);
    }
    // ~ Delete and Delete Confirm Functions

    useEffect(() => {
        if(isSessionValid){
            Axios.post("/ezenmusic/storage/likeartist", {
                character_id: userid_cookies,
                division: division
            })
            .then(({data}) => {
                if(data === -1){
                    setHasLikeyList(false);
                }
                else{
                    for(let i=0; i<data.length; i++){
                        data[i].delcheckVal = false;
                    }
                    setHasLikeyList(true);
                    setLikeAlbumList(data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [renderPlaylistPage])

    return (
        <>
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
        {
            isSessionValid ?
            <>
            {
                !hasLikeyList?
                <StyledMylistDiv className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] h-[450px] flex flex-wrap justify-center items-center mx-auto'>
                    <div className='text-center'>
                    <img src="/image/nolike.svg" alt="nolike" className=' ml-16'/>
                    <p className='pt-2 font-bold'>좋아요 한 아티스트가 없어요</p>
                    <p className='pt-1'>좋아요를 많이 할수록 Ezenmusic과 가까워 져요</p>
                </div>
            </StyledMylistDiv>
            :
            <StyledLikeAlbum>
                { selectedIcon && <MylistSelectModal clickToSelectdelAllPlaylist={clickToSelectdelAllPlaylist} handleDeleteConfirm={handleDeleteConfirm} /> }
                { deleteConfirm && <MylistDeleteConfirm delPlaylist={delPlaylist} handleDeleteConfirm={handleDeleteConfirm}/> }
                {
                    // Not EditMode
                    !editMode?
                    <div className='col-12 flex justify-end mb-[30px]'>
                        <span className='edit cursor-pointer text-[13px]' onClick={() => clickToEditMode()}>편집</span>
                    </div>
                    :
                    <div className='col-12 flex justify-between mb-[30px]'>
                        <span className='select-all flex cursor-pointer text-[13px]' onClick={ selectedAll? () => handleDeleteNone()  : () => handleDeleteAll()}><RiCheckFill className='mt-[3px] mr-[3px]'/> 전체선택</span>
                        <span className='edit cursor-pointer text-[13px]' style={{color: "var(--main-theme-color)"}} onClick={() => clickToEditMode()}>완료</span>
                    </div>

                }
                <div className='grid-main'>
                {
                    likeAlbumList.map((item, index) => (
                        <div key={index} className="relative album-box w-[450px] flex items-center mb-[40px]">
                            {
                                editMode &&
                                <div className='checkbox rounded-full overflow-hidden cursor-pointer'>
                                    <RiCheckFill className={ item.delcheckVal? 'selected w-full h-full text-[20px]' : 'checkbox-icon w-full h-full text-[20px]' } onClick={(e) => clickToSelectPlaylist(e, index)} />
                                </div>
                            }
                            <div className='relative img-box'>
                                <Link to={"/detail/artist/"+item.artist_id+"/track?sortType=POPULARITY"}>
                                    <div className={ item.delcheckVal? "border-1 M-img-border w-[175px] h-[175px] rounded-[50%] brightness-75 overflow-hidden" : "border-1 M-img-border w-[175px] h-[175px] rounded-[50%] overflow-hidden"}>
                                        <img src={"/image/artist/"+item.org_artist_image} alt="cover_image" className="w-full h-full object-cover" />
                                    </div>
                                </Link>
                                {/* 좋아요 페이지는 로그인 체크 필요 x */}
                                <PlayButton className='absolute bottom-[5px] right-0' onClick={()=> playerAdd("like_artist", item.artist_id, handleRender, setPlayerBannerOn)}> </PlayButton>
                            </div>
                            <div className="ml-[20px]">
                                <Link to={"/detail/artist/"+item.artist_id+"/track?sortType=POPULARITY"}><p className="font-bold mb-[7px] hover-text-blue">{item.artist_name}</p></Link>
                                <p className="text-[11px] mb-[10px] flex items-center text-gray">
                                    {item.artist_class === "solo" && "솔로"} 
                                    {item.artist_class === "duo" && "듀오"} 
                                    {item.artist_class === "group" && "그룹"}  
                                    <span className="px-[5px] text-[7px]">|</span>                                     
                                    {item.artist_gender === "male" && "남성"}
                                    {item.artist_gender === "duo" && "듀오"}
                                    {item.artist_gender === "female" && "여성"} 
                                    <span className="px-[5px] text-[7px]">|</span> {item.genre}
                                </p>
                                <p className="text-[13px] mb-[2px]">{item.album_size}</p>
                                <p className="text-[12px] text-gray">{item.release_date_format}</p>
                            </div>
                        </div>
                    ))
                }
                </div>
            </StyledLikeAlbum>
            }
            </>
            :
            <LoginRequest />
        }
        </>
    )
}

export const StyledLikeAlbum = styled.div`
    .grid-main{
        @media (min-width: 1024px){ 
            width: 100%;
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
        }
        @media (max-width: 1024px){
            width: 100%;
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
    }
    // margin-bottom: 20px;
    // display: flex;
    // flex-wrap: wrap;

    img:hover{
        filter: brightness(70%)
    }
    // .img-box{
    //     border: 1px solid #efefef;
    //     border-radius: 50%;
    // }

    .edit:hover{
        color: var(--main-theme-color);
    }
    .select-all:hover{
        color: var(--main-theme-color);
    }
    .checkbox{
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 99;
        width: 35px;
        height: 35px;
        // border-radius: 20px;
    .checkbox-icon{
        background-color: var(--main-text-gray-lighter);
        color: var(--main-text-white);
        font-size: 25px;
    }
    
    .selected{
        background-color: var(--main-theme-color);
        color: var(--main-text-white);
        font-size: 25px;
    }
    }
`

export default LikeArtist   