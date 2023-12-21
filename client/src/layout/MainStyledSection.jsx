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
    width: 1000px;
    margin: 0 auto;
    .main-inner{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
`;