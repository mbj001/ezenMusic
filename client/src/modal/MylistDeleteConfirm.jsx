import React from 'react'
import styled from 'styled-components'

const MylistDeleteConfirm = ({delPlaylist, dataLength, handleDeleteConfirm, page}) => {
  return (
    <StyledPlaylistDeleteConfirm>
        <div className="confirm-box">
            {
                dataLength === undefined?
                <>
                {
                    page === "detailmylist"?
                    <p className="text-[14px]">선택한 곡들이 삭제됩니다.</p>
                    :
                    <p className="text-[14px]">선택한 내 좋아요가 삭제됩니다.</p>
                }
                </>
                :
                <p className="text-[14px]">선택한 내 리스트 {dataLength.length}개가 삭제됩니다.</p>
            }
            <div className="confirm-button">
                <p className="mx-[10px] text-[15px] text-gray cursor-pointer border-1 border-gray-light px-[27px] py-[7px] rounded-[5px] hover-border-blue" onClick={() => handleDeleteConfirm()}>취소</p>  
                <p className="mx-[10px] text-[15px] text-white cursor-pointer border-1 border-blue bg-blue px-[27px] py-[7px] rounded-[5px] hover-bg-deepblue" onClick={() => delPlaylist()}>확인</p>
            </div>
        </div>

    </StyledPlaylistDeleteConfirm>
  )
}

const StyledPlaylistDeleteConfirm = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;


    .confirm-box{
        width: 400px;
        height: 160px;
        background-color: white;
        text-align: center;
        padding-top: 30px;
        border-radius: 7px;
    }
    
    .confirm-button{
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
`

export default MylistDeleteConfirm