import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import styled from 'styled-components'
import { userid_cookies } from '../config/cookie';
import { Link } from 'react-router-dom';
import { RiPlayListAddFill, RiFolderAddLine, RiArrowRightSLine, RiPlayListAddLine, RiCheckFill } from "react-icons/ri";
import { StyledMylistDiv } from './LikeTrack';
import LoginRequest from '../card/LoginRequest';
import MylistSelectModal from '../modal/MylistSelectModal';
import MylistDeleteConfirm from '../modal/MylistDeleteConfirm';
import { AppContext } from '../App'
import PlaylistAdd from '../modal/PlaylistAdd';
import icons from '../assets/sp_button.6d54b524.png'
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import PlayerBanner from '../card/PlayerBanner';

function LikeAlbum({division, handleRender}) {
    // LSR
    // 로그아웃한 상태에서 쿠키에 character.sid 아무렇게나 만들어두면 userid_cookies에 이상한 값 들어가면서 
    // LoginRequest 페이지가 풀려버려서 app.js에서 뿌려주는 context 추가했어요
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
    const clickToEditMode = async(e) =>{
        e.preventDefault();
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
                array.push(likeAlbumList[i].album_id);
            }
        }


        Axios.post("/ezenmusic/likey/delLikeAlbum", {
            character_id: userid_cookies,
            likey_id_array: array,
            division: "likealbum" 
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

    // 2023-12-01 album 플레이어 추가
    function playerAdd(album_id){

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "albumtrack",
            album_id: album_id
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }


     //////////// 건우 ////////////
     const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
     const [playlistModalData, setPlaylistModalData] = useState([]);
     const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);
 
     function handleplaylistModal(){
         setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
     }
 
     const clickPlaylistModalOpen = (e, album_id, img) =>{
         e.preventDefault();
         setPlaylistModalData({
             music_id: null,
             album_id: album_id,
             thumbnail_image: img,
             theme_playlist: null
         });
         setPlaylistModalOpen(true);
     }
     ///////////////////////////////


    useEffect(() => {
        if(userid_cookies !== undefined){
            Axios.post("/ezenmusic/storage/likealbum", {
                character_id: userid_cookies,
                division: division
            })
            .then(({data}) => {
                if(data === -1){
                    setHasLikeyList(false);
                }
                else{
                    setLikeAlbumList(data);
                    setHasLikeyList(true);
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
            
            isSessionValid && userid_cookies ?
            <>
            {
                !hasLikeyList ?
                <StyledMylistDiv className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] h-[450px] flex flex-wrap justify-center items-center mx-auto'>
                    <div className='text-center'>
                        <img src="/image/nolike.svg" alt="nolike" className=' ml-16'/>
                        <p className='pt-2 font-bold'>좋아요 한 앨범이 없어요</p>
                        <p className='pt-1'>좋아요를 많이 할수록 Ezenmusic과 가까워 져요</p>
                    </div>
                </StyledMylistDiv>
            :
            <StyledLikeAlbum>
                {/* 편집 후 선택하면 나오는 베너 */}
                { selectedIcon && <MylistSelectModal clickToSelectdelAllPlaylist={clickToSelectdelAllPlaylist} handleDeleteConfirm={handleDeleteConfirm} /> }
                { deleteConfirm && <MylistDeleteConfirm delPlaylist={delPlaylist} handleDeleteConfirm={handleDeleteConfirm}/> }
                {
                    // Not EditMode
                    !editMode?
                    <div className='col-12 flex justify-end mb-[30px]'>
                        <span className='edit cursor-pointer text-[13px]' onClick={clickToEditMode}>편집</span>
                    </div>
                    :
                    <div className='col-12 flex justify-between mb-[30px]'>
                        <span className='select-all flex cursor-pointer text-[13px]' onClick={ selectedAll? handleDeleteNone  : handleDeleteAll}><RiCheckFill className='mt-[3px] mr-[3px]'/> 전체선택</span>
                        <span className='edit cursor-pointer text-[13px]' style={{color: "var(--main-theme-color)"}} onClick={clickToEditMode}>완료</span>
                    </div>

                }
                {

                
                    likeAlbumList.map((item, index) => (
                        <div key={index} className="relative w-[440px] flex items-center mb-[40px]">
                            {
                                editMode &&
                                <div className='checkbox rounded-full overflow-hidden cursor-pointer'>
                                    <RiCheckFill className={ item.delcheckVal? 'selected w-full h-full text-[20px]' : 'checkbox-icon w-full h-full text-[20px]' } onClick={(e) => clickToSelectPlaylist(e, index)} />
                                </div>
                            }
                            <Link to={"/detail/album/"+item.album_id+"/albumtrack"}><img src={"/image/album/"+item.org_cover_image} alt="cover_image" className={ item.delcheckVal? "w-[175px] h-[175px] min-w-[175px] rounded-[10px] brightness-75" : "w-[175px] h-[175px] min-w-[175px] rounded-[10px]"} /></Link>
                            <div className="ml-[20px]">
                                <Link to={"/detail/album/"+item.album_id+"/albumtrack"}><p className="font-bold mb-[5px] hover-text-blue">{item.album_title}</p></Link>
                                <Link to={"/detail/artist/"+item.artist_id+"/artisttrack"}><p className="text-[14px] mb-[10px] flex items-center">{item.artist_name}<RiArrowRightSLine className="text-[18px] mt-[3px]" /></p></Link>
                                <p className="text-[13px] mb-[2px]">{item.album_size}</p>
                                <p className="text-[12px] text-gray">{item.release_date_format}</p>
                                <div className="flex mt-[20px]">
                                    <button className="iconslistplus ml-[-3px] mr-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={(e) => playerAdd(item.album_id)}></button>
                                    <button className="iconsbox ml-2 mr-[2px]" style={{backgroundImage:`url(${icons})`}} onClick={(e) => clickPlaylistModalOpen(e, item.album_id, item.org_cover_image)} ></button>
                                </div>
                            </div>
                        </div>
                    ))
                }
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
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;

    img:hover{
        filter: brightness(70%)
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
export default LikeAlbum