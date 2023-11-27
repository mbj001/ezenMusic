import React from 'react'
import styled from 'styled-components'

const LogoutConfirm = ({setModalOpen}) => {
    const closeModal = () =>{
        setModalOpen(false);
    }
    return (
        <StyledModal>
            <div className='modal-box'>
                <p>
                    로그아웃하시겠습니까?
                </p>
                <button type='button' className='cancel' onClick={closeModal}>
                    취소
                </button>
                <button type='button' className='logout'>
                    확인
                </button>
            </div>
        </StyledModal>
    )
}

export default LogoutConfirm

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
        .cancel{
            width: 85px;
            height: 36px;
            padding: 0 15px;
            font-size: 14px;
            line-height: 36px;
            color: var(--text-main-gray);
            border-color: var(--text-main-gray);
            text-align: center;
            background-color: #ffffff;
            border-radius: 5px;
            &:hover{
                color: #3f3fff;
                border-color: #3f3fff;
            }
        }
        .logout{
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