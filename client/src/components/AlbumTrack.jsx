import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import MusicListCard from '../card/MusicListCard';
import MusicListHeader from '../card/MusicListHeader';
import styled from 'styled-components';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { StyledBrowser, StyledTableth } from '../pages/Browse';


function AlbumTrack({id, album_title}) {

    const [albumTrackMusic, setalbumTrackMusic] = useState([]);
    const [allcheckVal, setAllcheckVal] = useState(false);

    
    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/detail/album/albumtrack/"+album_title)
        .then(({data}) => {
            setalbumTrackMusic(data);
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
                    <MusicListHeader lank={false} setAllcheckVal={setAllcheckVal} />
                    <tbody>
                        {
                            albumTrackMusic.map((item, index) => (
                                <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </StyledBrowser>
    )
}

export default AlbumTrack