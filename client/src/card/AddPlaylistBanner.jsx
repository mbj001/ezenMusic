import React from 'react'
import styled from 'styled-components'

function AddPlaylistBanner({addPlaylistBannerOn, setAddPlaylistBannerOn}) {

    setTimeout(() => {setAddPlaylistBannerOn(false);}, 1500);

    return (
    <>
    { addPlaylistBannerOn === true && <StyledPlaylistBanner> <p>내 리스트에 담겼어요. 중복곡 또는 음원 제공사의 요청으로 들을 수 없는 곡은 담지 않았어요.</p> </StyledPlaylistBanner> }
    </>
    )
}


export const StyledPlaylistBanner = styled.div`
    position: fixed;
    bottom: 80px;
    width: 100%;
    left: 0;
    height: 80px;
    background-color: rgb(36, 36, 36);
    z-index: 1000001;

    p{
        color: white;
        font-size: 15px;
        text-align: center;
        line-height: 75px;
    }
`


export default AddPlaylistBanner