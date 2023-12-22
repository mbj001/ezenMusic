import React from 'react'
import styled from 'styled-components'
import { IoCheckmark } from "react-icons/io5";
import { TbTrash } from "react-icons/tb";
function MylistSelectModal({clickToSelectdelAllPlaylist, handleDeleteConfirm}) {

  return (
    <StyledAllCheckModal className="flex items-center justify-between rounded-[10px]">
        <div className="text-center my-[20px] mx-[15px] cursor-pointer" onClick={() => clickToSelectdelAllPlaylist()}>
            <p><IoCheckmark className="modal-icon m-auto" /></p>
            <p className="mt-[5px]">선택해제</p>
        </div>
        <div className="middle-line"></div>
        <div className="text-center my-[20px] mx-[30px] cursor-pointer" onClick={() => handleDeleteConfirm()}>
            <p><TbTrash className="modal-icon m-auto"/></p>
            <p className="mt-[5px]" >삭제</p>
        </div>
    </StyledAllCheckModal>
  )
}

export const StyledAllCheckModal = styled.div`
    position: fixed;
    bottom: 150px;
    background-color: #3f3fff;
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

export default MylistSelectModal