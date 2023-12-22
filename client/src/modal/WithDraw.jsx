import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { IoCloseOutline } from "react-icons/io5";
import axios from 'axios';
import { getCookie, removeCookie } from '../config/cookie';

const WithDraw = ({setModalOpen}) => {
    const [ checked, setChecked ] = useState('');
    const [ directChecked, setDirectChecked ] = useState(false);
    const directRef = useRef();

    const checkRadio = (e) => {
        setChecked(e.target.value);
        if(e.target.value === 'direct'){
            setDirectChecked(true);
        }else{
            setDirectChecked(false);
        }
    }

    const closeModal = () =>{
        setModalOpen(false);
    }

    const withdraw = async() => {
        // console.log('*')
        if(window.confirm('정말 탈퇴하시겠습니까?')){
            const res = await axios.post('/verifiedClient/withdraw', {token: getCookie('connect.sid'), user_id: getCookie('client.sid')});
            // console.log(res);
            if(res.data.withdraw){
                window.location = '/';
                window.localStorage.setItem('login', false);
                removeCookie('client.sid');
                removeCookie('connect.sid');
            }
        }else{

        }
    }

    useEffect(()=>{
        if(directChecked){
            directRef.current.disabled = false;
            directRef.current.focus();
        }else{
            directRef.current.disabled = true;
        }
    }, [directChecked])


    return (
        <StyledModal>
            <div className='modal-box'>
            <button type='button' className='close' onClick={() => closeModal()}><IoCloseOutline /></button>
                <div>
                    <p className='title'>회원탈퇴</p>
                    <p className='reason-text'>떠나시려는 이유를 알려주세요. <br/>더 나은 EZEN MUSIC이 되도록 노력할게요.</p>
                    <form>
                        <label>
                            <input type="radio" onClick={(e) => checkRadio(e)} id='reason1' name='reason' value={'reason1'}/>
                            원하는 컨텐츠가 부족해요
                        </label>
                        <label>
                            <input type="radio" onClick={(e) => checkRadio(e)} id='reason2' name='reason' value={'reason2'}/>
                            기능이 부족/불편해요
                        </label>
                        <label>
                            <input type="radio" onClick={(e) => checkRadio(e)} id='reason3' name='reason' value={'reason3'}/>
                            오류가 잦아요
                        </label>
                        <label>
                            <input type="radio" onClick={(e) => checkRadio(e)} id='reason4' name='reason' value={'reason4'}/>
                            가격/혜택이 부족해요
                        </label>
                        <label>
                            <input type="radio" onClick={(e) => checkRadio(e)} id='reason5' name='reason' value={'reason5'}/>
                            서비스 정책이 마음에 안들어요
                        </label>
                        <label>
                            <input type="radio" onClick={(e) => checkRadio(e)} id='reason6' name='reason' value={'reason6'}/>
                            직접 가입하지 않았어요
                        </label>
                        <label>
                            <input type="radio" onClick={(e) => checkRadio(e)} id='reason6' name='reason' value={'direct'}/>
                            기타
                        </label>
                        <input type="text" id='direct-reason' name='direct-reason' disabled={true} ref={directRef} placeholder='탈퇴하시려는 이유를 알려주세요.'/>
                    </form>
                </div>
                <button type='button' className={checked ? 'withdrawButton active' : 'withdrawButton'}  onClick={() => withdraw()}>
                    다음
                </button>
            </div>
        </StyledModal>
    )
}

export default WithDraw

const StyledModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999999999999999999;
    background-color: rgba(0,0,0,0.6);
    .modal-box{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        height: 600px;
        border-radius: 5px;
        background-color: var(--main-background-white);
        color: var(--main-text-black);
        opacity: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        
        div{
            width: 90%;
            p{
                font-size: 15px;
                color: #484848;
            }
            p.title{
                font-size: 24px;
                font-weight: 700;
            }
            p.reason-text{
                margin-top: 30px;
                font-weight: 400;
                color: #333;
            }
            form{
                display: flex;
                flex-direction: column;
                margin-top: 30px;
                margin-bottom: 20px;
                label{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: start;
                    padding: 10px 0;
                    font-size: 14px;
                    [type="radio"]{
                        width: 20px;
                        height: 20px;
                        margin-right: 10px;
                    }
                    [type="radio"]:checked{
                        background-color: var(--main-theme-color);
                        color: var(--main-theme-color);
                    }
                }
                #direct-reason{
                    border-bottom: 1px solid var(--main-text-black);
                    padding: 10px 0;
                }
            }
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
        .withdrawButton{
            opacity: 0.2;
        }
        .active{
            opacity: 1;
        }
        .close{
            width: 30px;
            height: 30px;
            color: #ffffff;
            position: fixed;
            background-color: transparent;
            top: -40px;
            right: 0;
            z-index: 999999999999999999999;
            padding: 0;
            svg{
                width: 40px;
                height: 40px;
            }
        }
    }
    
`;