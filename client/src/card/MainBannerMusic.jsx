import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import Axios from "axios";

function MainBannerMusic({themeplaylist_id}) {
    const [thememusic, setThememusic] = useState([]);

    useEffect(() => {
        Axios.get("/ezenmusic/mainbannermusic/" + themeplaylist_id)
        .then(({data}) => {
            // music
            setThememusic(data);
        })
        .catch((err) => {
            console.log(err);
        })
    },[])
    
    return (
        <>
        {
            thememusic.map((list, idx)=>(
                <div className="col-6 py-2" key={idx}>
                    <div className="row h-100">
                        <div className="col-3">
                            <PlaylistThumbs className='w-45 h-45' url={list.org_cover_image}></PlaylistThumbs>
                        </div>
                        <PlaylistInfo className="col-9">
                            <p className='song-title'>{list.music_title}</p>
                            <p className='song-artist'>{list.artist_name}</p>
                        </PlaylistInfo>
                    </div>
                </div>
            ))
        }
    </>
    )
}

const PlaylistThumbs = styled.div`
    width: 45px;
    height: 45px;
    background-image: url(/image/album/${props=>props.url});
    background-repeat: no-repeat;
    background-size: contain;
    border-radius: 3px;
    overflow: hidden;
    margin-left: 10px;
`;
const PlaylistInfo = styled.div`
    white-space: nowrap;
    overflow: hidden;

    .song-title{
        font-size: 16px;
        font-weight: 400;
        width: 93%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .song-artist{
        font-size: 13px;
        font-weight: 400;
        color: var(--main-text-gray-lighter);
    }
`;
export default MainBannerMusic