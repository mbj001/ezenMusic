import React from 'react'
import styled from 'styled-components'
import { IoCheckmark, IoPlayOutline } from "react-icons/io5";
import { TbPlaylistAdd } from "react-icons/tb";
import { PiFolderSimplePlus } from "react-icons/pi";
import Axios from "axios";
import { Cookies } from 'react-cookie';

function AllCheckedModal({setAllcheckVal, selectedMusicList, handleRender, setPlayerBannerOn, setAddplayerCount}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    function checkedPlayerAdd(changeVal){
        console.log("듣기 추가 목록");
        console.log(selectedMusicList);

        Axios.post("http://localhost:8080/playerhandle/checklistAdd", {
            userid: userid_cookies,
            
            // select 한 음악 id 들어있는 배열 전달
            music_list: selectedMusicList,
            change_now_play: changeVal
        })
        .then(({data}) => {
            setAddplayerCount(selectedMusicList.length);
            setPlayerBannerOn(true);
            // allcheckedmodal 모달 해제
            setAllcheckVal(false)
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return (
    <StyledAllCheckModal className="flex items-center justify-between rounded-[10px]">
        <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer" onClick={() => {setAllcheckVal(false)}}>
            <p><IoCheckmark className="modal-icon m-auto" /></p>
            <p className="mt-[5px]">선택해제</p>
        </div>
        <div className="middle-line"></div>
        <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer" onClick={(e) => checkedPlayerAdd(true)}>
            <p><IoPlayOutline className="modal-icon m-auto"  /></p>
            <p className="mt-[5px]">듣기</p>
        </div>
        <div className="middle-line"></div>
        <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer" onClick={(e) => checkedPlayerAdd(false)}>
            <p><TbPlaylistAdd className="modal-icon m-auto"  /></p>
            <p className="mt-[5px]">재생목록</p>
        </div>
        <div className="middle-line"></div>
        <div className="w-[65px] text-center my-[20px] mx-[15px] cursor-pointer">
            <p><PiFolderSimplePlus className="modal-icon m-auto"  /></p>
            <p className="mt-[5px]">내 리스트</p>
        </div>
    </StyledAllCheckModal>
    )
}

export const StyledAllCheckModal = styled.div`
    position: fixed;
    bottom: 150px;
    background-color: #2563eb;
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