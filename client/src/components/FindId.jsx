import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { BsCheckSquareFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { voucherSwitch } from '../methods/voucherSwitch'

const FindId = () => {
    const [ findIdResultState, setfindIdResultState ] = useState('notyet');
    const [ userInputName, setUserInputName ] = useState('');
    const [ userInputPhone, setUserInputPhone ] = useState('');
    const [ userId, setUserId ] = useState([]);
    const [ active, setActive ] = useState(false);
    const [ userTicketType, setUserTicketType ] = useState([]);

    const findButtonRef = useRef();
    
    const submitFindIdData = async(e) => {
        e.preventDefault();
        if(active){
            await getDataFromServer();
        }else{
            // console.log('availableData = false');
        }
    }

    const getDataFromServer = async () => {
        const getData = await axios.post(`/guest/find`,{name: userInputName, phone: userInputPhone});
        if(getData.data.emptyData){
            setfindIdResultState('fail');
        }else{
            setfindIdResultState('success');

            let voucher = getData.data.ticket_type;
            voucher.forEach((data, index) => {
                voucher[index] = voucherSwitch(data);
            });

            setUserTicketType(voucher);
            setUserId(getData.data.user_id);
        }
    }

    useEffect(()=>{
        if(/^[가-힣]+$/.test(userInputName) && /^\d{3}-\d{3,4}-\d{4}$/.test(userInputPhone)){
            setActive(true);
        }else{
            setActive(false);
        }
    }, [userInputName, userInputPhone]);

    return (
        <div className="h-[700px] flex align-items-center justify-center flex-col">
            <Logo className='logo mt-[40px] mb-[30px]' >
            </Logo>
            <div className='mb-10'>
                
            </div>
            <FindFormCover className='login-form border-2 w-[700px] h-[600px]'>
                {
                    findIdResultState === 'notyet' ?

                    <form onSubmit={submitFindIdData} className='h-[400px] flex flex-col align-items-center justify-center'>
                        <p className='text-[35px] font-bold mb-5'>아이디 찾기</p>
                        <input type="text" id='userId' className='input-text' placeholder='이름' onChange={e=>setUserInputName(e.target.value)}/>
                        <input type="text" id='userPw' className='input-text' placeholder='전화번호 (-포함)' onChange={e=>setUserInputPhone(e.target.value)}/>
                        <button type='submit' id='loginButton' className={active ?'button-active mt-[30px]' : 'mt-[30px]'} disabled={active? false : true} ref={findButtonRef}>
                            다음
                        </button>
                    </form>

                    : findIdResultState === 'success' ?
                    
                    <FindSuccessCover className='h-[400px] flex flex-col align-items-center justify-center'>
                        <p className='text-[35px] font-bold mb-5'>{userInputName} 님의 아이디</p>
                        {
                            userId.map((data, index)=>{
                                return(
                                    <div key={index} className='find-result border-t-1'>
                                        <BsCheckSquareFill/>
                                        <div className='result-box '>
                                            <span className='user-email'>
                                                {data}
                                            </span>
                                            <span className='user-ticket-info'>
                                                {userTicketType[index]}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <button type='button' id='go-signin' className='mt-[30px] border-t-1'>
                            <Link to='/signin'>로그인 페이지로 이동</Link>
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

const FindSuccessCover = styled.div`
    width: 100%;
    .find-result{
        height: 100px;
        width: 70%;
        height: 80px;
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