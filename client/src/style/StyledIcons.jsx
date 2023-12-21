import styled from 'styled-components';
// export const aa = styled.button`
//     background-image: url(/image/icon_.png);

//     &:hover{
//         background-image: url(/image/icon_.png);
//     }
//     &:active{
//         background-image: url(/image/icon_.png);
//     }
// `;

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
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -179px -209px;
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
/**
 * TinyPlayButton 쓰려면 image 담고있는 div 박스 아래에 넣고,
 * div랑 이 버튼 담고있는 div 에 position: relative 넣어줘야함
 */
export const TinyPlayButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -315px -472px;
    width: 37px;
    height: 37px;
    position: absolute;
    right: 15px;
    bottom: 15px;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -308px -226px;
        width: 37px;
        height: 37px;
    }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -357px -472px;
        width: 37px;
        height: 37px;
    }
`;
// 살짝 투명하고 조금 더 작은 재생버튼
export const TransTinyPlayButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -180px -105px;
    width: 32px;
    height: 32px;
    position: absolute;
    right: 11px;
    // bottom: 15px;
    top: 128px;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -143px -105px;
        width: 32px;
        height: 32px;
    }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -156px -558px;
        width: 32px;
        height: 32px;
    }
`;

// 메인배너용 재생 버튼
export const MainTinyPlayButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -315px -472px;
    width: 37px;
    height: 37px;
    position: absolute;
    top: 127px;
    right: 15px;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -308px -226px;
        width: 37px;
        height: 37px;
    }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -357px -472px;
        width: 37px;
        height: 37px;
    }
`;


// MusicListCard.jsx -> 재생버튼
export const MusicListCardPlayButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -467px -92px;
    width: 41px;
    height: 41px;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -467px -46px;
        width: 41px;
        height: 41px;
    }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -467px -138px;
        width: 41px;
        height: 41px;
    }
`;

// MusicListCard.jsx -> 현재 재생목록 담기 버튼
export const MusicListCardAddPlaylistButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -467px -230px;
    width: 41px;
    height: 41px;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -467px -184px;
        width: 41px;
        height: 41px;
    }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -467px -276px;
        width: 41px;
        height: 41px;
    }
`;

// MusicListCard.jsx -> 플레이리스트에 담기 버튼
export const MusicListCardAddMyListButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -368px -380px;
    width: 41px;
    height: 41px;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -322px -380px;
        width: 41px;
        height: 41px;
    }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -414px -380px;
        width: 41px;
        height: 41px;
    }
`;

// musicListCard -> 점 세개
export const MusicListCardSeeMoreButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -184px -380px;
    width: 41px;
    height: 41px;

    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -138px -380px;
        width: 41px;
        height: 41px;
    }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -230px -380px;
        width: 41px;
        height: 41px;
    }
`;


// ArtistAlbum -> 앨범에 달린 버튼 세개
export const ArtistAlbumAddPlaylistButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -196px -663px;
    width: 23px;
    height: 23px;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -56px -663px;
        width: 23px;
        height: 23px;z
    }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -112px -663px;
        width: 23px;
        height: 23px;
    }
`;

export const ArtistAlbumAddMylistButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: 0 -663px;
    width: 23px;
    height: 23px;
    &:hover{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -392px -352px;
        width: 23px;
        height: 23px;
    }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -28px -663px;
        width: 23px;
        height: 23px;
    }
`;

// 작은 빈하트
export const ArtistAlbumLikeButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -336px -268px;
    width: 23px;
    height: 23px;
    // &:hover{
    //     background-image: url(/image/icon_.png);
    //     background-size: 714px 706px;
    //     background-position: -392px -324px;
    //     width: 23px;
    //     height: 23px;
    // }
    &:active{
        background-image: url(/image/icon_.png);
        background-size: 714px 706px;
        background-position: -336px -296px;
        width: 23px;
        height: 23px;
    }
`;

// 작은 채워진 하트
export const ArtistAlbumFilledHeartButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -392px -324px;
    width: 23px;
    height: 23px;
    
`;

// artist.jsx -> 하트 아이콘
// 큰 빈 하트
export const ArtistLikeButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -421px -138px;
    width: 41px;
    height: 41px;
    // &:hover{
    //     background-image: url(/image/icon_.png);
    //     background-size: 714px 706px;
    //     background-position: -392px -324px;
    //     width: 41px;
    //     height: 41px;
    // }
    // &:active{
    //     background-image: url(/image/icon_.png);
    //     background-size: 714px 706px;
    //     background-position: -336px -296px;
    //     width: 41px;
    //     height: 41px;
    // }
`;
// 큰 채워진 하트
export const ArtistFilledHeartButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -421px -230px;
    width: 41px;
    height: 41px;
    
`;

// 내 리스트 생성 후 음악 추가 닫기버튼
export const CloseButton = styled.button`
    background-image: url(/image/icon_.png);
    background-size: 714px 706px;
    background-position: -302px -632px;
    width: 25px;
    height: 25px;
`;