import React from 'react'
import styled from 'styled-components'
import LikeTrack from './LikeTrack';
import LikeAlbum from './LikeAlbum';
import LikeArtist from './LikeArtist';
import LikeTheme from './LikeTheme';
import { useParams, NavLink } from 'react-router-dom';


const Likey = ({handleRender}) => {

    const {storage_params} = useParams();

    return (
        <>
        <StyledLikey className="md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] m-auto">
            <div className="mb-[50px]">
                <NavLink to={"/storage/liketrack"} className={({ isActive }) => isActive ? "likey-nav active" : "likey-nav text-gray" }>곡</NavLink>
                <NavLink to={"/storage/likealbum"} className={({ isActive }) => isActive ? "likey-nav active" : "likey-nav text-gray" }>앨범</NavLink>
                <NavLink to={"/storage/likeartist"} className={({ isActive }) => isActive ? "likey-nav active" : "likey-nav text-gray" }>아티스트</NavLink>
                <NavLink to={"/storage/liketheme"} className={({ isActive }) => isActive ? "likey-nav active" : "likey-nav text-gray" }>리스트</NavLink>
            </div>
            { storage_params === "liketrack" && <LikeTrack division={storage_params} handleRender={handleRender}/> }
            { storage_params === "likealbum" && <LikeAlbum division={storage_params} handleRender={handleRender} /> }
            { storage_params === "likeartist" && <LikeArtist division={storage_params} handleRender={handleRender} /> }
            { storage_params === "liketheme" && <LikeTheme division={storage_params} handleRender={handleRender} /> }
        </StyledLikey>
        </>
    )
}

export const StyledLikey = styled.div`
    
    .likey-nav{
        background-color: #efefef;
        padding: 7px 15px;
        border-radius: 20px;
        font-size: 14px;
        margin-right: 10px;
    }

    .active{
        background-color: var(--main-theme-color);
        color: white;
    }
`

export default Likey

