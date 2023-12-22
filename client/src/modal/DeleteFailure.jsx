import React from 'react'
import styled from 'styled-components'

const DeleteFailure = ({setModalOpen}) => {
    const closeModal = () =>{
        setModalOpen(false);
    }

    return (
        <StyledInnerModal>
            <div className='inner-modal-box'>
                <p>
                    하나의 캐릭터만 남아 있어 삭제할 수 없습니다.
                </p>
                <div className='button-box'>
                    <button type='button' onClick={() => closeModal()}>
                        확인
                    </button>
                </div>
            </div>
        </StyledInnerModal>
    )
}

export default DeleteFailure

const StyledInnerModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999999999999;
    background-color: rgba(0,0,0,0.6);
    .inner-modal-box{
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
        }
        .button-box{
            width: 100%;
            
            margin-top: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            button{
                width: 100px;
                height: 36px;
                padding: 0 15px;
                font-size: 14px;
                line-height: 36px;
                text-align: center;
                background-color: var(--main-theme-color);
                color: var(--main-text-white);
                
                border: 1px solid var(--main-theme-color);
                border-radius: 5px;
                &:hover{
                    background-color: var(--main-theme-color-hover);
                }
            }
        }
    }
`;