import React, { useState, useEffect, useRef, useContext } from 'react'
import MainStyledSection from '../layout/MainStyledSection'
import styled from 'styled-components'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AppContext, SetAppContext } from '../App'
import LoginFailure from '../modal/LoginFailure'
import { setCookie } from '../config/cookie'
import Loading from '../components/Loading'

const SignIn = () => {
    const isSessionValid = useContext(AppContext); 
    const setIsSessionValid = useContext(SetAppContext);

    const [ userInputId, setUserInputId ] = useState('');
    const [ userInputPassword, setUserInputPassword ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ loginStatus, setLoginStatus ] = useState(isSessionValid);
    const [ rememberId, setRememberId ] = useState(false);

    const [ modalOpen, setModalOpen ] = useState(false);

    const idInput = useRef();
    const passwordInput = useRef();
    const iconRef = useRef();
    const checkBoxRef = useRef();

    const showpass = (e) =>{ 
        e.preventDefault();
        iconRef.current.classList.toggle('d-none');
        if(passwordInput.current.type === 'password'){
            passwordInput.current.type = 'text';
        }else if(passwordInput.current.type === 'text'){
            passwordInput.current.type = 'password';
        }
    }

    const loginSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        //checkInputValue();
        await login();
        setLoading(false);
    }

    const checkInputValue = () =>{
        // 정규식 이용해서 사용자가 입력한 값 검증절차
        if(true){
            return true;
        }else{
            return false;
        }
    }

    const login = async() => {
        const sendDataToServer = {
            adminId: idInput.current.value,
            adminPw: userInputPassword,
            isAdmin: 'client'
        };
        const recievedData = await axios.post(`http://localhost:8080/login`,sendDataToServer);
        console.log(recievedData);
        if(recievedData.data.loginSucceed){
            console.log('로그인 성공!!!');
            setCookie('client.sid', recievedData.data.clientID, {
                path: '/',
                secure: false,
                secret: process.env.COOKIE_SECRET
            });
            setCookie('connect.sid', recievedData.data.sessionID, {
                path: '/',
                secure: false,
                secret: process.env.COOKIE_SECRET
            });

            if(checkBoxRef.current.checked){
                window.localStorage.setItem('remember', true);
                window.localStorage.setItem('ID', idInput.current.value);
            }else{
                window.localStorage.setItem('remember', false);
                window.localStorage.removeItem('ID');
            }
            
            window.localStorage.setItem('login', true);

            window.location='/';
        }else{
            console.log('사용자 정보가 일치하지 않습니다');
            setModalOpen(true);
        }
    };

    useEffect(()=>{
        // window.localStorage.getItem() 반환값 => String !!! NOT Boolean
        if(window.localStorage.getItem('remember') === 'true'){
            idInput.current.value = window.localStorage.getItem('ID');
            checkBoxRef.current.checked = true;
        }else{
            checkBoxRef.current.checked = false;
        }
    },[])

    useEffect(()=>{
        if(loading){
            console.log('로딩중...');
        }else{
            console.log('로딩 끝');
        }
    }, [loading]);

    useEffect(()=>{
        if(error){
            console.log('서버와의 연결이 원활하지 않습니다');
        }else{
            console.log('에러 없음');
        }
    }, [error]);

    return (
        <MainStyledSection>
            {loading && <Loading />}
            {modalOpen && <LoginFailure setModalOpen={setModalOpen}/>}
            <div className="h-[700px] flex align-items-center justify-center pt-10">
                <LoginFormCover className='login-form border-2 w-[700px] h-[600px]'>
                    {
                        isSessionValid === 'false'? 
                        <>
                            <form onSubmit={loginSubmit} className='flex flex-col align-items-center justify-center'>
                                <input type="text" id='userId' className='input-text' placeholder='아이디' onChange={e=>setUserInputId(e.target.value)} ref={idInput} />
                                <div className='password-input-cover'>
                                    <span className='show' onClick={showpass} >
                                        <AiFillEye/>
                                    </span>
                                    <span className='d-none hide' ref={iconRef} onClick={showpass}>
                                        <AiFillEyeInvisible/>
                                    </span>
                                    <input type="password" id='userPw' className='input-text' placeholder='비밀번호' onChange={e=>setUserInputPassword(e.target.value)} ref={passwordInput} autoComplete="off"/>
                                </div>
                                
                                <div className='checkbox-cover'>
                                    <input type="checkbox" id='rememberId' name='remember-id' className='remember-login-info' ref={checkBoxRef}/>
                                    <span className='ml-5 text-md'>아이디 저장</span>
                                </div>
                                <button type='submit' id='loginButton' className={ idInput.current?.value && userInputPassword !== '' ? 'submit-able active' : 'submit-able'}>
                                    로그인
                                </button>
                            </form>
                            <div className='login-additional w-full h-[80px]'>
                                <div className='find-info-area'>
                                    <div className='find-info'>
                                        <p><Link to='/find/id' >아이디 찾기</Link></p>
                                        <p><Link to='/find/password' >비밀번호 찾기</Link></p>
                                    </div>
                                    <div className='sign-up'>
                                        <p>
                                            <Link to='/signup' >회원가입</Link>
                                        </p>
                                    </div>
                                </div>
                                <div className='w-full h-[40px] flex align-items-center justify-center'>
                                    {/* 카카오톡 로그인 */}
                                </div>
                            </div>
                        </>
                        
                        : 
                        
                        <div>로그인됨</div>
                    }
                </LoginFormCover>
            </div>
        </MainStyledSection>
    )
}

export default SignIn

const LoginFormCover = styled.div`
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
            border-bottom: 1px solid #aaaaaa;
            &:focus{
                outline: 3px solid #333 !important;
                border-radius: 3px;
            }
            &::placeholder{
                font-size: 17px;
            }
        }
        .password-input-cover{
            width: 70%;
            position: relative;
            span{
                svg{
                    width: 30px;
                    height: 30px;
                    color: #aaaaaa;
                    position: absolute;
                    top: 20%;
                    right: 0;
                    bottom: auto;
                    left: auto;
                }
            }
            .input-text{
                width: 100%;
                height: 70px;
                margin-bottom: 20px;
                border-bottom: 1px solid #aaaaaa;
                &:focus{
                    outline: 3px solid #333 !important;
                    border-radius: 3px;
                }
                &::placeholder{
                    font-size: 17px;
                }
            }
        }
        .checkbox-cover{
            width: 70%;
            margin:10px 0 30px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: start;
            .remember-login-info{
                width: 20px;
                height: 20px;
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
        .active{
            opacity: 1 !important;
        }

        /* INPUT TAG COLOR SETTING */
        input[type=checkbox]{
            accent-color: var(--main-theme-color);
        }
        
    }
    .login-additional{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 30px 0;
        .find-info-area{
            width: 70%;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: row;
            color: #aaaaaa;
            margin: 20px 0;
            .find-info{
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
                p:hover{
                    color: var(--main-theme-color);
                }
                >p:first-child{
                    position: relative;
                    margin-right: 20px;
                    &::after{
                        content: "";
                        display: block;
                        width: 1px;
                        height: 15px;
                        position: absolute;
                        top: 5px;
                        right: -10px;
                        background-color: #aaaaaa;
                    }
                }
            }
            .sign-up{
                p:hover{
                    color: var(--main-theme-color);
                }
            }
        }
    }
`;