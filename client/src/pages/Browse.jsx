import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';
import GenreCard from '../card/GenreCard';
import { genreData, chartData } from '../data/playlistData';
import { Link, useParams } from 'react-router-dom';
import Axios from "axios";

const Browse = () => {

    const [showMore, setShowMore] = useState(false);
    const [flochartData, setFlochartData] = useState([]);

    let activeNum = useParams().genre_num;
    
    if(!activeNum){
        activeNum = "1";
    }
    
    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/flochart/"+activeNum)
        .then(({data}) => {
            setFlochartData(data);
        })
        .catch(err => {
            {}
        })
    },[activeNum])


    return (
        <>
        <div className="w-[1440px] m-auto flex flex-wrap mt-4 mb-5">
            {
                genreData.map((item, index) => (
                    
                    parseInt(activeNum) === parseInt(item.genre_num) ?
                    <Link to={"/browse/"+item.genre_num}><GenreCard genre={item.genre} active="true" /></Link>
                    :
                    <Link to={"/browse/"+item.genre_num}><GenreCard genre={item.genre} /></Link>
                ))
            }
        </div>

        <StyledBrowser className="relative">
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
                <hr className="text-gray-500"/>
                <table className="table table-hover">
                    <thead className="h-[50px] align-middle ">
                        <tr className="">
                            <StyledTableth scope="col" className="text-center w-[5%]"><input type="checkbox" /></StyledTableth>
                            <StyledTableth scope="col" className="text-center w-[8%]"><p>순위</p></StyledTableth>
                            <StyledTableth scope="col"><p>곡/앨범</p></StyledTableth>
                            <StyledTableth scope="col"><p>아티스트</p></StyledTableth>
                            <StyledTableth scope="col" className="text-center"><p>듣기</p></StyledTableth>
                            <StyledTableth scope="col" className="text-center"><p>재생목록</p></StyledTableth>
                            <StyledTableth scope="col" className="text-center"><p>내 리스트</p></StyledTableth>
                            <StyledTableth scope="col" className="text-center"><p>더보기</p></StyledTableth>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            showMore?
                            flochartData.map((item, index) => (
                                <MusicListCard lank={index+1} title={item.title} album_title={item.album_title} artist={item.artist} img={item.org_cover_image} music_id={item.id}/>
                            ))
                            :
                            flochartData.map((item, index) => (
                                <MusicListCard lank={index+1} title={item.title} album_title={item.album_title} artist={item.artist} img={item.org_cover_image} music_id={item.id}/>
                            )).filter((item, index) => (index < 10))
                        }
                    </tbody>
                </table>
            </div>
        </StyledBrowser>
        <div className="text-center">
            <button onClick={e => setShowMore(!showMore)} className="border-solid border-1 border-gray-300 text-gray-500 rounded-[20px] px-[25px] py-[7px] hover:text-blue-500 hover:border-blue-400">
                <div className="flex items-center">
                    <p className="mr-2">더보기</p>
                    {
                        showMore?  <RiArrowUpSLine className="text-[20px]"/> : <RiArrowDownSLine className="text-[20px]" />
                    }
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
        color: gray;
        font-weight: 400;
    }
`


export const StyledBrowser = styled.div`
    width: 1440px;
    margin: 0 auto;
    // border: 1px solid black;

    .chart-title{
        font-size: 20px;
        font-weight: 700;
    }

    .all-play-box{
        font-size: 14px;
        color: gray;
    }

    .all-play-box:hover *{
        color: blue;
    }

    .all-play-icon{
        font-size: 20px;
        color: gray;
    }

    tbody>*{
        color: gray;
    }
`;