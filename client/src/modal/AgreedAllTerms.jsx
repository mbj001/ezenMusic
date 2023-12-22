import React from 'react'
import styled from 'styled-components'

const AgreedAllTerms = ({setModalOpen}) => {
    const closeModal = () =>{
        setModalOpen(false);
    }
    const now = new Date();
    const agreedDate = `${now.getFullYear()}년 ${now.getMonth()+1}월 ${now.getDate()}일`;
    return (
        <StyledModal>
            <div className='modal-box'>
            <p>{agreedDate}</p>
            <p className='mt-2 mb-7'>EZEN MUSIC에서 보내는 이벤트/혜택 알림이<br/>수신 동의 처리되었습니다.</p>
                <button type='button' onClick={closeModal}>
                    확인
                </button>
            </div>
        </StyledModal>
    )
}

export default AgreedAllTerms

const StyledModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999999999999999999999999999999;
    background-color: rgba(0,0,0,0.6);
    .modal-box{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 200px;
        border-radius: 5px;
        background-color: var(--main-background-white);
        color: var(--main-text-black);
        opacity: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        p{
            font-size: 15px;
            line-height: 1.47;
            color: #484848;
            text-align: center;
        }
        button{
            width: 85px;
            height: 36px;
            padding: 0 15px;
            font-size: 14px;
            line-height: 36px;
            color: #fff;
            text-align: center;
            background-color: #3f3fff;
            border-radius: 5px;
        }
    }
`;