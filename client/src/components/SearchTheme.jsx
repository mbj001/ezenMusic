import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { RiArrowRightSLine } from "react-icons/ri";
import { playerAdd } from '../procedure/playerAddButton';
import PlayerBanner from '../card/PlayerBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import { Cookies } from 'react-cookie';
import { AppContext } from '../App'

// 승렬
import { TransTinyPlayButton as PlayButton } from '../style/StyledIcons';

function SearchTheme({keyword, page, handleRender}) {

    const [searchTheme, setSearchTheme] = useState([]);
    const [hasTheme, setHasTheme] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));


    useEffect(() => {
        Axios.get("/ezenmusic/search/theme/"+keyword)
        .then(({data}) => {
            if(data.length == 0){
                setHasTheme(false);
            }
            else{
                setHasTheme(true);
                setSearchTheme(data);
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
        {
            (page === "all" && hasTheme ) &&
            <Link to={"/search/theme?keyword=" + keyword} >
                <p className="flex items-center font-bold text-[22px] mt-[45px] mb-[20px]">
                    테마리스트<RiArrowRightSLine className="mt-[3px]" />
                </p>
            </Link>
        }

        <StyledSearchTheme>
            {
                searchTheme.map((item, index) => (
                    <div key={index} className="themebox mr-[50px] w-[175px] h-[210px] relative">
                        <Link to={"/detail/channel/"+item.themeplaylist_id}>
                            <img src={"/image/themeplaylist/"+item.org_cover_image} alt="theme_cover_image" className="w-[175px] h-[175px] rounded-[10px]" />
                        </Link>
                        <p className="theme-title mt-[10px] text-[15px]">{item.themeplaylist_title}</p>
                        <PlayButton onClick={isSessionValid ? ()=>{playerAdd("mainbanner_theme", item.themeplaylist_id, handleRender, setPlayerBannerOn);} : () => setLoginrRequestVal(true)} > </PlayButton>

                    </div>
                ))
            }
        </StyledSearchTheme>
        </>
    )
}

const StyledSearchTheme = styled.div`
    display: flex;
    margin-bottom: 60px;

    .themebox{
        // white-space: nowrap;
        overflow: hidden;
        // display:-webkit-box;
        // -webkit-line-clamp:2;
        // -webkit-box-orient:vertical;
        .theme-title{
            width: 100%;
            font-size: 15px;
            font-weight: 700;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-top: 10px;
        }
    }

    img:hover{
        filter: brightness(70%)
    }

`

export default SearchTheme