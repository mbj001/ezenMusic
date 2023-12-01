import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

function PleaseLoginMessage({setLoginrRequestVal}) {
    return (
    <StyledLoginMessageModal>
        <div className="modal-box">
            <p className="text-[14px]">로그인이 필요한 서비스입니다.</p>
            <p className="text-[14px]">로그인 하시겠습니까?</p>
            <div className="mt-[50px]">
                <span className="text-[13px] border-1 border-gray-light hover-border-blue text-blue mr-[10px] px-[27px] py-[7px] rounded-[5px] cursor-pointer" onClick={() => setLoginrRequestVal(false)}>취소</span>
                <Link to="/signin" className="text-[13px] border-1 border-blue bg-blue text-white px-[27px] py-[7px] rounded-[5px] hover-bg-deepblue cursor-pointer">확인</Link>
            </div>
        </div>
    </StyledLoginMessageModal>
    )
}


export const StyledLoginMessageModal = styled.div`
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

    .modal-box{
        width: 400px;
        height: 180px;
        background-color: white;
        border-radius: 10px;
        text-align: center;
        padding-top: 30px;
    }
`
export default PleaseLoginMessage