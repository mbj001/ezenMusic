import React from 'react'
import styled from 'styled-components';

const WiderMainStyledSection = ({children}) => {
    return (
        <MainStyle className='main md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
            <div className='main-inner'>
                {children}
            </div>
        </MainStyle>
    )
}

export default WiderMainStyledSection

const MainStyle = styled.section`
    
    margin: 0 auto;
    .main-inner{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
`;