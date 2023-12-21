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
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import PlayerBanner from '../card/PlayerBanner';
import PlaylistAdd from '../modal/PlaylistAdd';
import { AppContext } from '../App'

//승렬
import { MusicListCardAddMyListButton as AddMyListButton } from '../style/StyledIcons';
import { MusicListCardAddPlaylistButton as AddPlaylistButton } from '../style/StyledIcons';
import { TransTinyPlayButton as PlayButton } from '../style/StyledIcons';

function LikeTheme({division, handleRender}) {

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


    // 2023-12-01 album 플레이어 추가
    function playerAdd(themeplaylist_id, change_now_play){

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "liketheme",
            themeplaylist_id: themeplaylist_id,
            change_now_play: change_now_play
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
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
                array.push(likeAlbumList[i].themeplaylist_id);
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



    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, themeplaylist_id) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: null,
            album_title: null,
            thumbnail_image: null,
            theme_playlist: themeplaylist_id
        });
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////



    useEffect(() => {
        if(isSessionValid){
            Axios.post("/ezenmusic/storage/liketheme", {
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
    {/* 플레이리스트 추가 베너 */}
    { playlistModalOpen && <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
    {/* 플레이리스트 추가 베너 */}
    { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
    { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
    {
        isSessionValid ?
        <>
        {
            !hasLikeyList?
            <StyledMylistDiv className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] h-[450px] flex flex-wrap justify-center items-center mx-auto'>
                <div className='text-center'>
                    <img src="/image/nolike.svg" alt="nolike" className=' ml-16'/>
                    <p className='pt-2 font-bold'>좋아요 한 리스트가 없어요</p>
                    <p className='pt-1'>좋아요를 많이 할수록 Ezenmusic과 가까워 져요</p>
                </div>
            </StyledMylistDiv>
            :
            <StyledLikeTheme className="md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] m-auto flex flex-wrap mt-4 mb-5">
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
                        <span className='select-all flex cursor-pointer text-[13px]' onClick={ selectedAll? () => handleDeleteNone() : () => handleDeleteAll()}><RiCheckFill className='mt-[3px] mr-[3px]'/> 전체선택</span>
                        <span className='edit cursor-pointer text-[13px]' style={{color: "var(--main-theme-color)"}} onClick={() => clickToEditMode()}>완료</span>
                    </div>
                }
                <div className='grid-main'>
                {
                    likeAlbumList.map((item, index) => (
                        <div key={index} className="flex relative mb-[40px]">
                            {
                                editMode &&
                                <div className='checkbox rounded-full overflow-hidden cursor-pointer'>
                                    <RiCheckFill className={ item.delcheckVal? 'selected w-full h-full text-[20px]' : 'checkbox-icon w-full h-full text-[20px]' } onClick={(e) => clickToSelectPlaylist(e, index)} />
                                </div>
                            }
                            <div className="min-w-[175px] min-h-[175px] relative img-box">
                                <Link to={"/detail/channel/"+item.themeplaylist_id}><img src={"/image/themeplaylist/"+item.org_cover_image} alt="cover_image" className={ item.delcheckVal? "w-[175px] h-[175px] rounded-[6px] brightness-75" : "w-[175px] h-[175px] rounded-[6px]" } /></Link>
                                <PlayButton  onClick={(e) => playerAdd(item.themeplaylist_id, true)}></PlayButton>
                            </div>
                            <div className="mt-[15px] ml-[19px] flex flex-col">
                                <Link to={"/detail/channel/"+item.themeplaylist_id}>
                                    <p className="font-bold mb-[5px] w-[200px] hover-text-blue whitespace-nowrap text-ellipsis overflow-hidden">{item.themeplaylist_title}</p>
                                </Link>
                                <p className="text-[13px] mt-[10px] mb-[2px]">총 {item.count}곡</p>
                                <p className="text-[12px] text-gray">{item.release_date_format}</p>
                                <div className="flex mt-[33px] ml-[-9px]">
                                    <AddPlaylistButton onClick={(e) => playerAdd(item.themeplaylist_id, false)}></AddPlaylistButton>
                                    <AddMyListButton onClick={(e) => clickPlaylistModalOpen(e, item.themeplaylist_id)}></AddMyListButton>
                                </div>
                            </div>
                        </div>
                    ))
                }
                </div>
            </StyledLikeTheme>
        }
        </>
        :
        <LoginRequest />
    }
    </>
    )
}

export const StyledLikeTheme = styled.div`
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
    .img-box{
        border: 1px solid #efefef;
        border-radius: 6px;
    }

    .edit:hover{
        color: var(--main-theme-color);
      }
      .select-all:hover{
        color: var(--main-theme-color);
      }
      .checkbox{
        position: absolute;
        top: 10px;
        left: 20px;
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

export default LikeTheme