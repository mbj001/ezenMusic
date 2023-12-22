import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const ResisterComplete = ({setModalOpen}) => {
    const closeModal = () =>{
        setModalOpen(false);
    }
    
    return (
        <StyledModal>
            <div className='modal-box'>
                <p className='mt-2 mb-7'>회원가입이 완료되었습니다.<br/>이용권을 구매하여 EZEN MUSIC을 즐겨보세요!</p>
                <div>
                    <Link to='../../signin'>
                        <button type='button' onClick={() => closeModal()}>
                            로그인페이지로 이동
                        </button>
                    </Link>
                </div>
            </div>
        </StyledModal>
    )
}

export default ResisterComplete

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
        div{
            width: 60%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            button{
                
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
    }
`;