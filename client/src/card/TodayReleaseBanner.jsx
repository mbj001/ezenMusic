import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
import { FreeMode, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { playerAdd } from '../procedure/playerAddButton';
import PlayerBanner from './PlayerBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import { AppContext } from '../App'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// 승렬
import { MainTinyPlayButton as TinyPlayButton } from '../style/StyledIcons';

function TodayReleaseBanner({handleRender}) {

    const [moodplaylist_first, setMoodplaylist_first] = useState([]);
    const [moodplaylist_twice, setMoodplaylist_twice] = useState([]);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);

    // 승렬
    const [ loading, setLoading ] = useState(true);

    const isSessionValid = JSON.parse(useContext(AppContext));

    let array = [];

    useEffect(() => {
        setLoading(true);
        
        Axios.get("/ezenmusic/todayrelease")
        .then(({data}) => {
            for(let i=0; i<15; i++){
                array.push(data[i]);
            }
            setMoodplaylist_first(array);
            array = [];
            for(let i=15; i<30; i++){
                array.push(data[i]);
            }
            setMoodplaylist_twice(array);
            setLoading(false);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
        <>
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
        { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }

        <StyledMoodBanner>
            <h1 className="font-bold text-[22px] mb-[30px]">EzenMusic 앨범</h1>
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
                >
                {
                    moodplaylist_first.length !== 0 && moodplaylist_twice.length !== 0 &&
                    moodplaylist_first.map((item, index) => (
                        <SwiperSlide key={index} className={`slide slide${index+1}`}>
                            <div className='relative'>
                                <StyledMoodLink to={"/detail/album/" + moodplaylist_first[index].album_id + "/albumtrack"} className='row mb-[30px]'>
                                    <div className="mb-[10px]">
                                        {
                                            loading ?
                                            <img src='/image/loading.png' alt='loading...'  className="todayimg min-w-[175px] max-w-[175px] h-[175px] m-auto rounded-[6px]"></img>
                                            :
                                            <img src={"/image/album/" + moodplaylist_first[index].org_cover_image} alt={moodplaylist_first[index].org_cover_image} className="todayimg min-w-[175px] max-w-[175px] h-[175px] m-auto rounded-[6px]" />
                                        }
                                    </div>
                                    <p className="album-title">{moodplaylist_first[index].album_title}</p>
                                    <Link to={"/detail/artist/"+moodplaylist_first[index].artist_id+"/track?sortType=POPULARITY"} ><p className="artist">{moodplaylist_first[index].artist_name}</p></Link>

                                </StyledMoodLink>
                                <TinyPlayButton onClick={isSessionValid? ()=>{playerAdd("mainbanner_album", moodplaylist_first[index].album_id, handleRender, setPlayerBannerOn);} : () => setLoginrRequestVal(true)}></TinyPlayButton>
                            </div>
                            <div className='relative'>
                                <StyledMoodLink to={"/detail/album/" + moodplaylist_twice[index].album_id + "/albumtrack"} className='row mb-[30px]'>
                                    <div className="mb-[10px]">
                                        {
                                            loading ?
                                            <img src='/image/loading.png' alt='loading...'  className="todayimg min-w-[175px] max-w-[175px] h-[175px] m-auto rounded-[6px]"></img>
                                            :
                                            <img src={"/image/album/" + moodplaylist_twice[index].org_cover_image} alt={moodplaylist_twice[index].org_cover_image} className="todayimg min-w-[175px] max-w-[175px] h-[175px] m-auto rounded-[6px]" />
                                        }
                                    </div>
                                    <p className="album-title">{moodplaylist_twice[index].album_title}</p>
                                    <Link to={"/detail/artist/"+moodplaylist_twice[index].artist_id+"/track?sortType=POPULARITY"} ><p className="artist">{moodplaylist_twice[index].artist_name}</p></Link>
                                </StyledMoodLink>
                                <TinyPlayButton onClick={isSessionValid? (()=>{playerAdd("mainbanner_album", moodplaylist_twice[index].album_id, handleRender, setPlayerBannerOn); }) : () => setLoginrRequestVal(true)}></TinyPlayButton>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </StyledMoodBanner>
        </>
    )
}
export const StyledMoodBanner = styled.div`
    --swiper-navigation-size: 18px;
    width: 100%;
    margin-bottom: 60px;
    position: relative;

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
        filter: brightness(70%);
    }
`

export const StyledMoodLink = styled(Link)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: column;
    p{
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    p.album-title{
        font-size: 15px;
        font-weight: 400;
        color: #333;
        margin-bottom: 5px;
        &:hover{
            color: var(--main-theme-color);
        }
    }
    p.artist{
        font-size: 13px;
        color: #969696;
        white-space: normal;
        &:hover{
            color: var(--main-theme-color);
        }
    }
`
export default TodayReleaseBanner