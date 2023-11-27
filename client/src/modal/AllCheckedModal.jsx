import React from 'react'
import styled from 'styled-components'
import { IoCheckmark, IoPlayOutline } from "react-icons/io5";
import { TbPlaylistAdd } from "react-icons/tb";
import { PiFolderSimplePlus } from "react-icons/pi";

function AllCheckedModal({setAllcheckVal}) {
  return (
    <StyledAllCheckModal className="flex items-center justify-between rounded-[10px]">
        <div className="text-center my-[20px] mx-[15px] cursor-pointer" onClick={() => {setAllcheckVal(false)}}>
            <p><IoCheckmark className="modal-icon m-auto" /></p>
            <p className="mt-[5px]">선택해제</p>
        </div>
        <div className="text-center my-[20px] mx-[15px] cursor-pointer">
            <p><IoPlayOutline className="modal-icon m-auto"  /></p>
            <p className="mt-[5px]">듣기</p>
        </div>
        <div className="text-center my-[20px] mx-[15px] cursor-pointer">
            <p><TbPlaylistAdd className="modal-icon m-auto"  /></p>
            <p className="mt-[5px]">재생목록</p>
        </div>
        <div className="text-center my-[20px] mx-[15px] cursor-pointer">
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
`

export default AllCheckedModal