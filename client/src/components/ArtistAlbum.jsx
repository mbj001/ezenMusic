import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import ArtistAlbumTrack from '../card/ArtistAlbumTrack';
import styled from 'styled-components';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { StyledBrowser, StyledTableth } from '../pages/Browse';
import { Link } from "react-router-dom";



function ArtistAlbum({detail, artist, artist_num}) {

    const [artistAlbumtrack, setartistAlbumtrack] = useState([]);
    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/detail/artist/albumtrack/"+ artist)
            .then(({ data }) => {
                setartistAlbumtrack(data)
            })
            .catch((err) => {
            console.error(err)
        })
    },[])

    return (
        <StyledBrowser className="relative">
            <div className="mb-3">
                <div className="flex items-center cursor-pointer">
                </div>
            </div>
            <div className="artist_Album_track relative">
                <StyledAlbum className="absolute">
                        <button type="submit" className="m-3 rounded-[20px] mr-[10px] text-gray-500 cursor-pointer hover:text-blue-500">전체</button>
                        <button type="submit" className="m-3 rounded-[20px] mr-[10px] text-gray-500 cursor-pointer hover:text-blue-500">최신순</button>
                        <button type="submit" className="m-3 rounded-[20px] mr-[10px] text-gray-500 cursor-pointer hover:text-blue-500">인기순</button>
                        <button type="submit" className="m-3 rounded-[20px] mr-[10px] text-gray-500 cursor-pointer hover:text-blue-500">가나다순</button>
                </StyledAlbum>
                <ul className="block">
                {
                    artistAlbumtrack.map((item, index) => (
                        <ArtistAlbumTrack key={index} title={item.title} album_title={item.album_title} artist_num={artist_num} artist={item.artist} img={item.org_cover_image} album_id={item.album_id}/>
                    ))
                        }
                </ul>
            </div>

        </StyledBrowser>
    )
}
const StyledAlbum = styled.div`
    font-size: 16px;
    font-weight: 400;
    right: 0;
    /* text-decoration: none;
    list-style: none; */
`
const StyledAlbumUl = styled.ul`
    
`
export default ArtistAlbum