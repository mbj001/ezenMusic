import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { StyledTabletd } from './MusicListCard';

function MusicLyricsCard({music_title, album_title, artist_name, artist_id, img, music_id, album_id, lyrics}) {

    return (
    <tr className="">
        <StyledTabletd className="d-flex items-center">
            <div className="col-1">
                <Link to={"/detail/track/" + music_id + "/details"}><img src={"/image/album/" + img} alt="img02" className="w-[60px] h-[60px] rounded-[5px]" /></Link>
            </div>
            <StyledLyricsBox className="lyrics-box col-8 ml-[20px] h-[60px]">
                <p className="mb-[5px]">{music_title}</p>
                <p className="text-gray font-normal text-[12px]"><Link to={"/detail/track/" + music_id + "/details"}>{lyrics}</Link></p>
            </StyledLyricsBox> 
        </StyledTabletd>
        <StyledTabletd className="w-[250px]"><p><Link to={"/detail/artist/"+artist_id+"/track?sortType=POPULARITY"}>{artist_name}</Link></p></StyledTabletd>
        <StyledTabletd className="w-[250px]"><p><Link to={"/detail/album/"+album_id+"/albumtrack"}>{album_title}</Link></p></StyledTabletd>
    </tr>
    )
}

const StyledLyricsBox = styled.div`
    overflow: hidden;
`

export default MusicLyricsCard