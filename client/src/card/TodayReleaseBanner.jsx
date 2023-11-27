import React, {useState, useEffect} from 'react'
import Axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
import { FreeMode, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function TodayReleaseBanner() {

    const [moodplaylist, setMoodplaylist] = useState([]);
    const [moodplaylist_first, setMoodplaylist_first] = useState([]);
    const [moodplaylist_twice, setMoodplaylist_twice] = useState([]);

    let array = [];

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/todayrelease")
        .then(({data}) => {
            setMoodplaylist(data);
            for(let i=0; i<15; i++){
                array.push(data[i]);
            }
            setMoodplaylist_first(array);
            array = [];
            for(let i=15; i<30; i++){
                array.push(data[i]);
            }
            setMoodplaylist_twice(array);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
    <StyledMoodBanner>
        <h1 className="font-bold text-[22px] mb-[30px]">오늘 발매 음악</h1>
        <div className="swiper-button-next todaybanner"></div>
        <div className="swiper-button-prev todaybanner"></div>
        <Swiper
            modules={[FreeMode, Navigation]}
            spaceBetween={20} // 슬라이드 간격
            slidesPerView={5} // 한 스와이퍼에 몇장 보여줄지
            slidesPerGroup={5} // 한번 넘길때 몇장 넘어갈지
            speed={300} // 페이지 넘어가는 속도
            touchRatio={0} // 클릭해서 드래그 막음
            navigation={{ // 버튼
                nextEl: '.swiper-button-next.todaybanner',
                prevEl: '.swiper-button-prev.todaybanner'
            }}
            rewind={false}
            pagination={{ clickable: true }}
            >
            {
                moodplaylist_first.length != 0 && moodplaylist_twice.length != 0 ?
                moodplaylist_first.map((item, index) => (
                    <SwiperSlide key={index} className={`slide slide${index+1}`}>
                        <StyledMoodLink to={"/detail/album/" + moodplaylist_first[index].album_id + "/albumtrack"} className='row mb-[30px]'>
                            <div className="mb-[10px] col">
                                <img src={"/image/album/" + moodplaylist_first[index].org_cover_image} alt="" className="todayimg w-[100%] h-[100%] m-auto rounded-[10px]" />
                            </div>
                            <p className="text-[14px]">{moodplaylist_first[index].album_title}</p>
                            <p className="text-[13px] text-gray">{moodplaylist_first[index].artist}</p>
                        </StyledMoodLink>
                        <StyledMoodLink to={"/detail/album/" + moodplaylist_twice[index].album_id + "/albumtrack"} className='row mb-[30px]'>
                            <div className="mb-[10px] col">
                                <img src={"/image/album/" + moodplaylist_twice[index].org_cover_image} alt="" className="todayimg w-[100%] h-[100%] m-auto rounded-[10px]" />
                            </div>
                            <p className="text-[14px]">{moodplaylist_twice[index].album_title}</p>
                            <p className="text-[13px] text-gray">{moodplaylist_twice[index].artist}</p>
                        </StyledMoodLink>
                    </SwiperSlide>
                ))
                :
                ""
            }
        </Swiper>
    </StyledMoodBanner>
  )
}
export const StyledMoodBanner = styled.div`
    --swiper-navigation-size: 18px;

    width: 100%;
    margin-bottom: 30px;
    // height: 400px;
    position: relative;

    .slide{
        // border: 1px solid black;
    }

    .swiper-button-next.todaybanner{
        color: black;
        position: absolute;
        top: 20px;
        right: 10px;
        font-weight: 900 !important;
    }

    .swiper-button-prev.todaybanner{
        color: black;
        position: absolute;
        top: 20px;
        left: 94%;
        font-weight: 900 !important;
    }

    .todayimg:hover{
        filter: brightness(70%)
    }
`

export const StyledMoodLink = styled(Link)`
    white-space: nowrap;
    overflow: hidden;
    // border: 1px solid red;
`
export default TodayReleaseBanner