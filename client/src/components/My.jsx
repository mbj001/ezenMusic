import React, { useState, useRef, useContext, useEffect } from 'react'
import { ReactComponent as EmptyMusic } from '../assets/emptyMusic.svg';
import styled from 'styled-components';
import { PurchaseBox } from '../layout/PurchaseBoxLayout';
import { Link } from 'react-router-dom';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
import { AppContext } from '../App'

const My = () => {
    const login = useContext(AppContext);
    const [ loginStatus, setLoginStatus ] = useState(login);
    const [ userTicket, setUserTicket ] = useState('none');
    
    const showUsedTicket = useRef();
    const iconDown = useRef();
    const iconUp = useRef();
    const showInfo = () => {
        showUsedTicket.current.classList.toggle('d-none');
        iconDown.current.classList.toggle('d-none');
        iconUp.current.classList.toggle('d-none');
        console.log(showUsedTicket.current);
    }
    useEffect(()=>{
        setLoginStatus(login);
    },[login]);
    return (
        <div>
            {
                loginStatus === 'false' ? 
                <div className='guest-page flex flex-col align-items-center justify-center my-[150px]'>
                    <EmptyMusic />
                    <p className='font-semibold my-2'>로그인해주세요</p>
                    <p className='text-[15px] mb-4' style={{color: "#989898"}}>로그인하시면 더욱 더 다양한 EZEN MUSIC을 즐길 수 있어요.</p>
                    <LoginButton to='/signin'>로그인</LoginButton>
                </div>
                :
                <>
                    <ClientPage>
                        <p className='ticket now-on-ticket'>사용 중인 이용권</p>
                        <PurchaseBox>
                            {
                                userTicket === "none" ?
                                <div className='w-full flex flex-col align-items-center justify-center'>
                                    <p className='ticket-404'>사용중인 이용권이 없습니다.</p>
                                    <Link to='../voucher'><BuyButton>이용권 구매</BuyButton></Link>
                                </div>
                                :
                                <p></p>
                            }
                        </PurchaseBox>
                    </ClientPage>

                    <ClientPage>
                        <p className='ticket used-ticket mt-5'>
                            <button type='button' onClick={showInfo} className='flex justify-start align-items-center'>
                                사용 완료된 이용권 
                                <span className='' ref={iconDown}><RiArrowDownSLine/></span> 
                                <span className='d-none' ref={iconUp}><RiArrowUpSLine/></span>
                            </button>
                        </p>
                        <PurchaseBox className='d-none' ref={showUsedTicket}>
                            <div className='w-full flex align-items-center justify-center'>
                                <p className='ticket-404'>사용 완료 내역이 없습니다.</p>
                            </div>
                        </PurchaseBox>
                    </ClientPage>
                </>
                
            }
        </div>
    )
}

export default My

const ClientPage = styled.div`
    .ticket{
        font-size: 14px;
        line-height: 20px;
        color: #555;
        margin-bottom: 15px;
    }
    .ticket-404{
        font-size: 18px;
        color: #555;
        margin-bottom: 20px;
    }
`;

const LoginButton = styled(Link)`
    color: rgb(63, 63, 255);
    align-items: center;
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
    line-height: 32px;
    text-align: center;
    vertical-align: top;
    border: 1px solid rgb(63, 63, 255);
    border-radius: 16px;
    display: inline-flex;
    &:hover{
        color: var(--main-text-white);
        background-color: rgb(63, 63, 255);
        transition: all 0.5s ease;
    }
`;

const BuyButton = styled.button`
    padding: 10px 30px;
    border-radius: 30px;
    font-size: 15px;
    font-weight: 400;
    background-color: var(--main-theme-color);
    color: var(--main-text-white);
`;

const ShowUsedTicketInfo = styled.p``;