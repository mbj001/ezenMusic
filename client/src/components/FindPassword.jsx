import React, { useState, useEffect, useDebugValue } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import axios from 'axios';

const FindPassword = () => {
    const [ findPasswordResultState, setfindPasswordResultState ] = useState('notyet');
    const [ emailAuth, setEmailAuth ] = useState(false);
    const [ userInputId, setUserInputId ] = useState('');
    const [ userInputEmail, setUserInputEmail ] = useState('');
    const [ userInputBirth, setUserInputBirth ] = useState('');
    const [ valid, setValid ] = useState(false);

    const [ loading, setLoading ] = useState('');
    const [ error, setError ] = useState('');

    const findPassword = async(e) =>{
        e.preventDefault();
        await validateUser();
    }

    const validateUser = async() => {
        const validateData = {
            userid: userInputId,
            email: userInputEmail,
            birth: userInputBirth
        }
        const validateResult = await axios.post(`http://localhost:8080/client/validate`,validateData);
        console.log(validateResult);
        if(validateResult.data.valid){
            console.log('client에 등록된 사용자');
            setValid(true);
        }else{
            console.log('누구세요? ');   
            setValid(false);
        }
    }
    useEffect(()=>{
        if(valid){
            console.log('이메일 전송');
        }else{
            
        }
    }, [valid]);

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
        <div className="h-[700px] flex align-items-center justify-center flex-col">
            <Logo className='logo mt-5 mb-10' >
                EzenMusic
            </Logo>
            <div className='mb-10'>
                
            </div>
            <FindFormCover className='login-form border-2 w-[700px] h-[600px]'>
                {
                    findPasswordResultState === 'notyet' ?

                    <form onSubmit={findPassword} className='h-[400px] flex flex-col align-items-center justify-center'>
                        <p className='text-[35px] font-bold mb-5'>비밀번호 찾기</p>
                        <input type="text" id='userId' className='input-text' placeholder='아이디' onChange={e=>setUserInputId(e.target.value)}/>
                        <input type="text" id='email' className='input-text' placeholder='이메일' onChange={e=>setUserInputEmail(e.target.value)}/>
                        <input type="text" id='birth' className='input-text' placeholder='생년월일' onChange={e=>setUserInputBirth(e.target.value)}/>
                        <button type='submit' id='loginButton' className='submit-able'>
                            확인
                            {/* button-active 라는 클래스 주어져야 넘어갈 수 있게 처리할 예정 */}
                        </button>
                    </form>
                    
                    : findPasswordResultState === 'success' ? 

                    <div>
                        비밀번호 찾기 성공
                    </div>

                    :
                    
                    <FindFailCover className='h-[400px] flex flex-col align-items-center justify-center'>
                        <p className='text-[35px] font-bold mb-5'>아이디 찾기</p>
                        <div className='find-result border-t-2 border-b-2 h-[100px]'>
                            <div className='result-box '>
                                <p>등록된 아이디가 없습니다.</p>
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
    font-size: 30px;
    color: var(--main-theme-color);
    text-decoration: none;
    font-weight: 900;
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
            border-bottom: 1px solid #aaaaaa;
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
            border-bottom: 1px solid #aaaaaa;
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