import React, {useState, useEffect} from 'react'
import Axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
// import { StyledBanner, StyledLink } from './MainBanner';
import { FreeMode, Navigation, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function MoodBanner() {

    const [moodplaylist, setMoodplaylist] = useState([]);

    useEffect(() => {
        // 일단 main 베너에 가져오는 테마 플리들 가져옴 나중에 다른 리스트들 가져올거면 node 쪽에 작성 후 가져와야 함.
        Axios.get("http://localhost:8080/ezenmusic/moodbanner")
        .then(({data}) => {
            console.log(data);
            setMoodplaylist(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])
    return (
    <StyledMoodBanner className='banner-cover'>
        {/* <div className="swiper-button-next banner"></div>
        <div className="swiper-button-prev banner"></div> */}
        <h1 className="font-bold text-[22px] mb-[30px]">무드가 흐르는 순간 MOOD:ON</h1>
        {/* <div className="swiper-button-next banner"></div>
        <div className="swiper-button-prev banner"></div> */}
        <Swiper
            modules={[FreeMode, Navigation, Pagination]}
            spaceBetween={20} // 슬라이드 간격
            slidesPerView={5} // 한 스와이퍼에 몇장 보여줄지
            slidesPerGroup={5} // 한번 넘길때 몇장 넘어갈지
            // speed={300} // 페이지 넘어가는 속도
            // touchRatio={0} // 클릭해서 드래그 막음
            // navigation={{ // 버튼
            //     nextEl: '.swiper-button-next.banner',
            //     prevEl: '.swiper-button-prev.banner'
            // }}
            // rewind={false}
            // centeredSlides={true}
            // pagination={{ clickable: true }}
            >
            {
                moodplaylist.map((item, index) => (
                    
                    <SwiperSlide key={index} className={`slide slide${index+1}`}>
                        <StyledMoodLink to={"/detail/channel/" + item.num} className='row'>
                            <div className="mb-[10px]">
                                <img src={"/image/themeplaylist/" + item.org_cover_image} alt="" className="w-[100%] h-[100%] m-auto rounded-[10px]" />
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

export const StyledMoodBanner = styled.div`
    width: 100%;
    margin-bottom: 60px;
    // height: 400px;

    .slide{
        // border: 1px solid black;
    }
`

export const StyledMoodLink = styled(Link)`
    // border: 1px solid red;
`

export default MoodBanner