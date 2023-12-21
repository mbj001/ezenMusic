import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import styled from 'styled-components';
import SearchAll from '../components/SearchAll';
import SearchTrack from '../components/SearchTrack';
import SearchAlbum from '../components/SearchAlbum';
import SearchArtist from '../components/SearchArtist';
import SearchTheme from '../components/SearchTheme';
import SearchLyrics from '../components/SearchLyrics';
import { NavLink } from 'react-router-dom';

function Search({handleRender}) {

    const {search_params1} = useParams();
    
    // 검색 문자열 추출
    let search = decodeURI(useLocation().search).replace("?keyword=", "");
    let sortType;
    if(decodeURI(useLocation().search).includes("&sortType=")){
        let array = search.split("&sortType=");
        search = array[0];
        sortType = array[1];
    }

    return (
    <>
    <StyledSearchHeader className="md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
        <div className="">
            <p><span className="font-bold text-[20px]">'{search}'</span> <span className="text-[20px] text-gray">검색결과</span></p>
        </div>
        <div className="my-[30px]">
            <NavLink to={"/search/all?keyword=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>전체</NavLink>
            <NavLink to={"/search/track?keyword=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>곡</NavLink>
            <NavLink to={"/search/album?keyword="+ search +"&sortType=RECENCY"} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>앨범</NavLink>
            <NavLink to={"/search/artist?keyword=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>아티스트</NavLink>
            <NavLink to={"/search/theme?keyword=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>테마리스트</NavLink>
            <NavLink to={"/search/lyrics?keyword=" + search} id="search-actice" className={({ isActive }) => isActive ? "search-nav active" : "search-nav text-gray" }>가사</NavLink>
        </div>

        { search_params1 === "all" && <SearchAll keyword={search} handleRender={handleRender}/> }
        { search_params1 === "track" && <SearchTrack keyword={search} handleRender={handleRender}/> }
        { search_params1 === "album" && <SearchAlbum keyword={search} handleRender={handleRender} sortType={sortType} /> }
        { search_params1 === "artist" && <SearchArtist keyword={search} handleRender={handleRender}/> }
        { search_params1 === "theme" && <SearchTheme keyword={search} handleRender={handleRender}/> }
        { search_params1 === "lyrics" && <SearchLyrics keyword={search} /> }
        
    </StyledSearchHeader>
    </>
    )
}

export const StyledSearchHeader = styled.div`
    margin-top: 20px;
    margin-right: auto;
    margin-left: auto;

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