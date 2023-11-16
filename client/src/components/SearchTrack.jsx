import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components';
import { StyledBrowser, StyledTableth } from '../pages/Browse';
import MusicListCard from '../card/MusicListCard';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
function SearchTrack({keyward}) {

    const [searchTrack, setSearchTrack] = useState([]);

    useEffect(() => {
        console.log(keyward);
        Axios.get("http://localhost:8080/ezenmusic/search/track/" + keyward)
        .then(({data}) =>{
            setSearchTrack(data);
        })
        .catch((err) => {
            console.log(err);
        })

    }, [])

    return (
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
                        searchTrack.map((item, index) => (
                            <MusicListCard title={item.title} album_title={item.album_title} artist={item.artist} img={item.org_cover_image} music_id={item.id} />
                        ))
                    }
                </tbody>
            </table>
        </div>
    </StyledBrowser>
    )
}

export default SearchTrack