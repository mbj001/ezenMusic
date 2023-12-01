import React from 'react'
import styled from 'styled-components'

function PlayerBanner({playerBannerOn, setPlayerBannerOn, count, page}) {

    setTimeout(() => {setPlayerBannerOn(false);}, 1500);

    return (
    <>
    {
        playerBannerOn ?
        <StyledLikeyBanner>
            {
                page === "channel" || page ==="albumtrack" ?
                <p>음악 재생목록에 담겼어요. 중복곡은 담지 않았어요.</p>
                :
                <p>{count} 곡이 음악 재생목록에 담겼어요. 중복곡은 담지 않았어요.</p> 
            }
        </StyledLikeyBanner>
        :
        ""
    }
    </>
    )
}

export const StyledLikeyBanner = styled.div`
    position: fixed;
    bottom: 80px;
    width: 100%;
    left: 0;
    height: 80px;
    background-color: rgb(36, 36, 36);
    z-index: 101;

    p{
        color: white;
        font-size: 15px;
        text-align: center;
        line-height: 75px;
    }
`

export default PlayerBanner