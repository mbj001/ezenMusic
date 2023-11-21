import React, {useState, useEffect} from 'react'
import Axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
// import { StyledBanner, StyledLink } from './MainBanner';
import { FreeMode, Navigation, Pagination } from 'swiper/modules';
import { StyledMoodLink } from './MoodBanner';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function SeasonBanner() {

    const [moodplaylist, setMoodplaylist] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/seasonbanner")
        .then(({data}) => {
            setMoodplaylist(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])
    return (
    <StyledMoodBanner className='banner-cover'>
        <div className="swiper-button-next seasonbanner"></div>
        <div className="swiper-button-prev seasonbanner"></div>
        <h1 className="font-bold text-[22px] mb-[30px]">초겨울 출퇴근길을 완성할 플리</h1>

        <Swiper
            modules={[FreeMode, Navigation, Pagination]}
            spaceBetween={20} // 슬라이드 간격
            slidesPerView={5} // 한 스와이퍼에 몇장 보여줄지
            slidesPerGroup={5} // 한번 넘길때 몇장 넘어갈지
            navigation={{ // 버튼
                nextEl: '.swiper-button-next.seasonbanner',
                prevEl: '.swiper-button-prev.seasonbanner'
            }}
            rewind={false}
            pagination={{ clickable: true }}
            >
            {
                moodplaylist.map((item, index) => (
                    
                    <SwiperSlide key={index} className={`slide slide${index+1}`}>
                        <StyledMoodLink to={"/detail/channel/" + item.num} className='row'>
                            <div className="mb-[10px]">
                                <img src={"/image/themeplaylist/" + item.org_cover_image} alt="" className="genreimg w-[100%] h-[100%] m-auto rounded-[10px]" />
                            </div>
                            <h3>{item.themetitle}</h3>
                        </StyledMoodLink>
                    </SwiperSlide>
                ))
            }
        </Swiper>
    </StyledMoodBanner>

    )
}

const StyledMoodBanner = styled.div`
    
    --swiper-navigation-size: 18px;

    width: 100%;
    margin-bottom: 60px;
    // height: 400px;
    position: relative;

    .slide{
        // border: 1px solid black;
    }

    .swiper-button-next.seasonbanner{
        color: black;
        position: absolute;
        top: 20px;
        right: 10px;
        font-weight: 900 !important;
    }

    .swiper-button-prev.seasonbanner{
        color: black;
        position: absolute;
        top: 20px;
        left: 94%;
        font-weight: 900 !important;
    }

    .genreimg:hover{
        filter: brightness(70%)
    }
`

export default SeasonBanner