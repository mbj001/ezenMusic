import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import ArtistAlbumTrack from '../card/ArtistAlbumTrack';
import styled from 'styled-components';
import { StyledBrowser } from '../pages/Browse';



function ArtistAlbum({details, artist_name, artist_id, handleRender}) {

    const [artistAlbumtrack, setartistAlbumtrack] = useState([]);
    const [albumRelease, setalbumRelease] = useState([]);
    const [order, setOrder] = useState('');
    const [albumAsc, setalbumAsc] = useState([]);
    
    const handleOrder = (e) => {
        setOrder(e.target.value);
    }
    
    useEffect(() => {
    }, [order])
    
    useEffect(() => {
        Axios.get("/ezenmusic/detail/artist/albumtrack/asc/" + artist_id)
            .then(({ data }) => {
            setalbumAsc(data)
            }).catch((err) => {
            console.error(err)
        })
        Axios.get("/ezenmusic/detail/artist/albumtrack/release_date/"+ artist_id)
            .then(({ data }) => {
                setalbumRelease(data)
            }).catch((err) => {
                console.error(err)
            })
        
        Axios.get("/ezenmusic/detail/artist/albumtrack/"+ artist_id)
            .then(({ data }) => {
                setartistAlbumtrack(data)
            })
            .catch((err) => {
            console.error(err)
            })
        
    },[artist_id])

    return (
        <StyledBrowser className="relative">
            <div className="artist_Album_track">
                    <StyledAlbum className="artist_Album_bener">
                        <button type="submit" onClick={handleOrder} value={'all'} className="m-2 rounded-[20px] mr-[10px] text-gray-500 cursor-pointer hover:text-blue-500 all">전체</button>
                        <button type="submit" onClick={handleOrder} value={'recent'} className="m-2 rounded-[20px] mr-[10px] text-gray-500 cursor-pointer hover:text-blue-500 date">최신순</button>
                        <button type="submit" onClick={handleOrder} value={'asc'} className="m-2 rounded-[20px] mr-[10px] text-gray-500 cursor-pointer hover:text-blue-500 abc">가나다순</button>
                    </StyledAlbum>
                
                   <StyledAlbum className="artist_Album_benerafter"></StyledAlbum>
                    <ul className="artist_Album_ul">
                    {
                        order === 'all' ? 
                        <>
                        {  
                            artistAlbumtrack.map((item, index) => (
                                <ArtistAlbumTrack key={index} music_title={item.music_title} album_title={item.album_title} artist_id={artist_id} artist_name={item.artist_name} img={item.org_cover_image} album_id={item.album_id} album_release_date={item.release_date_format} album_size={item.album_size} handleRender={handleRender}/>
                            ))
                        }
                        </>
                        :
                        order === 'recent' ? 
                        <>
                            { 
                                albumRelease.map((item, index) => (
                                    <ArtistAlbumTrack key={index} music_title={item.title} album_title={item.album_title} artist_id={artist_id} artist_name={item.artist_name} img={item.org_cover_image} album_id={item.album_id} album_release_date={item.release_date_format} album_size={item.album_size} handleRender={handleRender}/>
                                ))
                            } 
                        </>
                        :
                        order === 'asc' ?
                        <>
                            {                             
                                albumAsc.map((item, index) => (
                                    <ArtistAlbumTrack key={index} music_title={item.music_title} album_title={item.album_title} artist_id={artist_id} artist_name={item.artist_name} img={item.org_cover_image} album_id={item.album_id} album_release_date={item.release_date_format} album_size={item.album_size} handleRender={handleRender}/>
                                ))
                            }
                        </>
                        :
                        <>
                        {                
                        artistAlbumtrack.map((item, index) => (
                                <ArtistAlbumTrack key={index} music_title={item.music_title} album_title={item.album_title} artist_id={artist_id} artist_name={item.artist_name} img={item.org_cover_image} album_id={item.album_id} album_release_date={item.release_date_format} album_size={item.album_size} handleRender={handleRender}/>

                        ))
                        } 
                        </>
                    }
                </ul>
            </div>

        </StyledBrowser>
    )
}

const StyledAlbum = styled.div`
    // font-size: 16px;
    // font-weight: 400;
    // right: 0;
    // /* text-decoration: none;
    // list-style: none; */
`
const StyledAlbumUl = styled.ul`
    
`
export default ArtistAlbum