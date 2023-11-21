import React, {useState, useEffect} from 'react'
import Axios from 'axios'   
import styled from 'styled-components';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { StyledBrowser, StyledTableth } from '../pages/Browse';
import MusicListCard from '../card/MusicListCard';
import AlbumTrack from "./AlbumTrack";
import Album from "./Album";


function ArtistTrack({artist, music_id, artist_num}) {

    const [artistTrackMusic, setartistTrackMusic] = useState([]);


    useEffect(() => {
        
        Axios.get("http://localhost:8080/ezenmusic/detail/artist/artisttrack/"+ artist_num)
            .then(({ data }) => {
            setartistTrackMusic(data);
        })
        .catch((err) => {
            {}
        })
    }, [])

    return (
        <StyledBrowser className="relative">
            <div className="mb-3">
                <div className="flex items-center cursor-pointer">
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
                            artistTrackMusic.map((item, index) => (
                                <MusicListCard key={index} title={item.title} album_id={item.album_id} album_title={item.album_title} artist_num={artist_num} artist={item.artist} img={item.org_cover_image} music_id={item.id} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </StyledBrowser>
    )
}

export default ArtistTrack