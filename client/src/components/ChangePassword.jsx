import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import axios from 'axios';
import { getCookie } from '../config/cookie'
import ConfirmFailure from '../modal/ConfirmFailure';
import DuplicatedPassword from '../modal/DuplicatedPassword'
import ChangePasswordSuccess from '../modal/ChangePasswordSuccess';

const ChangePassword = () => {
    const [ password, setPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [ checkNewPassword, setCheckNewPassword ] = useState('');
    const [ confirmed, setConfirmed ] = useState(false);
    const [ confirmFailureModalOpen, setConfirmFailureModalOpen ] = useState(false);
    const [ duplicatedPasswordModalOpen, setDuplicatedPasswordModalOpen ] = useState(false);

    const [ invalid, setInvalid] = useState(false);
    const [ doesMatch, setDoesMatch ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    const [ currentPasswordType, setCurrentPasswordType ] = useState({
        type: 'password',
        visible: false
    });
    const [ newPasswordType, setNewPasswordType ] = useState({
        type: 'password',
        visible: false
    });
    const [ chekcNewPasswordType, setCheckNewPasswordType ] = useState({
        type: 'password',
        visible: false
    });

    const newPasswordRef = useRef();
    const notConfirmedPasswordRef = useRef();
    const confirmedPasswordRef = useRef();

    const handlePasswordType = (str) => {
        if(str === 'current'){
            setCurrentPasswordType(()=>{
                if(!currentPasswordType.visible){
                    return { type: 'text', visible: true }
                }else{
                    return { type: 'password', visible: false }
                }
            });
        }else if(str === 'new'){
            setNewPasswordType(()=>{
                if(!newPasswordType.visible){
                    return { type: 'text', visible: true }
                }else{
                    return { type: 'password', visible: false }
                }
            });
        }else{
            setCheckNewPasswordType(()=>{
                if(!chekcNewPasswordType.visible){
                    return { type: 'text', visible: true }
                }else{
                    return { type: 'password', visible: false }
                }
            });
        }
    };

    const strongPassword = (str) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(str);
    };
    const isMatch = (pw1, pw2) => {
        return pw1 === pw2;
    };

    const confirmPassword = async(e) => {
        e.preventDefault();
        if(password !== ''){
            const response = await axios.post('/verifiedClient/confirmPassword', {token: getCookie('connect.sid'), user_id: getCookie('client.sid'), password: password});
            if(response.data.confirmed){
                setConfirmed(true);
            }else{
                setConfirmFailureModalOpen(true);
            }
        }
    };
    const resetPassword = async(e) => {
        e.preventDefault();
        if(password === newPassword){
            setDuplicatedPasswordModalOpen(true);
        }else{
            if(!invalid && doesMatch){
                const response = await axios.post('/verifiedClient/changePassword', {token: getCookie('connect.sid'), user_id: getCookie('client.sid'), newPassword: newPassword});
                if(response.data.success){
                    setSuccess(true);
                }
            }
        }
    };

    useEffect(()=>{
        if(!strongPassword(newPassword)){
            setInvalid(true);
        }else{
            setInvalid(false);
        }
    }, [newPassword])

    useEffect(()=>{
        if(isMatch(newPassword, checkNewPassword)){
            setDoesMatch(true);
        }else{
            setDoesMatch(false);
        }
    }, [newPassword, checkNewPassword, doesMatch])

    useEffect(()=>{
        if(confirmed){
            newPasswordRef.current.focus();
        }
    },[confirmed]);
    return (
        <UserInfoBox>
            {success && <ChangePasswordSuccess setModalOpen={setSuccess}/>}
            {duplicatedPasswordModalOpen && <DuplicatedPassword setModalOpen={setDuplicatedPasswordModalOpen}/>}
            {confirmFailureModalOpen && <ConfirmFailure setModalOpen={setConfirmFailureModalOpen}/>}
            <form onSubmit={confirmPassword}>
                <div>
                    <div className='password-input-cover'>
                        <span onClick={()=>handlePasswordType('current')} >
                            {currentPasswordType.visible ? <AiFillEyeInvisible/> : <AiFillEye/>}
                        </span>
                        <input type={currentPasswordType.type} id='current-password' name='signUpPw' className={confirmed ? 'input-text confirmed' : 'input-text'} disabled={confirmed ? true : false} placeholder='현재 비밀번호 입력' onChange={e=>setPassword(e.target.value)} autoComplete="off"/>
                    </div>
                    <button type='submit'>확인</button>
                </div>
            </form>
            <form onSubmit={resetPassword}>
                <div className='py-8'>
                    <div className='password-input-cover'>
                        <span onClick={()=>handlePasswordType('new')} >
                            {newPasswordType.visible ? <AiFillEyeInvisible/> : <AiFillEye/>}
                        </span>
                        <input type={newPasswordType.type} id='new-password' name='signUpPw' className='input-text' disabled={confirmed ? false : true} placeholder='새로운 비밀번호 입력' onChange={e=>setNewPassword(e.target.value)} ref={newPasswordRef} autoComplete="off"/>
                        {
                            newPassword === ''?
                            <></>
                            :
                            invalid && <span className='invalid-text'>영문 대문자 / 소문자 / 숫자 / 특수문자를 섞어 3가지 조합으로 최소 8자리 이상 입력해주세요.</span>
                        }
                    </div>
                </div>
                <div>
                    <div className='password-input-cover'>
                        <span onClick={()=>handlePasswordType('')} >
                            {chekcNewPasswordType.visible ? <AiFillEyeInvisible/> : <AiFillEye/>}
                        </span>
                        <input type={chekcNewPasswordType.type} id='check-new-password' name='signUpPw' className='input-text' disabled={confirmed ? false : true} placeholder='새로운 비밀번호 확인' onChange={e=>setCheckNewPassword(e.target.value)} autoComplete="off"/>
                        {
                            checkNewPassword === '' ? 
                            <></>
                            :
                            doesMatch?
                            <span className='valid-text' ref={confirmedPasswordRef}>비밀번호가 일치합니다.</span>
                            :
                            <span className='invalid-text' ref={notConfirmedPasswordRef}>비밀번호가 일치하지 않습니다.</span>
                        }
                    </div>
                    <button type='submit'>변경</button>
                </div>
            </form>
        </UserInfoBox>
    )
}

export default ChangePassword

const UserInfoBox = styled.div`
    form{
        div{
            width: 50%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: start;
            .password-input-cover{
                width: 70%;
                position: relative;
                span{
                    svg{
                        width: 30px;
                        height: 30px;
                        color: #ebebeb;
                        position: absolute;
                        top: 20%;
                        right: 0;
                        bottom: auto;
                        left: auto;
                    }
                }
                input[type=text]{
                    letter-spacing: 0;
                }
                input[type=password]{
                    letter-spacing: 2px;
                }
                .input-text{
                    width: 100%;
                    height: 58px;
                    font-size: 15px;
                    font-weight: 400;
                    color: #000000;
                    border-bottom: 1px solid #ebebeb;
                    &:focus{
                        border-bottom: 1px solid #000000;
                    }
                    &::placeholder{
                        font-size: 15px;
                        letter-spacing: 0;
                    }
                }
                .input-text.confirmed{
                    color: #dedede;
                }
                .invalid-text{
                    width: 100%;
                    position: absolute;
                    bottom: -15px;
                    left: 0;
                    font-size: 10px;
                    letter-spacing: -1px;
                    color: var(--signup-invalid-color);
                    border-top: 1px solid var(--signup-invalid-color);
                }
                .valid-text{
                    width: 100%;
                    position: absolute;
                    bottom: -15px;
                    left: 0;
                    font-size: 10px;
                    letter-spacing: -1px;
                    color: var(--main-theme-color);
                    border-top: 1px solid var(--main-theme-color);
                }
            }
            button{
                margin-left: 20px;
                min-width: 85px;
                height: 36px;
                padding: 0 15px;
                font-size: 14px;
                line-height: 36px;
                color: #fff;
                text-align: center;
                background-color: #3f3fff;
                border-radius: 5px;
                opacity: 0.2;
                &:hover{
                    opacity: 0.3;
                }
            }
        }
    }
`;
