import React, {useState, useEffect} from 'react'
import Axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MainBannerMusic from './MainBannerMusic';

const MainBanner = () => {
    const [themeplaylist, setThemeplaylist] = useState([]);
    const [thememusic, setThememusic] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/mainbanner")
        .then(({data}) => {
            setThemeplaylist(data);
        })
        .catch((err) => {
            console.log("에러");
        })
    }, [])



    return (
        <StyledBanner className='banner-cover'>
            <div className="swiper-button-next banner"></div>
            <div className="swiper-button-prev banner"></div>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={0} // 슬라이드 간격
                slidesPerView={1} // 한 스와이퍼에 몇장 보여줄지
                slidesPerGroup={1} // 한번 넘길때 몇장 넘어갈지
                speed={300} // 페이지 넘어가는 속도
                touchRatio={0} // 클릭해서 드래그 막음
                navigation={{ // 버튼
                    nextEl: '.swiper-button-next.banner',
                    prevEl: '.swiper-button-prev.banner'
                }}
                rewind={false}
                centeredSlides={true}
                pagination={{ clickable: true }}
                >
            
                {
                    themeplaylist.map((data, index)=>{
                        return (
                            <SwiperSlide key={index} className={`slide slide${index+1}`}>
                                {/* <StyledLink to={`${playlistData.playlistId}`} className='row'> */}
                                <StyledLink to={"/detail/channel/" + data.num} className='row'>
                                    <div className='banner-left col-4'>
                                        <h3>{data.themetitle}</h3>
                                        <div className='playlist-info'>
                                            {/* <span>총 {data.playlistCount}곡</span> */}
                                            <span>{data.release_date_format}</span>
                                        </div>
                                    </div>
                                    <div className='banner-right col-8'>
                                        <div className='row h-100' style={{padding:"40px 0"}}>
                                            <MainBannerMusic num={data.num} />
                                            
                                        </div>
                                    </div>
                                </StyledLink>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </StyledBanner>
    )
}

export default MainBanner
export const StyledLink = styled(Link)`
    width: 100%;
    height: 100%;
    display: flex;
    color: #ffffff;
    .banner-left{
        padding-top: 40px;
        padding-left: 50px;
        h3{
            width: 250px;
            font-size: 30px;
            font-weight: 600;
        }
        .playlist-info{
            
            margin-top: 20px;
            >span{
                font-weight: 400;
                margin-right: 30px;
                position: relative;
                &:first-child::after{
                    content: "";
                    display: inline-block;
                    width: 1px;
                    height: 70%;
                    background-color: var(--main-text-gray-lighter);
                    position: absolute;
                    top: 20%;
                    bottom: auto;
                    right: -15px;
                    left: auto;
                }
            }
        }
    }
`;

export const StyledBanner = styled.div`
    width: 100%;
    height: 400px;
    margin-bottom: 30px;
    position: relative;
    border-radius: 10px;
    .swiper{
        widgh: 100%;
        height: 350px;
        border-radius: 10px;
        overflow:hidden;
        .swiper-wrapper{
            width: 100%;
            height: 350px;
            border-radius: 10px;
            position: absolute !important;
            .slide{
                background-color: #457893;
            }
            .slide.slide1{
                background-color: #444e62;
            }
            .slide.slide2{
                background-color: #4c4863;
            }
            .slide.slide3{
                background-color: #465550;
            }
            .slide.slide4{
                background-color: #674d45;
            }
            .slide.slide5{
                background-color: #61484b;
            }
        }
        
    }

    /* SWIPER BUTTON */
    .swiper-button-next.banner{
        right: -50px;
    }
    .swiper-button-prev.banner{
        left: -50px;
    }
    .swiper-button-disabled.banner{
        opacity: 0 !important;
        transition: opacity 0.35s ease;
    }
    .swiper-button-prev.banner, .swiper-button-next.banner{
        color: var(--main-text-gray);
        transition: opacity 0.35s ease;
        &:hover{
            color: var(--main-text-black);
            transition: all 0.35s;
        }
    }
    /* PAGINATION BULLET */
    .swiper-pagination{
        width: 100%;
        height: 10px;
        display: flex !important;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: auto;
        bottom: -20px;
        left: auto;
        right: auto;
        z-index: 999;
    }
    .swiper-pagination-bullet { 
        width: 6px;
        height: 6px;
        background: var(--main-text-gray); 
        border: 1px solid var(--main-text-gray);
    }
    .swiper-pagination-bullet-active { 
        border-radius: 50%; 
        background: var(--pagination-dot); 
        border: 1px solid var(--pagination-dot); 
    }
`;


const PlaylistThumbs = styled.div`
    width: 45px;
    height: 45px;
    background-image: url(/image/${props=>props.url});
    background-repeat: no-repeat;
    background-size: contain;
    border-radius: 3px;
    overflow: hidden;
    margin-left: 10px;
`;
const PlaylistInfo = styled.div`
    white-space: nowrap;
    overflow: hidden;

    .song-title{
    font-size: 16px;
    font-weight: 400;
    }
    .song-artist{
        font-size: 13px;
        font-weight: 400;
        color: var(--main-text-gray-lighter);
    }
`;