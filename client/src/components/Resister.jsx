import React, { useState, useRef, useEffect } from 'react'
import MainStyledSection from '../layout/MainStyledSection'
import styled from 'styled-components'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FaCheck } from "react-icons/fa";
import ConfirmedId from '../modal/ConfirmedId'
import ResisterFailure from '../modal/ResisterFailure';
import axios from 'axios';
import ResisterComplete from '../modal/ResisterComplete';
import Loading from '../components/Loading'

const Resister = () => {
    const [ loading, setLoading ] = useState(false);

    const [ id, setId ] = useState('');
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ confirmedId, setConfirmedId ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ checkPassword, setCheckPassword ] = useState('');
    const [ name, setName ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ birth, setBirth ] = useState('');
    const [ resisterNumber, setResisterNumber ] = useState('');
    const [ email, setEmail ] = useState(''); 
    const [ emailUrlDirect, setEmailUrlDirect ] = useState('');
    const [ resisterFailure, setResisterFailure ] = useState(false);
    const [ resisterComplete, setResisterComplete ] = useState(false);

    const iconRef = useRef();
    const duplicateCheckRef = useRef();
    const passwordRef = useRef();
    const passwordCheckRef = useRef();
    const passwordCheckIconRef = useRef();
    const emailRef = useRef();
    const emailUrlRef = useRef();
    const invalidIdRef = useRef();
    const invalidPasswordRef = useRef();
    const validPasswordRef = useRef();
    const notConfirmedPasswordRef = useRef();
    const confirmedPasswordRef = useRef();
    const invalidNameRef = useRef();
    const invalidPhoneRef = useRef();
    const invalidBirthRef = useRef();
    const invalidResisterNumberRef = useRef();
    const invalidEmailRef = useRef();

    const showpass = (e) =>{ 
        iconRef.current.classList.toggle('hidden');
        if(passwordRef.current.type === 'password'){
            passwordRef.current.type = 'text';
        }else if(passwordRef.current.type === 'text'){
            passwordRef.current.type = 'password';
        }
    }
    const showpassCheck = (e) => { 
        passwordCheckIconRef.current.classList.toggle('hidden');
        if(passwordCheckRef.current.type === 'password'){
            passwordCheckRef.current.type = 'text';
        }else if(passwordCheckRef.current.type === 'text'){
            passwordCheckRef.current.type = 'password';
        }
    }
    const toggleUrlDirect = () => {
        if(emailRef.current.value === 'direct'){
            setEmailUrlDirect('');
            emailUrlRef.current.classList.remove('hidden');
        }else{
            setEmailUrlDirect(emailRef.current.value);
            emailUrlRef.current.classList.add('hidden');
        }
    }
    const onlyEnglishAndNumber = (str) => {
        return /^[A-Za-z0-9][A-Za-z0-9]*$/.test(str);
    }
    const strongPassword = (str) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(str);
    }
    const isMatch = (pw1, pw2) => {
        return pw1 === pw2;
    }
    const onlyKoreanName = (str) => {
        return /^[가-힣]+$/.test(str);
    }
    const validPhoneNumber = (str) => {
        return /^\d{3}-\d{3,4}-\d{4}$/.test(str);
    }
    const validBirth = (str) => {
        return /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/.test(str);
    }
    const validEmail = (str) => {
        return /^[A-Za-z0-9][A-Za-z0-9]*$/.test(str);
    }

    const checkDuplicateId = async() => {
        if(id !== '' && onlyEnglishAndNumber(id)){
            const responseFromServer = await axios.post('/guest/check_duplication', {id: id});
            if(responseFromServer.data.useable){
                setModalOpen(true);
                setConfirmedId(true);
            }else{
                setModalOpen(true);
                setConfirmedId(false);
            }
        }
    }

    useEffect(()=>{
        if(onlyEnglishAndNumber(id) || id === ''){
            invalidIdRef.current.classList.add('hidden');
        }else{
            invalidIdRef.current.classList.remove('hidden');
        }
        setConfirmedId(false);
    },[id])

    useEffect(()=>{
        if(confirmedId === true){
            duplicateCheckRef.current.classList.add('confirmed');
        }else{
            duplicateCheckRef.current.classList.remove('confirmed');
        }
    }, [confirmedId])

    useEffect(()=>{
        if(password === ''){
            invalidPasswordRef.current.classList.add('hidden');
            validPasswordRef.current.classList.add('hidden');
        }else{
            if(strongPassword(password)){ // ok
                invalidPasswordRef.current.classList.add('hidden');
                validPasswordRef.current.classList.remove('hidden');
            }else{
                invalidPasswordRef.current.classList.remove('hidden');
                validPasswordRef.current.classList.add('hidden');
            }
        }
    }, [password])

    useEffect(()=>{
        if(checkPassword === ''){
            notConfirmedPasswordRef.current.classList.add('hidden');
            confirmedPasswordRef.current.classList.add('hidden');
        }else{
            if(isMatch(password, checkPassword) && password !== '' && checkPassword !== ''){
                notConfirmedPasswordRef.current.classList.add('hidden');
                confirmedPasswordRef.current.classList.remove('hidden');
            }else{
                notConfirmedPasswordRef.current.classList.remove('hidden');
                confirmedPasswordRef.current.classList.add('hidden');
            }
        }
    },[password, checkPassword])

    useEffect(()=>{
        if(name === ''){
            invalidNameRef.current.classList.add('hidden');
        }else{
            if(onlyKoreanName(name)){
                invalidNameRef.current.classList.add('hidden');
            }else{
                invalidNameRef.current.classList.remove('hidden');
            }
        }
    }, [name])

    // 12.14
    // 여기랑 return부분 휴대폰 번호 입력하는 input에 value 추가했음
    // 12.15 수정
    
    useEffect(()=>{
        if(phone.length === 10){
            setPhone(phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }
        if(phone.length === 13){
            setPhone(phone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
        }
        if(!validPhoneNumber(phone) && phone.length > 1){
            invalidPhoneRef.current.classList.remove('hidden');
        }else{
            invalidPhoneRef.current.classList.add('hidden');
        }
    }, [phone])

    useEffect(()=>{
        if(birth === '' || birth.length < 6){
            invalidBirthRef.current.classList.add('hidden');
        }else{
            if(validBirth(birth)){
                invalidBirthRef.current.classList.add('hidden');
            }else{
                invalidBirthRef.current.classList.remove('hidden');
            }
        }
    }, [birth])

    useEffect(()=>{
        if(parseInt(resisterNumber) > 4 || parseInt(resisterNumber) < 0){
            invalidResisterNumberRef.current.classList.remove('hidden');
        }else{
            invalidResisterNumberRef.current.classList.add('hidden');
        }
    }, [resisterNumber])

    useEffect(()=>{
        if(email === ''){
            invalidEmailRef.current.classList.add('hidden');
        }else{
            if(validEmail(email)){
                invalidEmailRef.current.classList.add('hidden');
            }else{
                invalidEmailRef.current.classList.remove('hidden');
            }
        }
    }, [email])
    
    const signUpData = {
        name: name,
        id: id,
        password: password,
        birth: birth,
        resisterNumber: resisterNumber,
        email: email,
        emailUrl: emailUrlDirect,
        phone: phone
    }

    const checkAllData = () =>{
        if(confirmedId &&
        onlyEnglishAndNumber(id)&&
        strongPassword(password)&&
        isMatch(password, checkPassword)&&
        onlyKoreanName(name)&&
        validPhoneNumber(phone)&&
        validBirth(birth)&&
        (parseInt(resisterNumber) >= 1 && parseInt(resisterNumber) <= 4)&&
        validEmail(email)&&
        emailRef.current.value !== 'none'
        ){
            return true;
        }else{
            return false;
        }
    }

    const signUp = async(e) => {
        e.preventDefault();
        if(checkAllData()){
            setLoading(true);
            const responseFromServer = await axios.post('/guest/resister',signUpData);
            setLoading(false);
            if(responseFromServer.data.resisterComplete){
                setResisterComplete(true);
            }
        }else{
            setResisterFailure(true);
        }
    }    
    
    return (
        <MainStyledSection>
            {loading && <Loading />}
            {resisterComplete && <ResisterComplete setModalOpen={setResisterComplete}/>}
            {modalOpen && <ConfirmedId setModalOpen={setModalOpen} useable={confirmedId}/> }
            {resisterFailure && <ResisterFailure setResisterFailure={setResisterFailure}/>}
            <Logo className='logo mx-auto mt-5 mb-5'>
            </Logo>
            <ResisterForm>
                <div className='resister-form-cover w-full'>
                    <h1 className='text-center font-bold text-[30px] py-4 mb-10'>
                        회원가입
                    </h1>
                    <StyledForm>
                        <form onSubmit={signUp}>
                            <div>
                                <span className='duplication-check' ref={duplicateCheckRef}>
                                    <FaCheck />
                                </span>
                                <input type="text" id='signUpId' name='signUpId' className='input-text' placeholder='아이디' onChange={e => setId(e.target.value)} autoComplete="off"/>
                                <button type='button' onClick={checkDuplicateId} className='duplication-check-button'>중복확인</button>
                                <span className='invalid-text hidden' ref={invalidIdRef}>한글 혹은 특수문자는 사용할 수 없습니다.</span>
                            </div>
                            <div className='password-input-cover'>
                                <span className='show' onClick={() => showpass()} >
                                    <AiFillEye/>
                                </span>
                                <span className='hidden hide' ref={iconRef} onClick={() => showpass()}>
                                    <AiFillEyeInvisible/>
                                </span>
                                <input type="password" id='signUpPw' name='signUpPw' className='input-text' placeholder='비밀번호' onChange={e => setPassword(e.target.value)} ref={passwordRef} autoComplete="off"/>
                                <span className='invalid-text' ref={invalidPasswordRef}>영문 대문자 / 소문자 / 숫자 / 특수문자를 섞어 3가지 조합으로 최소 8자리 이상 입력해주세요.</span>
                                <span className='valid-text hidden' ref={validPasswordRef}>사용가능한 비밀번호입니다.</span>
                            </div>
                            <div className='password-check-cover'>
                                <span className='show' onClick={() => showpassCheck()} >
                                    <AiFillEye/>
                                </span>
                                <span className='hidden hide' ref={passwordCheckIconRef} onClick={() => showpassCheck()}>
                                    <AiFillEyeInvisible/>
                                </span>
                                <input type="password" id='signUpPwCheck' name='signUpPwCheck' className='input-text' placeholder='비밀번호 확인' onChange={e => setCheckPassword(e.target.value)} ref={passwordCheckRef} autoComplete="off"/>
                                <span className='invalid-text' ref={notConfirmedPasswordRef}>비밀번호가 일치하지 않습니다.</span>
                                <span className='valid-text hidden' ref={confirmedPasswordRef}>비밀번호가 일치합니다.</span>
                            </div>
                            <div>
                                <input type="text" id='signUpName' name='signUpName' className='input-text' placeholder='이름' onChange={e => setName(e.target.value)} autoComplete="off"/>
                                <span className='invalid-text hidden' ref={invalidNameRef}>올바른 이름형식이 아닙니다.</span>
                            </div>
                            <div>
                                <input type="text" id='signUpPhone' name='signUpPhone' className='input-text' placeholder='휴대폰 번호(-제외)' value={phone} onChange={e => setPhone(e.target.value)} autoComplete="off"/>
                                <span className='invalid-text hidden' ref={invalidPhoneRef}>올바르지 않은 전화번호 형식입니다.</span>
                            </div>
                            <div className='width-half-birth'>
                                <input type="text" id='signUpBirth' name='signUpBirth' className='input-text' placeholder='생년월일(ex.231225)' maxLength={6} onChange={e => setBirth(e.target.value)} autoComplete="off"/>
                                <span className='invalid-text hidden' ref={invalidBirthRef}>올바르지 않은 생년월일입니다.</span>
                                <span className='dash text-[23px]'>-</span>
                                <input type="text" id="registration-number" name="registration-number" maxLength={1} className='px-3'onChange={e => setResisterNumber(e.target.value)} autoComplete="off"/>
                                <span className='invalid-text hidden' ref={invalidResisterNumberRef}>올바르지 않은 주민등록번호입니다.</span>
                                <span className='bullet'>
                                    ••••••
                                </span>
                            </div>
                            <div className='width-half-email'>
                                <input type="text" id='signUpEmail' name='signUpEmail' className='input-text' placeholder='이메일' onChange={e => setEmail(e.target.value)} autoComplete="off"/>
                                <span className='invalid-text' ref={invalidEmailRef}>올바르지 않은 이메일 형식입니다.</span>
                                <span className='at'>@</span>
                                <select id="emailURL" name='eamilURL' onChange={toggleUrlDirect} ref={emailRef}>
                                    <option value="none">선택</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="hanmail.net">hanmail.net</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="nate.com">nate.com</option>
                                    <option value="cyworld.com">cyworld.com</option>
                                    <option value="direct">직접입력</option>
                                </select>
                                <input type="text" id="emailUrlDirect" name="emailUrlDirect" className='hidden' ref={emailUrlRef} onChange={e => setEmailUrlDirect(e.target.value)}/>
                            </div>
                            
                            <button type='submit' className={checkAllData() ? 'signup active' : 'signup'}>
                                가입 완료
                            </button>
                        </form>
                    </StyledForm>
                </div>
            </ResisterForm>
        </MainStyledSection>
    )
}

export default Resister
const Logo = styled.div`
    width: 180px; 
    height: 30px;
    background-image: url(/Logo/Logo.svg);
    background-repeat: no-repeat;
    background-size: cover;
`;
const ResisterForm = styled.div`
    width: 700px;
    height: 900px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    padding: 60px 120px;
    border: 1px solid #d9d9d9;
`;

const StyledForm = styled.div`
    width: 100%;
    >form{
        width: 100%;
        div{
            position: relative;
            .input-text{
                width: 100%;
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
            .duplication-check{
                svg{
                    width: 30px;
                    height: 30px;
                    color: var(--signup-invalid-color);
                    position: absolute;
                    top: 20%;
                    right: 0;
                    bottom: auto;
                    left: auto;
                }
            }
            .confirmed{
                svg{
                    width: 30px;
                    height: 30px;
                    position: absolute;
                    top: 20%;
                    right: 0;
                    bottom: auto;
                    left: auto;
                    color: var(--main-theme-color);
                }
            }
            .duplication-check-button{
                width: 70px;
                height: 30px;
                font-weight: 400;
                font-size: 15px;
                color: #bcbcbc;
                border: 1px solid #bcbcbc;
                border-radius: 8px;
                padding: 3px 5px;
                position: absolute;
                top: 20%;
                right: 40px;
                bottom: auto;
                left: auto;
                &:hover{
                    border-color: var(--main-theme-color);
                    color: var(--main-theme-color);
                }
            }
            .invalid-text{
                width: 100%;
                position: absolute;
                bottom: 20px;
                left: 0;
                font-size: 10px;
                color: var(--signup-invalid-color);
                padding-bottom: 2px;
                border-bottom: 1px solid var(--signup-invalid-color);
            }
            .valid-text{
                width: 100%;
                position: absolute;
                bottom: 20px;
                left: 0;
                font-size: 10px;
                color: var(--main-theme-color);
                padding-bottom: 2px;
                border-bottom: 1px solid var(--main-theme-color);
            }
        }
        .width-half-email{
            position: relative;
            .input-text{
                width: 45%;
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
            .at{
                display: inline-block;
                width: 10%;
                text-align: center;
            }
            #emailURL{
                width: 45%;
                height: 70px;
                color: #aaaaaa;
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
            #emailUrlDirect{
                position: absolute;
                top: 0;
                left: 55%;
                width: 40%;
                height: 70px;
                color: #aaaaaa;
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
        }
        .width-half-birth{
            position: relative;
            #signUpBirth{
                width: 45%;
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
            .dash{
                display: inline-block;
                width: 10%;
                text-align: center;
            }
            #registration-number{
                width: 45%;
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
            .bullet{
                position: absolute;
                top: 10%;
                right: 7%;
                font-size: 30px;
                letter-spacing: 10px;
            }
        }
        .password-input-cover{
            width: 100%;
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
        }
        .password-check-cover{
            width: 100%;
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
        }
        .signup{
            width: 100%;
            height: 70px;
            color: var(--main-text-white);
            background-color: var(--disabled-button-color);
            font-size: 19px;
        }
        .signup.active{
            color: var(--main-text-white);
            background-color: var(--main-theme-color);
            opacity: 1 !important;
        }
    }
`;