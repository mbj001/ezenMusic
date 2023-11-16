import React from 'react'
import styled from 'styled-components'

const ChangePassword = () => {
    return (
        <UserInfoBox>
            비밀번호 변경
        </UserInfoBox>
    )
}

export default ChangePassword

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
