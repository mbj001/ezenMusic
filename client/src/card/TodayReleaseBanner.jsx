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

function TodayReleaseBanner() {

    const [moodplaylist, setMoodplaylist] = useState([]);
    const [moodplaylist_first, setMoodplaylist_first] = useState([]);
    const [moodplaylist_twice, setMoodplaylist_twice] = useState([]);

    let array = [];

    useEffect(() => {
        // 일단 main 베너에 가져오는 테마 플리들 가져옴 나중에 다른 리스트들 가져올거면 node 쪽에 작성 후 가져와야 함.
        Axios.get("http://localhost:8080/ezenmusic/todayrelease")
        .then(({data}) => {
            setMoodplaylist(data);
            for(let i=0; i<15; i++){
                array.push(data[i]);
                // setMoodplaylist_first([...moodplaylist_first, data[i]]);
            }
            setMoodplaylist_first(array);
            array = [];
            console.log(array);
            for(let i=15; i<30; i++){
                array.push(data[i]);
            }
            setMoodplaylist_twice(array);
            console.log(array);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
    <StyledMoodBanner className='banner-cover'>
        {/* <div className="swiper-button-next banner"></div>
        <div className="swiper-button-prev banner"></div> */}
        <h1 className="font-bold text-[22px] mb-[30px]">오늘 발매 음악</h1>
        {/* <div className="swiper-button-next banner"></div>
        <div className="swiper-button-prev banner"></div> */}
        <Swiper
            modules={[FreeMode, Navigation]}
            spaceBetween={20} // 슬라이드 간격
            slidesPerView={5} // 한 스와이퍼에 몇장 보여줄지
            slidesPerGroup={5} // 한번 넘길때 몇장 넘어갈지
            // direction = "horizontal"
            // slidesPerColumn={2}
            // slidesPerColumnFill="colomn"
            // slidesPerColumn ={3}     
            // grabCursor={true}

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
            {/* {
                moodplaylist.map((item, index) => (
                    <SwiperSlide key={index} className={`slide slide${index+1}`}>
                            <StyledMoodLink to={"/detail/channel/" + item.num} className='row mb-[30px]'>
                                <div className="mb-[10px] col">
                                    <img src={"/image/" + item.org_cover_image} alt="" className="w-[100%] h-[100%] m-auto rounded-[10px]" />
                                </div>
                                <h3>{item.title}</h3>
                            </StyledMoodLink>
                    </SwiperSlide>

                ))
            } */}
            {
                moodplaylist_first.length != 0 && moodplaylist_twice.length != 0 ?
                moodplaylist_first.map((item, index) => (
                    <SwiperSlide key={index} className={`slide slide${index+1}`}>
                        <StyledMoodLink to={"/detail/album/" + moodplaylist_first[index].id + "/albumtrack"} className='row mb-[30px]'>
                            <div className="mb-[10px] col">
                                <img src={"/image/album/" + moodplaylist_first[index].org_cover_image} alt="" className="w-[100%] h-[100%] m-auto rounded-[10px]" />
                            </div>
                            <h3>{moodplaylist_first[index].title}</h3>
                        </StyledMoodLink>
                        <StyledMoodLink to={"/detail/album/" + moodplaylist_twice[index].id + "/albumtrack"} className='row mb-[30px]'>
                            <div className="mb-[10px] col">
                                <img src={"/image/album/" + moodplaylist_twice[index].org_cover_image} alt="" className="w-[100%] h-[100%] m-auto rounded-[10px]" />
                            </div>
                            <h3>{moodplaylist_twice[index].title}</h3>
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
    width: 100%;
    margin-bottom: 30px;
    // height: 400px;

    .slide{
        // border: 1px solid black;
    }
`

export const StyledMoodLink = styled(Link)`
    white-space: nowrap;
    overflow: hidden;
    // border: 1px solid red;
`
export default TodayReleaseBanner