import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import MusicListCard from '../card/MusicListCard';
import styled from 'styled-components';
import { RiPlayLine } from "react-icons/ri";
import { StyledBrowser, StyledTableth } from '../pages/Browse';

import MusicListHeader from '../card/MusicListHeader';
import AllChecked from '../modal/AllCheckedModal';
import LikeyBanner from '../card/LikeyBanner';
import { Cookies } from "react-cookie";

function Similar({genre, music_id, handleRender}) {
    const [similarMusic, setSimilarMusic] = useState([]);

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

        Axios.get("http://localhost:8080/ezenmusic/similar/"+genre)
        .then(({data}) => {
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
            setSimilarMusic(data);
        })
        .catch((err) => {
            {}
        })
    }, [music_id])

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
                            similarMusic.map((item, index) => (
                                <MusicListCard key={index} title={item.title} album_id={item.album_id} artist_num={item.artist_num} album_title={item.album_title} artist={item.artist} img={item.org_cover_image} music_id={item.id} likey={item.likey} check_all={allcheckVal} setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender}/>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
                allcheckVal ?
                <AllChecked setAllcheckVal={setAllcheckVal}/>
                :
                ""
            }
        </StyledBrowser>
    )
}


export default Similar