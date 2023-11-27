import React from 'react'
import styled from 'styled-components';

function GenreCard({genre, active}) {
    if(active === "true"){
        return (
            <StyledGenreCardActive><p>{genre}</p></StyledGenreCardActive>
            )
        }
        else{
            return (
            <StyledGenreCard><p>{genre}</p></StyledGenreCard>
        )
    }
}

const StyledGenreCard = styled.div`
    border: 1px solid #999;
    color: var(--main-text-gray);
    border-radius: 25px;
    padding: 7px 15px;
    margin: 10px 5px;
    cursor: pointer;

    &:hover {
        border: 1px solid var(--main-theme-color);
        color: var(--main-theme-color);
    }

    p{
        font-size: 14px;
    }
`

const StyledGenreCardActive = styled.div`
    color: white;
    background-color: var(--main-theme-color);
    border-radius: 25px;
    padding: 7px 15px;
    margin: 10px 5px;
    cursor: pointer;


    p{
        font-size: 14px;
    }
`
export default GenreCard