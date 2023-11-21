import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios';
import styled from 'styled-components';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiArrowUpSLine, RiArrowDownSLine, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';

function DetailMylist({playlist_id}) {

    const [playlistData, setPlaylistData] = useState([]);
    const [albumAndMusicData, setAlbumAndMusicData] = useState([]);


    useEffect(() => {        
        Axios.get("http://localhost:8080/ezenmusic/detail/detailmylist/" + playlist_id)
        .then(({data}) => {
            setAlbumAndMusicData(data);
            Axios.get("http://localhost:8080/playlist/detail/detailmylist/" + playlist_id)
            .then(({data}) => {
                setPlaylistData(data);
            })
            .catch((err) => {
                {}
            })
        })
        .catch((err) => {
            {}
        })
    }, [])
    
    return (
        <>
        {
            playlistData.map((item, index) => (
                <StyledDetail key={index}>
                    <div>
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/album/"+albumAndMusicData[index].org_cover_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[10px]" />
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{playlistData[index].playlist_name}</p>
                                <p className="font-normal">{playlistData[index].length}</p>
                                <div className="flex mt-[50px] ">
                                    <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </StyledDetail>
                ))
            }

                    
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
                            albumAndMusicData.map((item, index) => (
                                <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </StyledBrowser>
        </>
    )
}

export default DetailMylist

const StyledDetail = styled.div`
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