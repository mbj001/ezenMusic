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

function Search({handleRender}) {

    const {search_params1} = useParams();
    
    // 검색 문자열 추출
    const search = decodeURI(useLocation().search).replace("?keyward=", "");

    return (
    <>
    <StyledSearchHeader className="search_main">
        <div className="mb-[40px]">
            <p><span className="font-bold text-[20px]">'{search}'</span> <span className="text-[20px] text-gray">검색결과</span></p>
        </div>
        <div className="mt-[40px] search_list">
            <NavLink to={"/search/all?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>전체</NavLink>
            <NavLink to={"/search/track?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>곡</NavLink>
            <NavLink to={"/search/album?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>앨범</NavLink>
            <NavLink to={"/search/artist?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>아티스트</NavLink>
            <NavLink to={"/search/theme?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>테마리스트</NavLink>
            <NavLink to={"/search/lyrics?keyward=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>가사</NavLink>
        </div>

        { search_params1 === "all" && <SearchAll keyward={search} handleRender={handleRender}/> }
        { search_params1 === "track" && <SearchTrack keyward={search} handleRender={handleRender}/> }
        { search_params1 === "album" && <SearchAlbum keyward={search} /> }
        { search_params1 === "artist" && <SearchArtist keyward={search} /> }
        { search_params1 === "theme" && <SearchTheme keyward={search} /> }
        { search_params1 === "lyrics" && <SearchLyrics keyward={search} /> }
        
    </StyledSearchHeader>
    </>
    )
}

export const StyledSearchHeader = styled.div`

    // width: 1440px;
    // min-width: 950px;
    margin: 50px auto;

    .active{
        background-color: var(--main-theme-color);
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