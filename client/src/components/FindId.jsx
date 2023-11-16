import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { BsCheckSquareFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import axios from 'axios'

/**
 * FindByIdResult 
 * 1. notyet: 찾기 전 
 * 2. success: 찾아보니 아이디 존재 -> 이메일 몇자리 가려서 보여주고 로그인화면으로 이동버튼
 * 3. fail: 아이디 없음 -> 회원가입페이지 이동버튼
 * 
 * ("문자열").replace(/정규표현식/, "대체문자열")
 * (정규표현식).test("문자열") -> 일치여부 확인 true / false
 * userInputEmail.test(/[\w\-\.]+\@[\w\-\.]+/g);
 * /[\w\-\.]+\@[\w\-\.]+\.[\w\-\.]+/g
 */
const FindId = () => {
    // 정규표현식
    // const phoneRegExp = /\d{3}-\d{4}-\d{4}/;
    // const nameRegExp =  /[\w\S]+/g;

    const [ findIdResultState, setfindIdResultState ] = useState('notyet');
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);
    // check input data format
    const [ availableData, setAvailableData ] = useState(true);
    // send data to server
    const [ userInputName, setUserInputName ] = useState('');
    const [ userInputPhone, setUserInputPhone ] = useState('');
    // recieved data from server
    const [ userId, setUserId ] = useState('exampleId');
    const [ userTicketType, setUserTicketType ] = useState('이용권 없음');

    const findButtonRef = useRef();
    
    const submitFindIdData = async(e) => {
        e.preventDefault();
        if(availableData){
            setLoading(true);
            await getDataFromServer();
            setLoading(false);
        }else{
            console.log('availableData = false');
        }
    }

    const getDataFromServer = async () => {
        try{
            // const getData = await axios.get(`http://localhost:8080/client/find?name=${userInputName}&phone=${userInputPhone}`);
            const sendDataToServer = {
                name: userInputName,
                phone: userInputPhone
            };
            const getData = await axios.post(`http://localhost:8080/client/find`,sendDataToServer);
            const recievedData = JSON.parse(getData.request.response);
            // console.log('type : ' + typeof(recievedData));
            console.log(recievedData);
            if(recievedData.databaseError){
                console.log('sql 에러');
            }else{
                if(recievedData.emptyData){
                    setfindIdResultState('fail');
                }else{
                    setfindIdResultState('success');
                    // 서버랑 통신 성공, db에러 없고, 빈 데이터 아닌 정상적인 데이터 도착
                    if(recievedData.ticket_type === 'guest'){
                        setUserTicketType('이용권 없음');
                    }else{
                        setUserTicketType(recievedData.ticket_type);
                    }
                    setUserId(recievedData.userid);
                }
            }
        }catch(error){
            setError(true);
            console.log(error);
        }
    }
    useEffect(()=>{
        // if(/[\s]/g.test(userInputName) && /\d{3}-\d{4}-\d{4}/.test(userInputPhone)){
        //     setAvailableData(false);
        //     findButtonRef.current.classList.remove('button-active');
        // }else{
        //     setAvailableData(true);
        //     findButtonRef.current.classList.add('button-active');
        // }
        // findButtonRef.current.classList.add('button-active');
    }, [userInputName, userInputPhone]);
    
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
            <Logo className='logo mb-10' >
                EzenMusic
            </Logo>
            <div className='mb-10'>
                
            </div>
            <FindFormCover className='login-form border-2 w-[700px] h-[500px]'>
                {
                    findIdResultState === 'notyet' ?

                    <form onSubmit={submitFindIdData} className='h-[400px] flex flex-col align-items-center justify-center'>
                        <p className='text-[35px] font-bold mb-5'>아이디 찾기</p>
                        <input type="text" id='userId' className='input-text' placeholder='이름' onChange={e=>setUserInputName(e.target.value)}/>
                        <input type="text" id='userPw' className='input-text' placeholder='전화번호 (-포함)' onChange={e=>setUserInputPhone(e.target.value)}/>
                        <button type='submit' id='loginButton' className='submit-able' ref={findButtonRef}>
                            다음
                            {/* button-active 라는 클래스 주어져야 넘어갈 수 있게 처리할 예정 */}
                        </button>
                    </form>

                    : findIdResultState === 'success' ?

                    <FindSuccessCover className='h-[400px] flex flex-col align-items-center justify-center'>
                        <p className='text-[35px] font-bold mb-5'>{userInputName} 님의 아이디</p>
                        <div className='find-result border-t-2 border-b-2 h-[100px]'>
                            <BsCheckSquareFill/>
                            <div className='result-box '>
                                <span className='user-email'>
                                    {userId}
                                </span>
                                <span className='user-ticket-info'>
                                    {userTicketType}
                                </span>
                            </div>
                        </div>
                        <button type='button' id='go-signin'>
                            <Link to='/signin'>로그인 페이지로 이동</Link>
                            {/* button-active 라는 클래스 주어져야 넘어갈 수 있게 처리할 예정 */}
                        </button>
                    </FindSuccessCover>

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

export default FindId

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

const FindSuccessCover = styled.div`
    width: 100%;
    .find-result{
        width: 70%;
        height: 80px;
        margin-bottom: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: start;
        svg{
            width: 25px;
            height: 25px;
            color: var(--main-theme-color);
        }
        .result-box{
            display: flex;
            flex-direction: column;
            justify-content: start;
            margin-left: 10px;
            .user-email{
                font-size: 18px;
                color: var(--main-text-color);
            }
            .user-ticket-info{
                font-size: 16px;
                color: #aaaaaa
            }
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