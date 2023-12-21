import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios";
import styled from 'styled-components';
import { RiPlayLine, RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { playerAdd } from '../procedure/playerAddButton';
import PlayerBanner from '../card/PlayerBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import { Cookies } from 'react-cookie';
import { AppContext } from '../App'

function SearchArtist({keyword, page, handleRender}) {

    const [artistInfo, setArtistInfo] = useState([]);
    const [hasArtist, setHasArtist] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    useEffect(() => {
        Axios.get("/ezenmusic/search/artist/" + keyword)
        .then(({data}) => {
            if(data.length === 0){
                setHasArtist(false);
            } 
            else{
                setHasArtist(true);
                if(page === "all")
                {
                    setArtistInfo([data[0]]);
                }
                else{
                    setArtistInfo(data);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
    <>
    { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
    { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
    <StyledSearchArtist>
        {
            (page === "all" && hasArtist) &&
            <Link to={"/search/artist?keyword=" + keyword} >
                <p className="flex items-center font-bold text-[22px]">
                    아티스트<RiArrowRightSLine className="mt-[3px]" />
                </p>
            </Link>
        }
        <div className='searched-artist-cover'>
            {
                hasArtist &&
                artistInfo.map((item, index) => (
                    <div key={index} className='py-[30px]'>
                        <div className='flex items-center justify-start'>
                            <div className="w-[180px] min-w-[180px] max-w-[180px] h-[180px] rounded-[50%] hover:brightness-75 overflow-hidden" >
                                <Link to={"/detail/artist/"+item.artist_id+"/track?sortType=POPULARITY"}>
                                    <img src={"/image/artist/"+item.org_artist_image} alt="img" className="w-full h-full object-cover cursor-pointer"/>
                                </Link>
                            </div>
                            <div className="pl-[30px]">
                                <Link to={"/detail/artist/"+item.artist_id+"/track?sortType=POPULARITY"}><p className="font-bold mb-[10px]">{item.artist_name}</p></Link>
                                <p className="text-[12px] text-gray mb-[20px]">
                                    {item.artist_class === "solo" && "솔로"} 
                                    {item.artist_class === "duo" && "듀오"} 
                                    {item.artist_class === "group" && "그룹"} 
                                    <span className="mx-[5px]">|</span> 
                                    {item.artist_gender === "male" && "남성"}
                                    {item.artist_gender === "duo" && "듀오"}
                                    {item.artist_gender === "female" && "여성"}
                                </p>
                                <div className="flex items-center cursor-pointer" onClick={isSessionValid? () => playerAdd("search_artist", item.artist_id, handleRender, setPlayerBannerOn) : () => setLoginrRequestVal(true)}>
                                    <RiPlayLine className="mt-[2px] ml-[-4px] mr-[5px] text-[18px]"/>
                                    <p className="text-[13px]">인기곡 듣기</p>
                                </div>   
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    </StyledSearchArtist>
    </>
    )
}

export const StyledSearchArtist = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
    .searched-artist-cover{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
`

export default SearchArtist