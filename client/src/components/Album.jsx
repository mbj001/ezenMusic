import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';
import styled from 'styled-components';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";
import Details from './Details';
import Similar from './Similar';
import AlbumIntro from './AlbumIntro';
import AlbumTrack from "./AlbumTrack";

function Album({album_id, details}) {

    const [detailMusic, setDetailMusic] = useState([]);

    const [initNum, setInitNum] = useState();

    if(!initNum){
        setInitNum(details);
    }

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/detail/album/"+album_id)
        .then(({data}) => {
            setDetailMusic(data);
        })
        .catch((err) => {
            {}
        })

    }, [])

    return (
        <>
        {
            detailMusic.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div>
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/album/"+item.org_cover_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[10px]" />
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.album_title}</p>
                                <p className="font-normal">{item.artist}</p>
                                <p className="font-light text-gray-600">{item.album_size}</p>
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
                            initNum === "albumtrack" || initNum === undefined ?
                            <div>
                                <Link to={"/detail/album/" + album_id + "/intro"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("intro")}>상세정보</Link>
                                <Link to={"/detail/album/" + album_id + "/albumtrack"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("albumtrack")}>수록곡</Link>
                            </div>
                            :
                            <div>
                                <Link to={"/detail/album/" + album_id + "/intro"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("intro")}>상세정보</Link>
                                <Link to={"/detail/album/" + album_id + "/albumtrack"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("albumtrack")}>수록곡</Link>
                            </div>
                        }
                    </div>
                    {
                        initNum === "albumtrack"?
                            <AlbumTrack id={album_id} album_title={item.album_title} />
                            :
                            <AlbumIntro album_title={item.album_title} artist={item.artist} intro={item.intro} publisher={item.publisher} agency={item.agency} />
                    }
                </StyledDetail>
            ))
        }
        </>
    )
}

export default Album

const StyledDetail = styled.div`
    // width: 1440px;
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