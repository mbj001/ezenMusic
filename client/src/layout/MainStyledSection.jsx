import React from 'react'
import styled from 'styled-components';

const MainStyledSection = ({children}) => {
    return (
        <MainStyle className='main'>
            <div className='main-inner'>
                {children}
            </div>
        </MainStyle>
    )
}

export default MainStyledSection

const MainStyle = styled.section`
    width: 60%;
    min-width: 955px;
    max-width: 1600px;
    height: 100%;
    padding: 0px 0 40px 80px;
    padding-right: 80px;
    margin: 0 auto;
    background-color: #fff;
    @media screen and (max-width:955px) {
        padding:0px 30px 40px;
    }
`;