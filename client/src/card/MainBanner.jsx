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
import { getCookie, userid_cookies } from '../config/cookie';
import { PlayButtonTrans as PlayButton } from '../style/StyledIcons';
import PlayerBanner from '../card/PlayerBanner';

const MainBanner = ({handleRender}) => {
    const [themeplaylist, setThemeplaylist] = useState([]);
    const [ loading, setLoading ] = useState(false);

    //LSR
    const [ recommend, setRecommend ] = useState(false);
    const [ bannerArtistImage, setBannerArtistImage ] = useState([]);
    const [ isPreferExist, setIsPreferExist ] = useState(false);
    const [ bannerUrl, setBannerUrl ] = useState('');
    // MBJ
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);


    const getBannerImage = async() => {
        const response = await Axios.post('/verifiedClient/getBannerImage', {token: getCookie('connect.sid'), characterId: getCookie('character.sid')});
        console.log("response");
        console.log(response);
        if(response.data.length > 1){
            // prefer playlist 존재
            setRecommend(true);
            setIsPreferExist(true);
            setBannerArtistImage(response.data);
            setLoading(false);
        }else{
            // res.json(-1) 
            setRecommend(false);   
            setIsPreferExist(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        const url = generateRandomInt(11);
        // console.log(url); 
        setBannerUrl(url);

        getBannerImage();

        if(!recommend){
            Axios.get("/ezenmusic/mainbanner")
            .then(({data}) => {
                setThemeplaylist(data);
            })
            .catch((err) => {
                console.log("에러");
            })
        }
    }, [])

    function playerAdd(){
        let array = [];

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            page: "mainbanner_prefer_playlist",
            change_now_play: true
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    /**
     * 
     * @param {number} range 
     * @returns 1 ~ range random number
     */
    const generateRandomInt = (range) => {
        let random = Math.round(Math.random() * range);
        if(random === 0){random += 1}
        if(random < 10){
            random = '0' + random;
        }else{

        }
        return random
    }

    useEffect(()=>{
        
    }, [])

    return (
        <>
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"channel"} /> }
        <StyledBanner className='banner-cover' $url={bannerUrl}>
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
                        isPreferExist ? 
                        <>
                        {
                            <>
                            <SwiperSlide className={`recommended relative`}>
                            {/* <StyledLink to={`${playlistData.playlistId}`} className='row'> */}
                                <StyledLink to={"/detail/recommend"} className='row'>
                                    <div className='banner-left col-5'>
                                        <p className='title'>좋아할만한 아티스트 MIX</p>
                                        <h3 className='sub-title mt-[10px]'>EZEN MUSIC에서 취향에 맞는 음악을 골라봤어요.</h3>
                                        <div className='playlist-info'>
                                            <span className='update-date'>2023.12.04</span>
                                            <span className='icon'></span>
                                        </div>
                                        
                                    </div>
                                    <BannerRight className='banner-right col-7'>
                                        <div className='row h-100' style={{padding:"40px 0"}}>
                                            <div className='thumb-box'>
                                                <div className='thumb-main'>
                                                    <img src={`/image/artist/${bannerArtistImage[0] || '../test.png'}`} alt="test" />
                                                </div>
                                                <div className='thumb-left'>
                                                    <img src={`/image/artist/${bannerArtistImage[1] || '../test.png'}`} alt="test" />
                                                </div>
                                                <div className='thumb-right'>
                                                    <img src={`/image/artist/${bannerArtistImage[2] || '../test.png'}`} alt="test" />
                                                </div>
                                            </div>
                                        </div>
                                    </BannerRight>
                                </StyledLink>
                            </SwiperSlide>
                            
                            </>
                        }
                        </>
                        :
                        <>
                        {
                            themeplaylist.map((data, index)=>{
                                return (
                                    <SwiperSlide key={index} className={`slide slide${index+1}`}>
                                        {/* <StyledLink to={`${playlistData.playlistId}`} className='row'> */}
                                        <StyledLink to={"/detail/channel/" + data.themeplaylist_id} className='row'>
                                            <div className='banner-left col-4'>
                                                <h3>{data.themeplaylist_title}</h3>
                                                <div className='playlist-info'>
                                                    {/* <span>총 {data.playlistCount}곡</span> */}
                                                    <span>{data.release_date_format}</span>
                                                </div>
                                            </div>
                                            <div className='banner-right col-8'>
                                                <div className='row h-100' style={{padding:"40px 0"}}>
                                                    <MainBannerMusic themeplaylist_id={data.themeplaylist_id} />
                                                    
                                                </div>
                                            </div>
                                        </StyledLink>
                                    </SwiperSlide>
                                )
                            })
                        }
                        </>
                        
                    }
            </Swiper>
            <>
            {
                isPreferExist ? 
                <div className='absolute bottom-[75px] left-[35px] z-50'>
                    <span className='play-icon'>
                        <PlayButton title='플레이리스트 재생하기' onClick={playerAdd}></PlayButton>
                    </span>
                </div>
                :
                <></>
            }
            </>
        </StyledBanner>
        </>
    )
}

export default MainBanner

const BannerRight = styled.div`
    div{
        .thumb-box{
            position: relative;
            .thumb-main{
                width: 230px;
                height: 230px;
                border-radius: 50%;
                overflow: hidden;
                position: absolute;
                z-index: 99;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            .thumb-left{
                width: 190px;
                height: 190px;
                border-radius: 50%;
                overflow: hidden;
                position: absolute;
                z-index: 9;
                top: 50%;
                left: 20%;
                transform: translate(-50%, -50%);
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            .thumb-right{
                width: 190px;
                height: 190px;  
                border-radius: 50%;
                overflow: hidden;
                position: absolute;
                z-index: 9;
                top: 50%;
                left: 80%;
                transform: translate(-50%, -50%);
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }
    }
`;


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
                font-size: 14px;
                font-weight: 100;
                line-height: 20px;
                color: #fff;
                margin-right: 30px;
                position: relative;
                
                &:first-child::after{
                    content: "";
                    display: inline-block;
                    
                    
                }
            }
            .new-icon{

            }
        }
        div{
            width: 50px;
            height: 50px;
            .play-icon{
                
                >button{
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    background-image: url(/image/icon_.png);
                    background-size: 714px 706px;
                    background-position: -119px -208px;
                    &:hover{
                        background-image: url(/image/icon_.png);
                        background-size: 714px 706px;
                        background-position: -60px -208px;
                        width: 54px;
                        height: 54px;
                    }
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
            .recommended{
                background-image: url(/image/preferplaylist/bg${props=>props.$url}.jpg);
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