import React from 'react'
import styled from 'styled-components'

const ChangePhoneSuccess = ({setModalOpen}) => {
    const closeModal = async() =>{
        setModalOpen(false);
        window.location = '/';
    }
    return (
        <StyledModal>
            <div className='modal-box'>
                <p>
                    전화번호 변경이 완료됐습니다.<br/>메인 페이지    로 이동합니다.
                </p>
                <button type='button' onClick={() => closeModal()}>
                    확인
                </button>
            </div>
        </StyledModal>
    )
}

export default ChangePhoneSuccess

const StyledModal = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999999999999999999999999999999;
    background-color: rgba(0,0,0,0.6);
    .modal-box{
        position: fixed;
        top: 40%;
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
            margin-bottom: 28px;
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