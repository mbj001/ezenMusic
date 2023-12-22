import React from 'react'
import styled from 'styled-components'

const ConfirmDeleteCharacter = ({setModalOpen, setKeepGoing}) => {
    const closeModal = () =>{
        setModalOpen(false);
    }
    const cancel = () =>{
        setKeepGoing(false);
        closeModal();
    }
    const keepGo = () =>{
        setKeepGoing(true);
        closeModal();
    }
    return (
        <StyledInnerModal>
            <div className='inner-modal-box'>
                <p>
                    캐릭터를 삭제하시겠습니까?
                </p>
                <div className='button-box'>
                    <button type='button' className='cancel' onClick={() => cancel()}>
                        취소하기
                    </button>
                    <button type='button' className='submit' onClick={() => keepGo()}>
                        삭제하기
                    </button>
                </div>
            </div>
        </StyledInnerModal>
    )
}

export default ConfirmDeleteCharacter

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
                border-radius: 5px;
            }
            .submit{
                margin-left: 15px;
                background-color: var(--main-theme-color);
                color: #fff;
                &:hover{
                    background-color: var(--main-theme-color-hover);
                }
            }
            .cancel{
                background-color: var(--main-text-white);
                color: var(--main-text-black);
                border: 1px solid var(--main-text-gray-lighter);
                &:hover{
                    color: var(--main-theme-color);
                    border: 1px solid var(--main-theme-color);
                }
            }
        }
    }
`;