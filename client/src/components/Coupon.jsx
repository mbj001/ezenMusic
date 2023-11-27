import React, { useState, useRef, useContext, useEffect } from 'react'
import { ReactComponent as EmptyMusic } from '../assets/emptyMusic.svg';
import styled from 'styled-components';
import MainStyledSection from '../layout/MainStyledSection'
import { Link } from 'react-router-dom';
import { AppContext } from '../App';

const Coupon = () => {
    const isSessionValid = JSON.parse(useContext(AppContext));
    const [loginStatus, setLoginStatus] = useState(isSessionValid);
    const couponSubmit = useRef();
    const captureInput = (e) =>{
        if(e.target.value !== ''){
            couponSubmit.current.classList.add('active');
        }else{
            couponSubmit.current.classList.remove('active');
        }
    }
    useEffect(()=>{
        setLoginStatus(isSessionValid);
    },[isSessionValid]);

    return (
        <div>
            {
                loginStatus === 'false' ? 
                <div className='flex flex-col align-items-center justify-center my-[150px]'>
                    <EmptyMusic />
                    <p className='font-semibold my-2'>로그인해주세요</p>
                    <p className='text-[15px] mb-4' style={{color: "#989898"}}>로그인하시면 더욱 더 다양한 EZEN MUSIC을 즐길 수 있어요.</p>
                    <LoginButton to='/signin'>로그인</LoginButton>
                </div>
                :
                <MainStyledSection>
                    <CouponPage>
                        <form action='' method='post' className='flex flex-col align-items-center justify-center'>
                            <input type="text" placeholder='쿠폰 코드 입력 (하이픈/공백 제외)' onChange={captureInput}/>
                            <button type='submit' className='submit-able' onClick={e=>e.preventDefault()} ref={couponSubmit} >
                                등록하기
                            </button>
                        </form>
                    </CouponPage>
                </MainStyledSection>
            }
        </div>
    )
}

export default Coupon
//비로그인 상태 로그인 버튼
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

//로그인 상태 쿠폰 등록 페이지
const CouponPage = styled.div`
    width: 100%;
    height: 300px;
    border: 1px solid #aaaaaa;
    border-radius: 8px;

    >form{
        width: 100%;
        height: 100%;
        input{
            width: 50%;
            height: 70px;
            margin-bottom: 20px;
            border-bottom: 1px solid #aaaaaa;
            text-align: center;
            &::placeholder{
                text-align: center;
            }
            &:focus{
                outline: 3px solid #333 !important;
                border-radius: 3px;
            }
        }
        button{
            width: 50%;
            height: 70px;
            color: var(--main-text-white);
            background-color: var(--main-theme-color);
            opacity: 0.6;
            font-size: 19px;
        }
        .active{
            opacity: 1 !important;
        }
    }
`;