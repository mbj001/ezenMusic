import React, {useState, useEffect} from 'react'
import Axios from 'axios'   
import styled from 'styled-components';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { StyledBrowser, StyledTableth } from '../pages/Browse';
import MusicListCard from '../card/MusicListCard';
import AlbumTrack from "./AlbumTrack";
import Album from "./Album";

import MusicListHeader from '../card/MusicListHeader';
import AllCheckedModal from '../modal/AllCheckedModal';
import LikeyBanner from '../card/LikeyBanner';
import { Cookies } from "react-cookie";

function ArtistTrack({artist, music_id, artist_num, handleRender}) {

    const [artistTrackMusic, setartistTrackMusic] = useState([]);

    const [allcheckVal, setAllcheckVal] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");
    let array = [];


    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/allpage/likeylist/"+userid_cookies)
        .then(({data}) => {
                array = data[0].music_list;
            })
        .catch((err) => {
            console.log(err);
        })

        Axios.get("http://localhost:8080/ezenmusic/detail/artist/artisttrack/"+ artist_num)
        .then(({ data }) => {
            for(let i=0; i<data.length; i++){
                // object 에 likey 라는 항목 넣고 모두 false 세팅
                data[i].likey = false;
            }
            for(let i=0; i<array.length; i++){
                for(let j=0; j<data.length; j++){
                    if(array[i] === Number(data[j].id)){
                        // 좋아요 해당 object 의 값 true 로 변경
                        data[j].likey = true;
                    }
                }
            }
            setartistTrackMusic(data);
        })
        .catch((err) => {
            {}
        })
    }, [])

    return (
        <StyledBrowser className="relative">
            <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"track"}/>
            <div className="mb-3">
                <div className="flex items-center cursor-pointer">
                    <RiPlayLine className="all-play-icon absolute top-[2px] left-[0px]"/>
                    <p className="ml-[25px] text-[14px] text-gray">전체듣기</p>
                </div>
            </div>
            <div>
                <hr className="text-gray"/>
                <table className="table table-hover">
                    <MusicListHeader lank={false} setAllcheckVal={setAllcheckVal} allcheckVal={allcheckVal} />
                    <tbody>
                        {
                            artistTrackMusic.map((item, index) => (
                                <MusicListCard key={index} title={item.title} album_id={item.album_id} album_title={item.album_title} artist_num={artist_num} 
                                artist={item.artist} img={item.org_cover_image} music_id={item.id} likey={item.likey} check_all={allcheckVal} 
                                setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
                allcheckVal ?
                <AllCheckedModal setAllcheckVal={setAllcheckVal} />
                :
                ""
            }
        </StyledBrowser>
    )
}

export default ArtistTrack