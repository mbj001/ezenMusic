import React, { useState, useContext, useEffect } from 'react'
import { ReactComponent as EmptyMusic } from '../assets/emptyMusic.svg';
import styled from 'styled-components';
import { PurchaseBox } from '../layout/PurchaseBoxLayout';
import { Link } from 'react-router-dom';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri'
import { AppContext } from '../App'
import { voucherSwitch } from '../methods/voucherSwitch';
import axios from 'axios';
import { getCookie } from '../config/cookie';

const My = () => {
    const isSessionValid = JSON.parse(useContext(AppContext));
    const [ userTicket, setUserTicket ] = useState({});
    const [ standbyVoucher, setStandbyVoucher ] = useState({purchase: false});
    const [ expiredVoucher, setExpiredVoucher ] = useState({});
    const [ showExpiredVoucher, setShowExpiredVoucher ] = useState(false);
    
    const getUserVoucherInfo = async() =>{
        const userVoucher = await axios.post('/verifiedClient/getVoucher', {token: getCookie('connect.sid'), user_id: getCookie('client.sid')});
        if(userVoucher.data.purchase){
            userVoucher.data.plan_type = voucherSwitch(userVoucher.data.plan_type);
            setUserTicket(userVoucher.data);
            getStandbyVoucherInfo();
        }else{
            setUserTicket(userVoucher.data);
        }
    }

    const getStandbyVoucherInfo = async() => {
        const standbyVoucherData = await axios.post('/verifiedClient/getStandbyVoucher', {token: getCookie('connect.sid'), user_id: getCookie('client.sid')});
        standbyVoucherData.data.plan_type = voucherSwitch(standbyVoucherData.data.plan_type);
        setStandbyVoucher(standbyVoucherData.data);
    }

    const getExpiredVoucherInfo = async() => {
        const expiredVoucherData = await axios.post('/verifiedClient/getExpiredVoucher', {token: getCookie('connect.sid'), user_id: getCookie('client.sid')});
        expiredVoucherData.data.forEach((list)=>{
            list.plan_type = voucherSwitch(list.plan_type);
        })
        setExpiredVoucher(expiredVoucherData.data);
    }

    const showExpired = () => {
        if(showExpiredVoucher){
            setShowExpiredVoucher(false);    
        }else{
            setShowExpiredVoucher(true);
        }
    }

    useEffect(()=>{
        if(isSessionValid){
            getUserVoucherInfo();
            getExpiredVoucherInfo();
        }
    }, []);


    return (
        <div>
            {
                isSessionValid === false ? 
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
                                userTicket.purchase === false ?
                                <div className='w-full flex flex-col items-center justify-center'>
                                    <p className='ticket-404'>사용중인 이용권이 없습니다.</p>
                                    <Link to='../voucher'><BuyButton>이용권 구매</BuyButton></Link>
                                </div>
                                :
                                <HaveVoucher className='w-full flex flex-row items-center justify-between'>
                                    <div className='flex flex-col items-start justify-between'>
                                        <p className='plan_type'>{userTicket.plan_type}</p>
                                        <div>
                                            <span className='info-title'>구매일자</span>
                                            <span className='info'>{userTicket.purchase_date}</span>
                                        </div>
                                        <div>
                                            <span className='info-title'>이용기한</span>
                                            <span className='info'>{userTicket.renewal_date}</span>
                                        </div>
                                        <div>
                                            <span className='info-title'>결제설정</span>
                                            <span className='info'>자동결제</span>
                                        </div>
                                        {
                                            userTicket.remaining_number !== null &&
                                            <div>
                                                <span className='info-title'>잔여 곡 수</span>
                                                <span className='info'>{userTicket.remaining_number}</span>
                                            </div>
                                        }
                                        
                                    </div>
                                    <div>

                                    </div>
                                </HaveVoucher>
                            }
                        </PurchaseBox>
                    </ClientPage>

                    <ClientPage>
                        <p className='ticket now-on-ticket'>사용 대기 이용권</p>
                        <PurchaseBox>
                            {
                                standbyVoucher.purchase === false ?
                                <div className='w-full flex flex-col items-center justify-center'>
                                    <p className='ticket-404'>사용대기 이용권이 없습니다.</p>
                                    <Link to='../voucher'><BuyButton>이용권 구매</BuyButton></Link>
                                </div>
                                :
                                <HaveStandByVoucher className='w-full flex flex-row items-center justify-between'>
                                    <div className='flex flex-col items-start justify-between'>
                                        <p className='plan_type'>{standbyVoucher.plan_type}</p>
                                        <div>
                                            <span className='info-title'>이용시작</span>
                                            <span className='info'>{standbyVoucher.purchase_date}</span>
                                        </div>
                                        <div>
                                            <span className='info-title'>이용종료</span>
                                            <span className='info'>{standbyVoucher.renewal_date}</span>
                                        </div>
                                        <div>
                                            <span className='info-title'>결제설정</span>
                                            <span className='info'>자동결제</span>
                                        </div>
                                        {
                                            standbyVoucher.remaining_number !== null &&
                                            <div>
                                                <span className='info-title'>잔여 곡 수</span>
                                                <span className='info'>{standbyVoucher.remaining_number}</span>
                                            </div>
                                        }
                                        
                                    </div>
                                    <div>
                                        
                                    </div>
                                </HaveStandByVoucher>
                            }
                        </PurchaseBox>
                    </ClientPage>

                    <ClientPage>
                        <p className='ticket used-ticket mt-5'>
                            <button type='button' onClick={showExpired} className='flex justify-start align-items-center'>
                                사용 완료된 이용권 
                                {
                                    showExpiredVoucher ? <span><RiArrowUpSLine/></span> : <span><RiArrowDownSLine/></span>
                                }
                            </button>
                        </p>
                        {
                            showExpiredVoucher && 
                            <PurchaseBox>
                                {
                                    expiredVoucher.length >= 1 ? 
                                    <>
                                    {
                                        expiredVoucher && expiredVoucher.map((data)=>{
                                            return (
                                                <HaveExpiredVoucher  className='w-full flex flex-col items-center justify-center '>
                                                    <div className='w-full flex flex-col items-start justify-between'>
                                                        <p className='plan_type'>{data.plan_type}</p>
                                                        <div>
                                                            <span className='info-title'>이용시작</span>
                                                            <span className='info'>{data.purchase_date}</span>
                                                        </div>
                                                        <div>
                                                            <span className='info-title'>이용종료</span>
                                                            <span className='info'>{data.renewal_date}</span>
                                                        </div>
                                                        {
                                                            data.remaining_number !== null &&
                                                            <div>
                                                                <span className='info-title'>잔여 곡 수</span>
                                                                <span className='info'>{data.remaining_number}</span>
                                                            </div>
                                                        }
                                                        
                                                    </div>
                                                    <div>
                                                        
                                                    </div>
                                                </HaveExpiredVoucher>
                                            )
                                        })
                                    }
                                    </>
                                    
                                    :
                                    <div className='w-full flex align-items-center justify-center'>
                                        <p className='ticket-404'>사용 완료 내역이 없습니다.</p>
                                    </div>
                                }
                            </PurchaseBox>
                        }
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

const HaveVoucher = styled.div`
    div{
        .plan_type{
            font-size: 27px;
            font-weight: 600;
            line-height: 1.2;
            color: #000;
            margin-bottom: 15px;
            position: relative;
            &::after{
                display: block;
                content: '이용중';
                position: absolute;
                font-size: 12px;
                font-weight: 500;
                top: 15px;
                right: -45px;
                width: 35px;
                height: 12px;
                color: var(--signup-invalid-color);
            }
        }
        div{
            margin-bottom: 5px;
            .info-title{
                font-size: 16px;
                font-weight: 400;
                margin-right: 15px;
            }
            .info{
                font-size: 16px;
                font-weight: 400;
                color: rgb(189, 189, 189);
            }
        }
    }
`;

const HaveStandByVoucher = styled.div`
    div{
        .plan_type{
            font-size: 27px;
            font-weight: 600;
            line-height: 1.2;
            color: #000;
            margin-bottom: 15px;
            position: relative;
            &::after{
                display: block;
                content: '이용대기';
                position: absolute;
                font-size: 12px;
                font-weight: 500;
                top: 15px;
                right: -55px;
                width: 45px;
                height: 12px;
                color: var(--main-theme-color);
            }
        }
        div{
            margin-bottom: 5px;
            .info-title{
                font-size: 16px;
                font-weight: 400;
                margin-right: 15px;
            }
            .info{
                font-size: 16px;
                font-weight: 400;
                color: rgb(189, 189, 189);
            }
        }
    }
`;
const HaveExpiredVoucher = styled.div`
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #ccc;
    div{
        .plan_type{
            font-size: 27px;
            font-weight: 600;
            line-height: 1.2;
            color: #000;
            margin-bottom: 15px;
            position: relative;
            &::after{
                display: block;
                content: '이용완료';
                position: absolute;
                font-size: 12px;
                font-weight: 500;
                top: 15px;
                right: -55px;
                width: 45px;
                height: 12px;
                color: var(--main-text-black);
            }
        }
        div{
            margin-bottom: 5px;
            .info-title{
                font-size: 16px;
                font-weight: 400;
                margin-right: 15px;
            }
            .info{
                font-size: 16px;
                font-weight: 400;
                color: rgb(189, 189, 189);
            }
        }
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
