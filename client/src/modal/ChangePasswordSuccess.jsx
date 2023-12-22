import React, { useState } from 'react'
import styled from 'styled-components'
import { getCookie, removeCookie } from '../config/cookie';
import axios from 'axios';

const ChangePasswordSuccess = ({setModalOpen}) => {
    const closeModal = async() =>{
        const removeOk = await axios.post('/verifiedClient/logout', {token: getCookie('connect.sid')});
        if(removeOk){
            // console.log('removeok = true')
            removeCookie('connect.sid');
            removeCookie('client.sid');
            // handleRender();
            window.localStorage.setItem('login', false);
            window.location='/signin';
            setModalOpen(false);
        }else{
            alert('서버와 연결에 실패했습니다. 잠시후에 시도해주세요.');
        }
    }
    return (
        <StyledModal>
            <div className='modal-box'>
                <p>
                    비밀번호를 변경하였습니다.<br/>로그인 페이지    로 이동합니다.
                </p>
                <button type='button' onClick={closeModal}>
                    확인
                </button>
            </div>
        </StyledModal>
    )
}

export default ChangePasswordSuccess

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