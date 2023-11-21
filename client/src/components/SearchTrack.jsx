import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components';
import { StyledBrowser, StyledTableth } from '../pages/Browse';
import MusicListCard from '../card/MusicListCard';
import MusicListHeader from '../card/MusicListHeader';
import { RiPlayLine, RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
function SearchTrack({keyward, page}) {

    const [searchTrack, setSearchTrack] = useState([]);
    const [hasTrack, setHasTrack] = useState(false);
    const [allcheckVal, setAllcheckVal] = useState(false);

    let array = [];

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/search/track/" + keyward)
        .then(({data}) =>{
            if(data.length == 0){
                setHasTrack(false);
            }
            else{
                setHasTrack(true);
                if(page === "all"){
                    for(let i=0; i<5; i++){
                        array.push(data[i]);
                    }
                    setSearchTrack(array);
                }
                else{
                    setSearchTrack(data);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })

    }, [])

    return (
        <>
        {
            page === "all" && hasTrack?
            <Link to={"/search/track?keyward=" + keyward} ><p className="flex items-center font-bold text-[22px] mb-[20px]">곡<RiArrowRightSLine className="mt-[3px]" /></p></Link>
            :
            ""
        }
        <StyledBrowser className="relative">
        <div className="mb-3">
            <div className="flex items-center cursor-pointer">
                <RiPlayLine className="all-play-icon absolute top-[2px] left-[0px]"/>
                <p className="ml-[25px] text-[14px] text-gray-500">전체듣기</p>
            </div>
        </div>
        <div className="mb-[60px]">
            <hr className="text-gray-500"/>
            <table className="table table-hover">
                <MusicListHeader lank={false} setAllcheckVal={setAllcheckVal} />
                <tbody>
                    {
                        searchTrack.map((item, index) => (
                            <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} />
                        ))
                    }
                </tbody>
            </table>
        </div>
    </StyledBrowser>
    </>
    )
}

export default SearchTrack