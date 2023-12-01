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
        <Link to="/signin" className="border-1 border-blue text-blue px-[15px] py-[5px] rounded-[25px]">로그인</Link>
    </div>
    </StyledLoginRequest>
  )
}


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

export default LoginRequest