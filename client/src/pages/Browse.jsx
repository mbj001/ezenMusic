import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { RiPlayLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';
import MusicListHeader from '../card/MusicListHeader';
import GenreCard from '../card/GenreCard';
import { genreData } from '../data/playlistData';
import { Link, useParams } from 'react-router-dom';
import Axios from "axios";
import { Cookies } from "react-cookie";
import AllCheckedModal from '../modal/AllCheckedModal';
import LikeyBanner from '../card/LikeyBanner';
import PlaylistAdd from '../modal/PlaylistAdd';

const Browse = ({handleRender}) => {

    const [showMore, setShowMore] = useState(false);
    const [flochartData, setFlochartData] = useState([]);

    ////////// MusicListCard 전달
    // 좋아요 누를 때 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 전체선택 베너
    const [allcheckVal, setAllcheckVal] = useState(false);
    /////////////////////

    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, music_id, img) =>{
        e.preventDefault();
        setPlaylistModalData([music_id, img]);
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////

    let activeNum = useParams().genre_num;

    let array = [];

    if(!activeNum){
        activeNum = "1";
    }

    useEffect(() => {

        const cookies = new Cookies();
        const userid_cookies = cookies.get("client.sid");

        // likey 목록 가져옴
        Axios.get("http://localhost:8080/ezenmusic/allpage/likeylist/" + userid_cookies)
        .then(({data}) => {
            // console.log("browse likeylist axios get complete!!");
            array = data[0].music_list;
            })
        .catch((err) => {
            console.log(err);
        })

        Axios.get("http://localhost:8080/ezenmusic/flochart/"+activeNum)
        .then(({data}) => {
            // console.log("browse flochart axios get complete!!");
            for(let i=0; i<data.length; i++){
                // object 에 likey 라는 항목 넣고 모두 false 세팅
                data[i].likey = false;
            }
            for(let i=0; i<array.length; i++){
                for(let j=0; j<data.length; j++){
                    if(array[i] === Number(data[j].id)){
                        // 좋아요 해당 object 의 값 true 로 변경
                        data[j].likey = true;
                    }
                }
            }
            setFlochartData(data);
            setAllcheckVal(false);
        })
        .catch(err => {
            {}
        })
        // 차트 리스트 가져옴
    },[activeNum])


    return (
        <>
        <div className="md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] m-auto flex flex-wrap mt-4 mb-5">
            {
                genreData.map((item, index) => (
                    parseInt(activeNum) === parseInt(item.genre_num) ?
                        <Link key={index} to={"/browse/"+item.genre_num}><GenreCard genre={item.genre} active="true" /></Link>
                    :
                        <Link key={index} to={"/browse/"+item.genre_num}><GenreCard genre={item.genre} /></Link>
                ))
            }
        </div>
        <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"track"}/>
        <StyledBrowser className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
            <div className="mb-3">
                <div className="flex items-center">
                    <p className="chart-title">EzenMusic 차트</p>
                    <p className="text-slate-400 text-[12px] ml-[10px]">24시간 집계 (16시 기준)</p>
                </div>
                <div className="all-play-box absolute top-0 right-0 flex cursor-pointer">
                    <RiPlayLine className="all-play-icon absolute top-[2px] right-[55px]"/>
                    <p>전체듣기</p>
                </div>
            </div>
            <div>
                <hr className="text-gray"/>
                <table className="table table-hover">
                    <MusicListHeader lank={true} setAllcheckVal={setAllcheckVal} allcheckVal={allcheckVal} />
                    <tbody>
                        {
                            showMore?
                            flochartData.map((item, index) => (
                                <MusicListCard key={index} lank={index+1} title={item.title} album_title={item.album_title} artist_num={item.artist_num} 
                                artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} 
                                likey={item.likey} setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} clickPlaylistModalOpen={clickPlaylistModalOpen}/>
                            ))
                            :
                            flochartData.map((item, index) => (
                                <MusicListCard key={index} lank={index+1} title={item.title} album_title={item.album_title} artist_num={item.artist_num} 
                                artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} 
                                likey={item.likey} setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} clickPlaylistModalOpen={clickPlaylistModalOpen}/>
                            )).filter((item, index) => (index < 10))
                        }
                    </tbody>
                </table>
            </div>
        </StyledBrowser>
        <div className="text-center">
            <button onClick={e => setShowMore(!showMore)} className="border-solid border-1 hover-border-gray text-gray rounded-[20px] px-[25px] py-[7px] hover-text-blue hover-border-blue">
                <div className="flex items-center">
                    <p className="mr-2">더보기</p>
                    {
                        showMore?  <RiArrowUpSLine className="text-[20px]"/> : <RiArrowDownSLine className="text-[20px]" />
                    }
                </div>
            </button>
        </div>
        {
            allcheckVal ?
            <AllCheckedModal setAllcheckVal={setAllcheckVal}/>
            :
            ""
        }
        {
            playlistModalOpen?
            <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal}/>
            :
            ""
        }
        </>
    )
}

export default Browse

export const StyledTableth = styled.th`
    font-size: 12px;

    p{
        color: var(--main-text-gray);
        font-weight: 400;
    }
`

export const StyledBrowser = styled.div`
    // width: 1440px;
    margin: 0 auto;
    // border: 1px solid black;

    .chart-title{
        font-size: 20px;
        font-weight: 700;
    }

    .all-play-box{
        font-size: 14px;
        color: var(--main-text-gray);
    }

    .all-play-box:hover *{
        color: var(--main-theme-color);
    }

    .all-play-icon{
        font-size: 20px;
        color: var(--main-text-gray);
    }

    tbody>*{
        color: var(--main-text-gray);
    }
`;

export const StyledMoodBanner = styled.div`
    
    --swiper-navigation-size: 18px;

    width: 100%;
    margin-bottom: 60px;
    // height: 400px;
    position: relative;

    .slide{
        // border: 1px solid black;
    }

    .swiper-button-next.moodbanner{
        color: black;
        position: absolute;
        top: 20px;
        right: 10px;
        font-weight: 900 !important;
    }

    .swiper-button-prev.moodbanner{
        color: black;
        position: absolute;
        top: 20px;
        left: 94%;
        font-weight: 900 !important;
    }

    .moodimg:hover{
        filter: brightness(70%)
    }
`

export const StyledMoodLink = styled(Link)`
    // border: 1px solid red;
`