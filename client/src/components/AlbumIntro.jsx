import React from 'react'
import styled from 'styled-components'

function AlbumIntro({album_title, artist_name, intro, publisher, agency}) {
    return (
        <StyledDetails>
            <div className="album-info">
                <p><span className="text-[15px] mr-[50px]">앨범명</span> <span className="text-gray font-normal text-[14px]">{album_title}</span></p>
                <p className="my-[10px]"><span className="text-[15px] mr-[35px]">아티스트</span> <span className="text-gray font-normal text-[14px]">{artist_name}</span></p>
                <div className="my-[10px]">
                    { publisher && <p><span className="text-[15px] mr-[50px]">발매사</span> <span className="text-gray font-normal text-[14px]">{publisher}</span></p> }
                </div>
                <div className="my-[10px]">
                    { agency && <p><span className="text-[15px] mr-[50px]">기획사</span> <span className="text-gray font-normal text-[14px]">{agency}</span></p> }
                </div>
            </div>
            <AlbumDescription>
                <div className="description-title mb-[40px]">
                    <span>앨범소개</span>
                </div>
                <div className='album-description-section'>
                    {
                        intro?
                        <p className="description">{intro}</p>
                        :
                        <div className="no-description">
                            <img src="/image/notintro.svg" alt="notintroimage"/>
                            <div className='message'>
                                <p className='att'>앗!</p>
                                <p>등록된 앨범 소개가 없어요.</p>
                            </div>
                        </div>
                    }
                </div>
            </AlbumDescription>
        </StyledDetails>
    )
}

// 승렬
const AlbumDescription = styled.div`
    overflow: hidden;
    .description-title{
        color: #333;
        font-size: 14px;
        font-weight: 400;
        margin-top: 20px;
    }
    .album-description-section{
        overflow: hidden;
        .description{
            font-size: 15px;
            font-weight: 400px;
            color: #333;
            white-space: pre-wrap;
            line-height: 27px;
        }
        .no-description{
            text-align: center;
            padding-top: 100px;
            padding-bottom: 100px;
            img{
                width: 180px;
                height: 130px;
                margin-right: auto;
                margin-left: auto;
            }
            .message{
                p{
                    font-size: 15px;
                    color: #989898;
                }
                p.att{
                    font-size: 17px;
                    font-weight: 600;
                    color: #333;
                }
            }
        }
    }
`;


const StyledDetails = styled.div`
width: 100%;
    margin: 0 20px;

    img{
        width: 230px;
        border-radius: 10px;
    }

    .detail-title{
        font-size: 28px;
        font-weight: 700;
    }

    .active{
        background-color: var(--main-theme-color);
        color: white
    }
`


export default AlbumIntro