import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
import { FreeMode, Navigation, Pagination } from 'swiper/modules';
import { StyledMoodLink } from './MoodBanner';
import { playerAddGenre } from '../procedure/playerAddButton';
import PlayerBanner from './PlayerBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import { AppContext } from '../App'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// 승렬
import { MainTinyPlayButton as TinyPlayButton } from '../style/StyledIcons';

function GenreBanner({handleRender}) {

    const [moodplaylist, setMoodplaylist] = useState([]);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);

    const isSessionValid = JSON.parse(useContext(AppContext));

    useEffect(() => {
        // 일단 main 베너에 가져오는 테마 플리들 가져옴 나중에 다른 리스트들 가져올거면 node 쪽에 작성 후 가져와야 함.
        Axios.get("/ezenmusic/genrebanner")
        .then(({data}) => {
            setMoodplaylist(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])
    
    return (
    <>
    { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
    { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
    <StyledMoodBanner className='banner-cover'>
        {/* <div className="swiper-button-next banner"></div>
        <div className="swiper-button-prev banner"></div> */}
        <h1 className="font-bold text-[22px] mb-[30px]">장르 콜렉션</h1>
        <div className="swiper-button-next genrebanner"></div>
        <div className="swiper-button-prev genrebanner"></div>
        <Swiper
            modules={[FreeMode, Navigation, Pagination]}
            spaceBetween={20} // 슬라이드 간격
            slidesPerView={5} // 한 스와이퍼에 몇장 보여줄지
            slidesPerGroup={5} // 한번 넘길때 몇장 넘어갈지
            speed={300} // 페이지 넘어가는 속도
            // touchRatio={0} // 클릭해서 드래그 막음
            navigation={{ // 버튼
                nextEl: '.swiper-button-next.genrebanner',
                prevEl: '.swiper-button-prev.genrebanner'
            }}
            rewind={false}
            // centeredSlides={true}
            // pagination={{ clickable: true }}
            >
            {
                moodplaylist.map((item, index) => (
                    
                    <SwiperSlide key={index} className={`slide slide${index+1}`}>
                        <div className='relative'>
                            <StyledMoodLink to={"/detail/chart/" + item.genre_id} className='row'>
                                <div className="mb-[10px]">
                                    <div className="genreimg min-w-[175px] max-w-[175px] h-[175px] m-auto rounded-[6px] overflow-hidden border-1 M-img-border">
                                        <img src={"/image/genre/" + item.org_cover_image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h3>{item.themeplaylist_title}</h3>
                            </StyledMoodLink>
                            <TinyPlayButton onClick={isSessionValid? ()=>{playerAddGenre("mainbanner_genre", item.area, item.genre, handleRender, setPlayerBannerOn); } : () => setLoginrRequestVal(true)}></TinyPlayButton>
                        </div>
                        
                    </SwiperSlide>
                ))
            }
        </Swiper>
    </StyledMoodBanner>
    </>
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

    .swiper-button-next.genrebanner{
        color: black;
        position: absolute;
        top: 20px;
        right: 10px;
        font-weight: 900 !important;
    }

    .swiper-button-prev.genrebanner{
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


export default GenreBanner