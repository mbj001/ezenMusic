import React from 'react'
import styled from 'styled-components'
function Details({music_title, composer, lyricist, arranger, lyrics}) {

    return (
    <StyledDetails className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
        <div>
            <p><span className="mr-[15px]">곡명</span> <span className="text-gray font-normal text-[14px]">{music_title}</span></p>
            <div className="my-[10px]">
                { composer && <p><span className="mr-[15px]">작곡</span> <span className="text-gray font-normal text-[14px]">{composer}</span></p> }
            </div>
            <div className="my-[10px]">
                { lyricist && <p><span className="mr-[15px]">작사</span> <span className="text-gray font-normal text-[14px]">{lyricist}</span></p> }
            </div>
            <div className="my-[10px]">
                { arranger && <p><span className="mr-[15px]">편곡</span> <span className="text-gray font-normal text-[14px]">{arranger}</span></p> }
            </div>
        </div>
        <div className="mt-[50px]">
            {
                lyrics ?
                <p className="lyrics text-gray font-normal text-[14px] leading-[26px]">{lyrics}</p>
                :
                <div className="text-center mt-[100px]">
                    <img src="/image/nolyrics.svg" alt="notintroimage" className="m-auto"/>
                    <div>
                        <p>앗!</p>
                        <p className="text-[14px] text-gray mt-[10px]">등록된 가사가 없어요.</p>
                    </div>
                </div>
            }
        </div>
    </StyledDetails>
    )
}

const StyledDetails = styled.div`
    // width: 1440px;
    margin: 0 auto;

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

export default Details