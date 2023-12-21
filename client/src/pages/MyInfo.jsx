import React, { useState, useContext, useEffect } from 'react'
import WiderMainStyledSection from '../layout/WiderMainStyledSection';
import { ReactComponent as EmptyMusic } from '../assets/emptyMusic.svg';
import styled from 'styled-components';
import axios from 'axios'
import { AppContext } from '../App'
import { getCookie } from '../config/cookie'
import { sessionExpiredLogoutMethod } from '../methods/sessionExpired';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { voucherSwitch } from '../methods/voucherSwitch';
import WithDraw from '../modal/WithDraw';

const MyInfo = () => {
    const isSessionValid = JSON.parse(useContext(AppContext));
    const [ userData, setUserData ] = useState('');
    const [ withdrawModalOpen, setWithdrawModalOpen ] = useState(false);
    
    const getdata = async () =>{
        await axios.post(`/verifiedClient/info`,{token: getCookie('connect.sid'), user_id: getCookie('client.sid')}).then((res)=>{
            if(res.data.valid === false){
                sessionExpiredLogoutMethod(true);
            }else{           
                res.data.plan_type = voucherSwitch(res.data.plan_type);
                setUserData(res.data);
            }
        }).catch((error)=>{console.log(error)});
    }

    const withdraw = () => {
        setWithdrawModalOpen(true);
    }

    useEffect(()=>{
        getdata();
    },[]);

    return (
        <WiderMainStyledSection>
            {
                isSessionValid ? 
                <div>
                    <h1 className='text-[26px] font-semibold py-[30px]'>정보 관리</h1>
                    <UserInfoBox className=' w-full p-5 flex align-items-center justify-between'>
                        <div className='w-full flex flex-col justify-between align-items-start'>
                            <div className='user-email'>
                                {userData.email}
                            </div>
                            <div className='user-ticket'>
                                {userData.plan_type}
                            </div>
                        </div>
                        
                        {
                            userData.purchase === 0 &&
                            <div className='move-purchase-link w-[100px]'>
                                <Link to={'../purchase/voucher'}>이용권 구매</Link>
                            </div>
                        }
                    </UserInfoBox>
                    <ChangeUserInfo>
                        <div>
                            <NavLink to='password' className={({ isActive }) => isActive ? "nav-menu active" : "nav-menu"}>
                                비밀번호 변경
                            </NavLink>
                            <NavLink to='phone' className={({ isActive }) => isActive ? "nav-menu active" : "nav-menu"}>
                                휴대폰 번호 변경
                            </NavLink>
                        </div>
                        <div className='withdraw'>
                            <button onClick={() => withdraw()}>
                                회원탈퇴
                            </button>
                            {withdrawModalOpen && <WithDraw setModalOpen={setWithdrawModalOpen}/>}
                        </div>
                    </ChangeUserInfo>
                    <Outlet />
                </div>
                :
                <div className='guest-page flex flex-col align-items-center justify-center my-[150px]'>
                    <EmptyMusic />
                    <p className='font-semibold my-2'>로그인해주세요</p>
                    <p className='text-[15px] mb-4' style={{color: "#989898"}}>로그인하시면 더욱 더 다양한 EZEN MUSIC을 즐길 수 있어요.</p>
                    <LoginButton to='/signin'>로그인</LoginButton>
                </div>
            }
            
        </WiderMainStyledSection>
    )
}

export default MyInfo

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
    border-radius: 8px;
    display: inline-flex;
    &:hover{
        color: var(--main-text-white);
        background-color: rgb(63, 63, 255);
        transition: all 0.5s ease;
    }
`;
const UserInfoBox = styled.div`
    border: 2px solid #eee;
    border-radius: 5px;
    >div{

        .user-email{
            padding-bottom: 10px;
            font-size: 25px;
            font-weight: 700;
        }
        .user-ticket{
            font-size: 15px;
            color: #999;
        }
    }
    .move-purchase-link{
        font-size: 16px;
        font-weight: 700;
        color: #3f3fff;
    }
`;

const ChangeUserInfo = styled.div`
    width: 100%;
    height: 100px;
    margin: 15px 0  10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .nav-menu{
        padding: 5px 15px;
        border-radius: 30px;
        font-size: 17px;
        font-weight: 400;
        a{
            width: 78px;
            height: 34px;
            
        }
        &:hover{
            color: var(--main-theme-color);
        }
    }
    .nav-menu.active{
        background-color: var(--main-theme-color);
        color: var(--main-text-white);
    }
    .withdraw{
        &:hover{
            color: var(--main-theme-color);
        }
        button{

        }
    }
`;