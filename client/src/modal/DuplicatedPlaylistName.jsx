import React from 'react'
import styled from 'styled-components'

const DuplicatedPlaylistName = ({clickToModalClose}) => {
  return (
    <StyledDuplicatedPlaylistName>
        <div className="flex-col confirm-box">
            <p>동일한 내 리스트 명이 이미 존재합니다.</p>
            <button type='button' className='mt-[20px]' onClick={() => clickToModalClose()}>확인</button>
        </div>

    </StyledDuplicatedPlaylistName>
  )
}

const StyledDuplicatedPlaylistName = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    // background-color: black;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;

    .confirm-box{
        width: 400px;
        height: 150px;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        p{
            font-size: 14px;
        }
        button{
            width: 90px;
            height: 40px;
            font-size: 14px;
            border-radius: 5px;
            background-color: var(--main-theme-color);
            color: var(--main-text-white);
        }
    }
`

export default DuplicatedPlaylistName