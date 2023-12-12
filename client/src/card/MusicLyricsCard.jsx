import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { StyledTabletd } from './MusicListCard';

function MusicLyricsCard({music_title, album_title, artist_name, img, music_id, album_id, lyrics, check_all }) {

    const [chkboxChecked, setChkboxChecked] = useState(false);
    
    function chkboxClickFunc(e){
        setChkboxChecked(!chkboxChecked);
    }

    useEffect(() => {
        if(check_all == true){
            setChkboxChecked(true);
        }
        else{
            setChkboxChecked(false);
        }
    }, [check_all])

    return (
    <tr className="">
        <StyledTabletd className="text-center"><input type="checkbox" checked={chkboxChecked} onClick={chkboxClickFunc} /></StyledTabletd>
        <StyledTabletd className="d-flex items-center">
            <div className="col-1">
                <Link to={"/detail/track/" + music_id + "/details"}><img src={"/image/album/" + img} alt="img02" className="w-[60px] h-[60px] rounded-[5px]" /></Link>
            </div>
            <StyledLyricsBox className="lyrics-box col-8 ml-[20px] h-[60px]">
                <p className="mb-[5px]">{music_title}</p>
                <p className="text-gray font-normal text-[12px]"><Link to={"/detail/track/" + music_id + "/details"}>{lyrics}</Link></p>
            </StyledLyricsBox> 
        </StyledTabletd>
        <StyledTabletd className="w-[250px]"><p><Link to="#">{artist_name}</Link></p></StyledTabletd>
        <StyledTabletd className="w-[250px]"><p><Link to="#">{album_title}</Link></p></StyledTabletd>
    </tr>
    )
}

const StyledLyricsBox = styled.div`
    overflow: hidden;
`

export default MusicLyricsCard