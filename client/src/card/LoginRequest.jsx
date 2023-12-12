import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

function LoginRequest() {
  return (
    <StyledLoginRequest>
      <div className="text-center">
          <img src="/image/page/logincheck.svg" alt="#" className="mx-auto mt-[150px]"/>
          <p className="font-bold text-gray-dark mb-[10px]">로그인해주세요</p>
          <p className="mb-[30px] text-[14px] text-gray">로그인하시면 더욱 더 다양한 MUSIC을 즐길 수 있어요</p>
          <LoginButton to='/signin'>로그인</LoginButton>
      </div>
    </StyledLoginRequest>
  )
}
export default LoginRequest

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

const StyledLoginRequest = styled.div`

    margin-bottom: 150px;

    img{
        width: 180px;
        height: 130px;
    }
    button{
        margin-top: 5px;
        border: 1px solid var(--main-text-gray-lighter);
        padding: 5px 10px;
        border-radius: 20px;
    }
`