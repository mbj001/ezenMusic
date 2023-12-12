import React from 'react'
import styled from 'styled-components'

function AlbumIntro({album_title, artist_name, intro, publisher, agency}) {
    return (
        <StyledDetails>
    
            <div className="album_intro">
                <p><span className="text-[15px] mr-[50px]">앨범명</span> <span className="text-gray font-normal text-[14px]">{album_title}</span></p>
                <p className="my-[10px]"><span className="text-[15px] mr-[35px]">아티스트</span> <span className="text-gray font-normal text-[14px]">{artist_name}</span></p>
                <div className="my-[10px]">
                    { publisher && <p><span className="text-[15px] mr-[50px]">발매사</span> <span className="text-gray font-normal text-[14px]">{publisher}</span></p> }
                </div>
                <div className="my-[10px]">
                    { agency && <p><span className="text-[15px] mr-[50px]">기획사</span> <span className="text-gray font-normal text-[14px]">{agency}</span></p> }
                </div>
            </div>
            <div className="album_intro mt-[50px]">
                <p className="text-[15px] mb-[40px]">앨범소개</p>
                {
                    intro?
                    <p className="lyrics text-gray font-normal text-[14px] leading-[26px]">{intro}</p>
                    :
                    <div className="text-center mt-[100px]">
                        <img src="/image/notintro.svg" alt="notintroimage" className="m-auto"/>
                        <div>
                            <p>앗!</p>
                            <p className="text-[14px] text-gray mt-[10px]">등록된 앨범 소개가 없어요.</p>
                        </div>
                    </div>
                }
            </div>
        </StyledDetails>
      )
}


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

    .lyrics{
        white-space: pre-wrap;
    }

    .active{
        background-color: var(--main-theme-color);
        color: white
    }
`


export default AlbumIntro