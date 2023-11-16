import React, {useEffect, useState} from 'react'
import { Params, useParams, useLocation, Link } from 'react-router-dom'
import styled from 'styled-components';
import SearchAll from '../components/SearchAll';
import SearchTrack from '../components/SearchTrack';
import SearchAlbum from '../components/SearchAlbum';
import SearchArtist from '../components/SearchArtist';
import SearchTheme from '../components/SearchTheme';
import SearchLyrics from '../components/SearchLyrics';
import { Outlet, NavLink } from 'react-router-dom';

function Search() {

    const {search_params1} = useParams();
    console.log(search_params1);
    // const [searchVal, setSearchVal] = useState("");
    const [active, setActive] = useState(0);
    // 검색 문자열 추출
    
    const search = decodeURI(useLocation().search).replace("?keyward=", "")
    // useEffect(() => {

    // }, [])

    return (
    <>
    <StyledSearchHeader>
        <div className="mb-[40px]">
            <p><span className="font-bold text-[20px]">'{search}'</span> <span className="text-[20px] text-gray-500">검색결과</span></p>
        </div>
        <div className="mb-[30px]">
            {/* <Link to={"/search/all?keyward=" + searchVal} id="search-actice" className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => clickActiceFunc(0)}>전체</Link>
            <Link to={"/search/track?keyward=" + searchVal} id="search-actice" className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => clickActiceFunc(1)}>곡</Link>
            <Link to={"/search/album?keyward=" + searchVal} id="search-actice" className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => clickActiceFunc(2)}>앨범</Link>
            <Link to={"/search/artist?keyward=" + searchVal} id="search-actice" className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => clickActiceFunc(3)}>아티스트</Link>
            <Link to={"/search/theme?keyward=" + searchVal} id="search-actice" className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => clickActiceFunc(4)}>테마리스트</Link>
            <Link to={"/search/lyrics?keyward=" + searchVal} id="search-actice" className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => clickActiceFunc(5)}>가사</Link> */}
            <NavLink to={"/search/all?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray-600" }>전체</NavLink>
            <NavLink to={"/search/track?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray-600" }>곡</NavLink>
            <NavLink to={"/search/album?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray-600" }>앨범</NavLink>
            <NavLink to={"/search/artist?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray-600" }>아티스트</NavLink>
            <NavLink to={"/search/theme?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray-600" }>테마리스트</NavLink>
            <NavLink to={"/search/lyrics?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray-600" }>가사</NavLink>
        </div>

        {
            search_params1 === "all" && <SearchAll keyward={search} />
        }
        {
            search_params1 === "track" && <SearchTrack keyward={search} />
        }
        {
            search_params1 === "album" && <SearchAlbum keyward={search} />
        }
        {
            search_params1 === "artist" && <SearchArtist keyward={search} />
        }
        {
            search_params1 === "theme" && <SearchTheme keyward={search} />
        }
        {
            search_params1 === "lyrics" && <SearchLyrics keyward={search} />
        }

    </StyledSearchHeader>
    </>
    )
}

export const StyledSearchHeader = styled.div`

    width: 1440px;
    min-width: 950px;
    margin: 50px auto;

    .active{
        background-color: blue;
        color: white
    }

    .search-nav{
        border-radius: 20px;
        padding: 7px 15px;
        margin-right: 10px;
        font-weight: 500;
    }
`

export default Search