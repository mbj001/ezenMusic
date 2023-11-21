import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components';
import { StyledBrowser, StyledTableth } from '../pages/Browse';
import {StyledDetail} from "../components/Track"
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiArrowDownSLine, RiArrowUpSLine,  RiHeart3Line, RiProhibitedLine  } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';
import MusicListHeader from '../card/MusicListHeader';
import { Link } from 'react-router-dom';
import Comments from './Comments';

function Channel({num, details}) {
    const [channelInfo, setChannelInfo] = useState([]);
    const [channelMusic, setChannelMusic] = useState([]);

    const [initNum, setInitNum] = useState(details);
    const [totalMusicNum, setTotalMusicNum] = useState(-1);
    const [allcheckVal, setAllcheckVal] = useState(false);
    
    useEffect(() => {
        if(!details){
            setInitNum("");
        }
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
            setTotalMusicNum(data.length);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
        <>
        
        {
            channelInfo.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div className="mb-[40px]">
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/themeplaylist/"+item.org_cover_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[25px]" />
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.themetitle}</p>
                                <p className="text-[14px] text-gray-500 mb-[20px]">{item.description}</p>  
                                <p>총 {totalMusicNum}곡</p>
                                <p className="text-[14px] text-gray-500">{item.release_date_format}</p>
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
                </StyledDetail>
            ))
        }
        {
            initNum ===""?
            <StyledBrowser className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
                <div className="mb-3">
                    <div className="flex items-center cursor-pointer">
                        <RiPlayLine className="all-play-icon absolute top-[2px] left-[0px]"/>
                        <p className="ml-[25px] text-[14px] text-gray-500">전체듣기</p>
                    </div>
                </div>
                <div>
                    <hr className="text-gray-500"/>
                    <table className="table table-hover">
                        <MusicListHeader lank={false} setAllcheckVal={setAllcheckVal} />
                        <tbody>
                            {
                                channelMusic.map((item, index) => (
                                    <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} />
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