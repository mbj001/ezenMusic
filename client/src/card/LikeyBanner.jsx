import React from 'react'
import styled from 'styled-components'

function LikeyBanner({likeyBannerOn, setLikeyBannerOn, pageDivision}) {

    if(likeyBannerOn === 1 || likeyBannerOn === -1){
        setTimeout(() => {setLikeyBannerOn(0);}, 1500);
    }

    return (
    <>
    { likeyBannerOn === -1 && pageDivision === "track" && <StyledLikeyBanner> <p>좋아요 한 곡이 취소되었습니다.</p> </StyledLikeyBanner> }
    { likeyBannerOn === 1 && pageDivision === "track" && <StyledLikeyBanner> <p>좋아요 한 곡에 담겼습니다.</p> </StyledLikeyBanner> }
    { likeyBannerOn === -1 && pageDivision === "album" && <StyledLikeyBanner> <p>앨범 좋아요가 취소되었습니다.</p> </StyledLikeyBanner> }
    { likeyBannerOn === 1 && pageDivision === "album" && <StyledLikeyBanner> <p>앨범 좋아요에 담겼습니다.</p> </StyledLikeyBanner> }
    { likeyBannerOn === -1 && pageDivision === "theme" && <StyledLikeyBanner> <p>테마리스트 좋아요가 취소되었습니다.</p> </StyledLikeyBanner> }
    { likeyBannerOn === 1 && pageDivision === "theme" && <StyledLikeyBanner> <p>테마리스트 좋아요에 담겼습니다.</p> </StyledLikeyBanner> }
    { likeyBannerOn === -1 && pageDivision === "artist" && <StyledLikeyBanner> <p>아티스트 좋아요가 취소되었습니다.</p> </StyledLikeyBanner> }
    { likeyBannerOn === 1 && pageDivision === "artist" && <StyledLikeyBanner> <p>아티스트 좋아요에 담겼습니다.</p> </StyledLikeyBanner> }    
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
    z-index: 9999999;

    p{
        color: white;
        font-size: 15px;
        text-align: center;
        line-height: 75px;
    }
`

export default LikeyBanner