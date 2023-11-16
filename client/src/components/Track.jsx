import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios';
import styled from 'styled-components';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";
import Details from './Details';
import Similar from './Similar';

function Track({music_id, details}) {

    const [detailMusic, setDetailMusic] = useState([]);

    const [initNum, setInitNum] = useState();

    if(!initNum){
        setInitNum(details);
    }

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/detail/"+music_id)
        .then(({data}) => {
            setDetailMusic(data);
        })
        .catch((err) => {
            {}
        })
        setInitNum(details);
        
    }, [music_id])
    
    return (
        <>
        {
            detailMusic.map((item, index) => (
                <StyledDetail>
                    <div>
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/album/"+item.org_cover_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[10px]" />
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.title}</p>
                                <p className="font-normal">{item.artist}</p>
                                <Link to={"/detail/album/" + music_id + "/albumtrack"}><p className="font-light text-gray-600">{item.album_title}</p></Link>
                                <div className="flex mt-[50px] ">
                                    <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                    <RiFolderAddLine className="mx-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                    <RiHeart3Line className="mx-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                    <RiProhibitedLine className="ml-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="mb-[40px]">
                        {
                            initNum === "details" || initNum === undefined?
                                <div>
                                    <Link to={"/detail/track/" + item.id + "/details"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("details")}>상세정보</Link>
                                    <Link to={"/detail/track/" + item.id + "/similar"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("similar")}>유사곡</Link>
                                </div>
                                :
                                <div>
                                    <Link to={"/detail/track/" + item.id + "/details"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("details")}>상세정보</Link>
                                    <Link to={"/detail/track/" + item.id + "/similar"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("similar")}>유사곡</Link>
                                </div>

                        }
                    </div>
                    {
                        initNum === "details"?
                            <Details id={item.id} title={item.title} composer={item.composer} lyricist={item.lyricist} arranger={item.arranger} lyrics={item.lyrics}/>
                            :
                            <Similar genre={item.genre} music_id={item.id}/>
                    }
                </StyledDetail>
            ))
        }
        </>
    )
}

export default Track

export const StyledDetail = styled.div`
    width: 1440px;
    margin: 0 auto;

    .detail-title{
        font-size: 28px;
        font-weight: 700;
    }

    .lyrics{
        white-space: pre-wrap;
    }

    .active{
        background-color: blue;
        color: white
    }
`