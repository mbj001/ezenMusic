import React, {useState, useContext} from 'react'
import styled from 'styled-components'
import { IoCheckmark, IoPlayOutline } from "react-icons/io5";
import { TbPlaylistAdd } from "react-icons/tb";
import { PiFolderSimplePlus } from "react-icons/pi";
import Axios from "axios";
import { Cookies } from 'react-cookie';
import { TbTrash } from "react-icons/tb";
import MylistDeleteConfirm from './MylistDeleteConfirm';
import PlaylistAdd from './PlaylistAdd';
import { RiAddLine } from "react-icons/ri";
import PleaseLoginMessage from './PleaseLoginMessage';
import { AppContext } from '../App'

function AllCheckedModal({setAllcheckVal, selectedMusicList, setSelectedMusicList, handleRender, setPlayerBannerOn, setAddplayerCount, page, handleLikeypage, 
    setDetailMylistAddMusicOpen, detailMylistAddMusicModalData, selectModalClose, setAddPlaylistBannerOn, playlist_id, handleDetailMylistPage}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [deleteConfirm, setDeleteConfirm] = useState(false);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    
    function checkedPlayerAdd(changeVal){

        Axios.post("/playerHandle/checklistAdd", {
            character_id: userid_cookies,
            music_list: selectedMusicList,          // select 한 음악 id 들어있는 배열 전달
            change_now_play: changeVal
        })
        .then(({data}) => {
            // 베너 정보
            setAddplayerCount(selectedMusicList.length);
            setPlayerBannerOn(true);
            // 모달 닫기 (allcheckedModal)
            selectModalClose();
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLiketrackRow(){
        Axios.post("/ezenmusic/likey/delLikeAlbum", {
            character_id: userid_cookies,
            division: "liketrack",
            likey_id_array: selectedMusicList
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            // allcheckedmodal 모달 해제
            setAllcheckVal(false);
            // // liketrack 페이지 새로고침
            handleLikeypage();
            setSelectedMusicList([]);
            handleRender();
        })
    }
    const handleDeleteConfirm = () => {
        setDeleteConfirm(() => {return !deleteConfirm});
    }

    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    // const [detailMylistModalData, setDetailMylistModalData] = useState([]);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = async(e) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: selectedMusicList,
            album_title: null,
            thumbnail_image: null,
            theme_playlist: null,
        });
        setPlaylistModalOpen(true);
    };

    const clickToDeleteMylistMusic = () =>{
        // console.log(selectedMusicList);
        Axios.post("/playlist/detail/detailmylist/deletemusic", {
            music_id: selectedMusicList,
            playlist_id: playlist_id,
            character_id: userid_cookies
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            // allcheckedmodal 모달 해제
            setAllcheckVal(false);
            // // liketrack 페이지 새로고침
            // handleLikeypage();
            handleDetailMylistPage();
            setSelectedMusicList([]);
            handleRender();
        })
    }

    const clickDetailMylistAddMusic = async(e) =>{
        e.preventDefault();
        const userData = {
            music_id: selectedMusicList,
            album_id: null,
            thumbnail_image: null,
            theme_playlist: null,
            character_id: userid_cookies,
            playlist_id: detailMylistAddMusicModalData[0],
            playlist_name: detailMylistAddMusicModalData[1]
        };
        await Axios.post(`/playlist/browse/addmusictoplaylist`, userData)
        .then(({data}) =>{
            // console.log("플레이리스트에 노래 추가됨");
            setDetailMylistAddMusicOpen(false);
        });
    };

    ///////////////////////////////

    return (
    <>
    { playlistModalOpen &&
        <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} 
        setPlayerBannerOn={setPlayerBannerOn} selectModalClose={selectModalClose} setAddPlaylistBannerOn={setAddPlaylistBannerOn}/>
    }
    { deleteConfirm && (page === "detailmylist" ? 
        <MylistDeleteConfirm delPlaylist={clickToDeleteMylistMusic} handleDeleteConfirm={handleDeleteConfirm} page={page}/> 
        :
        <MylistDeleteConfirm delPlaylist={delLiketrackRow} handleDeleteConfirm={handleDeleteConfirm} page={page}/>) 
    // { deleteConfirm && <MylistDeleteConfirm delPlaylist={delLiketrackRow} handleDeleteConfirm={handleDeleteConfirm} page={page}/>
    }        
    {/* 로그인 해주세요 모달 */}
    { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} />  }

    <StyledAllCheckModal className="flex items-center justify-between rounded-[10px]">
        <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer" onClick={() => {selectModalClose();}}>
            <p><IoCheckmark className="modal-icon m-auto" /></p>
            <p className="mt-[5px]">선택해제</p>
        </div>
        {
            page === "detailmylistaddmusic"?
            <>
                <div className="middle-line"></div>
                <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer" onClick={isSessionValid? (e) => clickDetailMylistAddMusic(e) : () => setLoginrRequestVal(true)}>
                    <p><RiAddLine className="modal-icon m-auto"  /></p>
                    <p className="mt-[5px]">추가</p>
                </div>
            </>
            :
            <>
            <div className="middle-line"></div>
            <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer" onClick={isSessionValid? (e) => checkedPlayerAdd(true) : () => setLoginrRequestVal(true)}>
                <p><IoPlayOutline className="modal-icon m-auto"  /></p>
                <p className="mt-[5px]">듣기</p>
            </div>
            <div className="middle-line"></div>
            <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer" onClick={isSessionValid? (e) => checkedPlayerAdd(false) : () => setLoginrRequestVal(true)}>
                <p><TbPlaylistAdd className="modal-icon m-auto"  /></p>
                <p className="mt-[5px]">재생목록</p>
            </div>
            <div className="middle-line"></div>
            <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer" onClick={isSessionValid? (e) => clickPlaylistModalOpen(e) : () => setLoginrRequestVal(true)}>
                <p><PiFolderSimplePlus className="modal-icon m-auto" /></p>
                <p className="mt-[5px]">내 리스트</p>
            </div>
            </>
        }
        {
            (page === "liketrack" || page === "detailmylist") &&
            <>
            <div className="middle-line"></div>
            <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer" onClick={() => handleDeleteConfirm()}>
                <p><TbTrash className="modal-icon m-auto"  /></p>
                <p className="mt-[5px]">삭제</p>
            </div>
            </>
        }

    </StyledAllCheckModal>
    </>
    )
}

export const StyledAllCheckModal = styled.div`
    position: fixed;
    bottom: 150px;
    background-color: #576aff;
    left: 50%;
    transform: translate(-50%, 0);  
    z-index: 500; 
    p{
        color: white;
    }

    .modal-icon{
        font-size: 30px;
    }

    .middle-line{
        width: 0px;
        height: 50px;
        border-left: 1px solid var(--main-text-gray-lighter);
    }
`

export default AllCheckedModal