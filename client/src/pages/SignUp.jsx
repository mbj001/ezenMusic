import React from 'react'
import MainStyledSection from '../layout/MainStyledSection'
import styled from 'styled-components'
import { AiOutlineMail } from "react-icons/ai";
import { RiKakaoTalkFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SignUp = () => {
    

    return (
        <MainStyledSection>
            <div className="">
                <div className="h-[550px] flex align-items-center justify-center flex-col">
                    <Logo className='logo mb-[50px]' >
                        
                    </Logo>
                    {/* <p>
                        다음 가입방법 중 하나를 선택하세요.
                    </p> */}
                    <div className='sign-up-choice w-full flex flex-col align-items-center justify-start'>
                        <SignUpWithEmail to={'email'} className='sign-up-with-email mt-12 flex flex-row align-items-center justify-center'>
                            <AiOutlineMail/>이메일 아이디로 가입하기
                        </SignUpWithEmail>
                        {/* <SignUpWithKakao to={'kakao'}  className='sign-up-with-kakao mt-4 flex flex-row align-items-center justify-center'>
                            <RiKakaoTalkFill/>카카오 계정으로 로그인
                        </SignUpWithKakao> */}
                    </div>
                </div>
            </div>
        </MainStyledSection>
    )
}

export default SignUp

const Logo = styled.div`
    width: 180px; 
    height: 30px;
    background-image: url(/Logo/Logo.svg);
    background-repeat: no-repeat;
    background-size: cover;
`;

const SignUpWithEmail = styled(Link)`
    width: 45%;
    height: 70px;
    color: var(--main-text-white);
    background-color: var(--main-theme-color);
    font-size: 19px;
    font-weight: 600;
    >svg{
        width: 19px;
        height: 19px;
        margin-right: 8px;
    }
`;
const SignUpWithKakao = styled(Link)`
    width: 45%;
    height: 70px;
    color: var(--main-text-black);
    background-color: var(--kakao-theme-color);
    font-size: 19px;
    font-weight: 600;
    >svg{
        width: 19px;
        height: 19px;
        margin-right: 8px;
    }
`;