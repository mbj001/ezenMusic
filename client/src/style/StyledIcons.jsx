import styled from 'styled-components';

// 가운데 세모 투명한 재생버튼
// card/MainBanner.jsx
export const PlayButtonTrans = styled.div`
    width: 54px;
    height: 54px;
    overflow: hidden;
    border-radius: 50%;
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -120px -209px;
    cursor: pointer;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -61px -209px;
        width: 54px;
        height: 54px;
    } 
`;

// 가운데 세모 검정색 재생버튼 
// components/Artist.jsx
export const PlayButton = styled.div`
    width: 60px;
    height: 60px;
    overflow: hidden;
    border-radius: 50%;
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -65px -143px;
    cursor: pointer;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: 0 -143px;
        width: 60px;
        height: 60px;
    } 
`;

// 메인 페이지 박스에 달린 작은 세모 재생버튼
export const TinyPlayButton = styled.div``;