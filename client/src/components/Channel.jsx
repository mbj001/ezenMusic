import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components';
import { StyledBrowser, StyledTableth } from '../pages/Browse';
import {StyledDetail} from "../components/Track"
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiArrowDownSLine, RiArrowUpSLine,  RiHeart3Line, RiProhibitedLine  } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';
import { Link } from 'react-router-dom';
import Comments from './Comments';

function Channel({num, details}) {
    const [channelInfo, setChannelInfo] = useState([]);
    const [channelMusic, setChannelMusic] = useState([]);

    const [initNum, setInitNum] = useState(details);

    // if(!initNum && !details){
    //     setInitNum("");
    // }
    // console.log(details);
    
    useEffect(() => {
        if(!details){
            setInitNum("");
        }
        // setInitNum("");
        Axios.get("http://localhost:8080/ezenmusic/channelinfo/"+num)
        .then(({data}) => {
            setChannelInfo(data);
        })
        .catch((err) => {
            console.log(err);
        })

        Axios.get("http://localhost:8080/ezenmusic/channel/"+num)
        .then(({data}) => {
            setChannelMusic(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
        <>
        
        {
            channelInfo.map((item, index) => (
                <StyledDetail>
                    <div className="mb-[40px]">
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/themeplaylist/"+item.org_cover_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[25px]" />
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.themetitle}</p>
                                {/* <p className="font-normal">{item.artist}</p> */}
                                {/* <Link to={"/detail/album/" +  + "/albumtrack"}><p className="font-light text-gray-600">{item.themetitle}</p></Link> */}
                                <div className="flex mt-[50px] ">
                                    <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                    <RiFolderAddLine className="mx-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                    <RiHeart3Line className="mx-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                     <div className="mb-[40px]">
                        {
                            initNum === ""?
                                <div>
                                    <Link to={"/detail/channel/" + item.num + ""} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("")}>곡</Link>
                                    <Link to={"/detail/channel/" + item.num + "/comments"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("comments")}>댓글</Link>
                                </div>
                                :
                                <div>
                                    <Link to={"/detail/channel/" + item.num + ""} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("")}>곡</Link>
                                    <Link to={"/detail/channel/" + item.num + "/comments"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("comments")}>댓글</Link>
                                </div>

                        }
                    </div>
                    {/*
                    {
                        initNum === "details"?
                            <Details id={item.id} title={item.title} composer={item.composer} lyricist={item.lyricist} arranger={item.arranger} lyrics={item.lyrics}/>
                            :
                            <Similar genre={item.genre} music_id={item.id}/>
                    } */}
                </StyledDetail>
            ))
        }
        {
            initNum ===""?
            <StyledBrowser className="relative">
                <div className="mb-3">
                    <div className="flex items-center cursor-pointer">
                        {/* <p className="chart-title">EzenMusic 차트</p>
                        <p className="text-slate-400 text-[12px] ml-[10px]">24시간 집계 (16시 기준)</p> */}
                        <RiPlayLine className="all-play-icon absolute top-[2px] left-[0px]"/>
                        <p className="ml-[25px] text-[14px] text-gray-500">전체듣기</p>
                    </div>
                </div>
                <div>
                    <hr className="text-gray-500"/>
                    <table className="table table-hover">
                        <thead className="h-[50px] align-middle ">
                            <tr className="">
                                <StyledTableth scope="col" className="text-center w-[5%]"><input type="checkbox" /></StyledTableth>
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
                                channelMusic.map((item, index) => (
                                    <MusicListCard title={item.title} album_title={item.album_title} artist={item.artist} img={item.org_cover_image} music_id={item.id} />
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </StyledBrowser>
            :
            <Comments />
        }
    </>
    )
}

export default Channel