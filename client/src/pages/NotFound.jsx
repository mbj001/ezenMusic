import React from 'react'
import MainStyledSection from '../layout/MainStyledSection'
import styled from 'styled-components'

const NotFound = () => {
    return (
        <MainStyledSection>
            <NotFoundBox>
            </NotFoundBox>
        </MainStyledSection>
    )
}

export default NotFound

const NotFoundBox = styled.div`
    width: 100%;
    height: 500px;
    margin: 0 auto;
    background-image: url(/image/NotFound.jpg);
    background-repeat: no-repeat;
    background-size: contain;
`;