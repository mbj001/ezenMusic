import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import GenreCard from '../card/GenreCard';
import { genreData } from '../data/playlistData';
import { Link, useParams } from 'react-router-dom';
import Axios from "axios";
import MusicListTable from '../card/MusicListTable';
import { userid_cookies } from '../config/cookie';
import { CiCircleChevDown } from "react-icons/ci";

const Browse = ({handleRender}) => {

    const [showMore, setShowMore] = useState(false);
    const [flochartData, setFlochartData] = useState([]);
    const [flochartData_limit10, setFlochartData_limit10] = useState([]);
    const [browseCheckAll, setBrowseCheckAll] = useState(false);

    let array = [];
    let array_limit10 = [];
    let activeNum = useParams().genre_num;
    
    if(!activeNum){
        activeNum = "1";
    }


    useEffect(() => {

        // likey 목록 가져옴
        if(userid_cookies !== undefined){
            Axios.post("/ezenmusic/allpage/likeylist", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                if(data == -1){

                }
                else{
                    array = data[0].music_list;
                }
                Axios.get("/ezenmusic/flochart/"+activeNum)
                    .then(({data}) => {
                        for(let i=0; i<data.length; i++){
                            // object 에 likey 라는 항목 넣고 모두 false 세팅
                            data[i].likey = false;
                        }

                        for(let i=0; i<array.length; i++){
                            for(let j=0; j<data.length; j++){
                                if(array[i] === Number(data[j].music_id)){
                                    // 좋아요 해당 object 의 값 true 로 변경
                                    data[j].likey = true;
                                }
                            }
                        }

                        // 해당 장르의 음악이 10개가 안될 수 도 있어서 조건 걸어둠
                        // 추후에 음악 추가하고나면 삭제 해도될듯..?                        
                        if(data.length < 10){
                            for(let i=0; i<data.length; i++){
                                array_limit10.push(data[i]);
                            }    
                        }
                        else{
                            for(let i=0; i<10; i++){
                                array_limit10.push(data[i]);
                            }
                        }

                        setFlochartData_limit10(array_limit10);
                        setFlochartData(data);
                        setBrowseCheckAll(false);
                    })
                    .catch(err => {
                        console.log(err);
                    })  
            })
            .catch((err) => {
                console.log(err);
            })
        }
        
        else{

            Axios.get("/ezenmusic/flochart/"+activeNum)
            .then(({data}) => {
                for(let i=0; i<data.length; i++){
                    // object 에 likey 라는 항목 넣고 모두 false 세팅
                    data[i].likey = false;
                }
    
                for(let i=0; i<array.length; i++){
                    for(let j=0; j<data.length; j++){
                        if(array[i] === Number(data[j].music_id)){
                            // 좋아요 해당 object 의 값 true 로 변경
                            data[j].likey = true;
                        }
                    }
                }
    
                // 해당 장르의 음악이 10개가 안될 수 도 있어서 조건 걸어둠
                // 추후에 음악 추가하고나면 삭제 해도될듯..?
                if(data.length < 10){
                    for(let i=0; i<data.length; i++){
                        array_limit10.push(data[i]);
                    }    
                }
                else{
                    for(let i=0; i<10; i++){
                        array_limit10.push(data[i]);
                    }
                }
    
                setFlochartData_limit10(array_limit10);
                setFlochartData(data);
                setBrowseCheckAll(false);
            })
            .catch(err => {
                console.log(err);
            })
        }
    },[activeNum])


    return (
        <>
        {/* <div className="relative flex mt-4 mb-5 session_menu whitespace-nowrap overflow-hidden"> */}
        <div className="relative flex flex-wrap mt-4 mb-5 session_menu">
            {
                genreData.map((item, index) => (
                    parseInt(activeNum) === parseInt(item.genre_num) ?
                        <Link key={index} to={"/browse/"+item.genre_num}><GenreCard genre={item.genre} active="true" /></Link>
                    :
                        <Link key={index} to={"/browse/"+item.genre_num}><GenreCard genre={item.genre} /></Link>
                ))
            }
            {/* <div className="absolute right-[0px] top-[18px] w-[40px] h-[40px] bg-white flex items-center"><CiCircleChevDown className="text-[28px] m-auto hover-text-blue"/></div> */}
        </div>
        {
            showMore?
            <MusicListTable page="browse" lank={true} music_list={flochartData} handleRender={handleRender} showMore={showMore} browseCheckAll={browseCheckAll}/>
            :
            <MusicListTable page="browse" lank={true} music_list={flochartData_limit10} handleRender={handleRender} showMore={showMore} browseCheckAll={browseCheckAll}/>
        }
        
        <div className="text-center">
            <button onClick={e => setShowMore(!showMore)} className="border-solid border-1 hover-border-gray text-gray rounded-[20px] px-[25px] py-[7px] hover-text-blue hover-border-blue">
                <div className="flex items-center">
                    <p className="mr-2">더보기</p>

                    { showMore ?  <RiArrowUpSLine className="text-[20px]"/> : <RiArrowDownSLine className="text-[20px]" /> }
                    
                </div>
            </button>
        </div>
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