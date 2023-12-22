import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import axios from 'axios';
import ConfirmFailure from '../modal/ConfirmFailure';
import DuplicatedPassword from '../modal/DuplicatedPassword'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import FindPasswordModal from '../modal/FindPasswordModal';

const FindPassword = () => {
    const [ submit, setSubmit ] = useState(false);
    const [ userInputId, setUserInputId ] = useState('');
    const [ userInputEmail, setUserInputEmail ] = useState('');
    const [ userInputBirth, setUserInputBirth ] = useState('');
    const [ valid, setValid ] = useState(false);
    const [ newPassword, setNewPassword ] = useState('');
    const [ checkNewPassword, setCheckNewPassword ] = useState('');
    const [ confirmFailureModalOpen, setConfirmFailureModalOpen ] = useState(false);
    const [ duplicatedPasswordModalOpen, setDuplicatedPasswordModalOpen ] = useState(false);

    const [ invalid, setInvalid] = useState(false);
    const [ doesMatch, setDoesMatch ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    const [ newPasswordType, setNewPasswordType ] = useState({
        type: 'password',
        visible: false
    });
    const [ chekcNewPasswordType, setCheckNewPasswordType ] = useState({
        type: 'password',
        visible: false
    });

    const newPasswordRef = useRef();

    const findPassword = async(e) =>{
        e.preventDefault();
        await validateUser();
    }

    const validateUser = async() => {
        const validateData = {
            user_id: userInputId,
            email: userInputEmail,
            birth: userInputBirth
        }
        const validateResult = await axios.post(`/guest/validateBeforeChangePassword`,validateData);
        if(validateResult.data.valid === true){
            setSubmit(true);
            setValid(true);
        }else if(validateResult.data.valid === false){
            setSubmit(true);
            setValid(false);
        }else{

        }
    }

    const handlePasswordType = (str) => {
        if(str === 'new'){
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

    const resetPassword = async(e) => {
        e.preventDefault();
        if(!invalid && doesMatch){
            const response = await axios.post('/guest/changePassword', {user_id: userInputId, newPassword: newPassword});
            if(response.data.success === true){
                setSuccess(true);
            }else if(response.data.haveUsed){
                setDuplicatedPasswordModalOpen(true);
            }else{
                // console.log('서버와의 연결이 원활하지 않습니다. 잠시후에 시도해주세요.')
            }
        }
    };

    useEffect(()=>{
        if(!strongPassword(newPassword)){
            setInvalid(true);
        }else{
            setInvalid(false);
        };
    }, [newPassword])

    useEffect(()=>{
        if(isMatch(newPassword, checkNewPassword)){
            setDoesMatch(true);
        }else{
            setDoesMatch(false);
        }
    }, [newPassword, checkNewPassword, doesMatch])

    useEffect(()=>{
        if(!invalid && doesMatch){

        }
    },[invalid, doesMatch])

    return (
        <div className="h-[700px] flex align-items-center justify-center flex-col">
            <Logo className='logo mt-[40px] mb-[30px]' >
            </Logo>
            <div className='mb-10'>
                
            </div>
            <FindFormCover className='login-form border-2 w-[700px] h-[600px]'>
                {
                    submit === false ? 
                        <form onSubmit={findPassword} className='h-[400px] flex flex-col align-items-center justify-center'>
                            <p className='text-[35px] font-bold mb-5'>비밀번호 찾기</p>
                            <input type="text" id='userId' className='input-text' placeholder='아이디' onChange={e=>setUserInputId(e.target.value)}/>
                            <input type="text" id='email' className='input-text' placeholder='이메일' onChange={e=>setUserInputEmail(e.target.value)}/>
                            <input type="text" id='birth' className='input-text' placeholder='생년월일' onChange={e=>setUserInputBirth(e.target.value)}/>
                            <button type='submit' id='loginButton' className='submit-able'>
                                확인
                            </button>
                        </form>
                    :
                    valid === true?
                        <UserInfoBox className='w-[500px] mx-auto'>
                            {success && <FindPasswordModal setModalOpen={setSuccess}/>}
                            {duplicatedPasswordModalOpen && <DuplicatedPassword setModalOpen={setDuplicatedPasswordModalOpen}/>}
                            {confirmFailureModalOpen && <ConfirmFailure setModalOpen={setConfirmFailureModalOpen}/>}
                            
                            <form onSubmit={resetPassword}>
                                <h1 className='text-[35px] font-bold text-center'>비밀번호 재설정</h1>
                                <div className='py-8'>
                                    <div className='password-input-cover'>
                                        <span onClick={()=>handlePasswordType('new')} >
                                            {newPasswordType.visible ? <AiFillEyeInvisible/> : <AiFillEye/>}
                                        </span>
                                        <input type={newPasswordType.type} id='new-password' name='signUpPw' className='input-text' placeholder='새로운 비밀번호 입력' onChange={e=>setNewPassword(e.target.value)} ref={newPasswordRef} autoComplete="off"/>
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
                                        <input type={chekcNewPasswordType.type} id='check-new-password' name='signUpPw' className='input-text' placeholder='새로운 비밀번호 확인' onChange={e=>setCheckNewPassword(e.target.value)} autoComplete="off"/>
                                        {
                                            checkNewPassword === '' ? 
                                            <></>
                                            :
                                            doesMatch?
                                            <span className='valid-text'>비밀번호가 일치합니다.</span>
                                            :
                                            <span className='invalid-text'>비밀번호가 일치하지 않습니다.</span>
                                        }
                                    </div>
                                </div>
                                <div className='button-box'>
                                    <button type='submit'>변경</button>
                                </div>
                            </form>
                        </UserInfoBox>
                    :
                        <FindFailCover className='h-[400px] flex flex-col align-items-center justify-center'>
                            <p className='text-[35px] font-bold mb-5'>비밀번호 찾기</p>
                            <div className='find-result border-t-2 border-b-2 h-[100px]'>
                                <div className='result-box '>
                                    <p>입력하신 정보로 가입된 아이디가 없습니다.</p>
                                    <p>회원가입하고 EzenMusic을 즐겨보세요!</p>
                                </div>
                            </div>
                            <button type='button' id='go-signup'>
                                <Link to='/signup'>회원가입하러 가기</Link>
                            </button>
                        </FindFailCover>
                }
                
            </FindFormCover>
        </div>
    )
}

export default FindPassword

const Logo = styled.div`
    width: 180px; 
    height: 30px;
    background-image: url(/Logo/Logo.svg);
    background-repeat: no-repeat;
    background-size: cover;
`;
const FindFormCover = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    >form{
        width: 100%;
        .input-text{
            width: 70%;
            height: 70px;
            margin-bottom: 20px;
            border-bottom: 1px solid #ebebeb;
            &:focus{
                outline: 3px solid #333 !important;
                border-radius: 3px;
            }
            &::placeholder{
                font-size: 17px;
            }
        }
        .input-text{
            width: 70%;
            height: 70px;
            margin-bottom: 20px;
            border-bottom: 1px solid #ebebeb;
            &:focus{
                outline: 3px solid #333 !important;
                border-radius: 3px;
            }
            &::placeholder{
                font-size: 17px;
            }
        }
        button{
            width: 70%;
            height: 70px;
            color: var(--main-text-white);
            background-color: var(--main-theme-color);
            opacity: 0.3;
            font-size: 19px;
        }
        .button-active{
            opacity: 1 !important;
        }
    }
`;

const FindFailCover = styled.div`
    width: 100%;
    .find-result{
        width: 70%;
        height: 80px;
        margin-bottom: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .result-box{
            text-align: center;
            margin-left: 10px;
        }
    }
    button{
        width: 70%;
        height: 70px;
        color: var(--main-text-white);
        background-color: var(--main-theme-color);
        opacity: 0.9;
        font-size: 19px;
    }
    .button-active{
        opacity: 1 !important;
    }
`;

const UserInfoBox = styled.div`
    form{
        div{
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: start;
            .password-input-cover{
                width: 100%;
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
        }
        .button-box{
            width: 100%;
            height: 70px;
            margin-top: 50px;
            button{
                width: 100%;
                height: 100%;
                font-size: 20px;
                line-height: 36px;
                padding: 0 15px;
                color: #fff;
                text-align: center;
                background-color: #3f3fff;
                opacity: 0.2;
            }
            button.active{
                opacity: 1;
            }
        }
    }
`;
