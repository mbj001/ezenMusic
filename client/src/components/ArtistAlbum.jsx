import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import ArtistAlbumTrack from '../card/ArtistAlbumTrack';
import styled from 'styled-components';
import { StyledBrowser } from '../pages/Browse';



function ArtistAlbum({details, artist, artist_num,}) {

    const [artistAlbumtrack, setartistAlbumtrack] = useState([]);
    const [albumRelease, setalbumRelease] = useState([]);
    const [ order, setOrder ] = useState('');
    const [albumAsc, setalbumAsc] = useState([]);
    
    const handleOrder = (e) => {
        setOrder(e.target.value);
    }
    
    useEffect(() => {
        console.log(order);
    }, [order])
    
    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/detail/artist/albumtrack/asc/" + artist)
            .then(({ data }) => {
            setalbumAsc(data)
            }).catch((err) => {
            console.error(err)
        })
        Axios.get("http://localhost:8080/ezenmusic/detail/artist/albumtrack/release_date/"+ artist)
            .then(({ data }) => {
                setalbumRelease(data)
            }).catch((err) => {
                console.error(err)
            })
        
        Axios.get("http://localhost:8080/ezenmusic/detail/artist/albumtrack/"+ artist)
            .then(({ data }) => {
                setartistAlbumtrack(data)
            })
            .catch((err) => {
            console.error(err)
            })
        
    },[artist])

    return (
        <StyledBrowser className="relative">
            <div className="mb-3">
                <div className="flex items-center cursor-pointer">
                </div>
            </div>
            <div className="artist_Album_track relative">

                    <StyledAlbum className="absolute">
                        <button type="submit" onClick={handleOrder} value={'all'} className="m-3 rounded-[20px] mr-[10px] text-gray cursor-pointer hover-text-blue all">전체</button>
                        <button type="submit" onClick={handleOrder} value={'recent'} className="m-3 rounded-[20px] mr-[10px] text-gray cursor-pointer hover-text-blue date">최신순</button>
                        <button type="submit" onClick={handleOrder} value={'asc'} className="m-3 rounded-[20px] mr-[10px] text-gray cursor-pointer hover-text-blue abc">가나다순</button>
                    </StyledAlbum>


                <ul className="block">
                    <div className="flex flex-wrap">
                    {
                        
                        order === 'all' ? 
                        <>
                        {  
                            artistAlbumtrack.map((item, index) => (
                                <div className="col-4">
                                    <ArtistAlbumTrack key={index} title={item.title} album_title={item.album_title} artist_num={artist_num} artist={item.artist} img={item.org_cover_image} album_id={item.album_id} album_release_date={item.release_date_format} album_size={item.album_size}/>
                                </div>
                            ))
                        }
                        </>
                            :
                        order === 'recent' ? 
                            <>
                                { 
                                    albumRelease.map((item, index) => (
                                        <div className="col-4">
                                            <ArtistAlbumTrack key={index} title={item.title} album_title={item.album_title} artist_num={artist_num} artist={item.artist} img={item.org_cover_image} album_id={item.album_id} album_release_date={item.release_date_format} album_size={item.album_size}/>
                                        </div>
                                    ))
                                } 
                            </>
                            :
                        order === 'asc' ?
                                <>
                                    {                             
                                        albumAsc.map((item, index) => (
                                            <div className="col-4">
                                                <ArtistAlbumTrack key={index} title={item.title} album_title={item.album_title} artist_num={artist_num} artist={item.artist} img={item.org_cover_image} album_id={item.album_id} album_release_date={item.release_date_format} album_size={item.album_size}/>

                                            </div>
                                        ))
                                    }
                                </>
                                :
                            <>
                            {                
                            artistAlbumtrack.map((item, index) => (
                                <div className="col-4">
                                    <ArtistAlbumTrack key={index} title={item.title} album_title={item.album_title} artist_num={artist_num} artist={item.artist} img={item.org_cover_image} album_id={item.album_id} album_release_date={item.release_date_format} album_size={item.album_size}/>

                                </div>
                            ))
                            } 
                            </>
                    }
                    </div>
                    
                    
                    
                </ul>
            </div>

        </StyledBrowser>
    )
}

const StyledAlbum = styled.div`
    font-size: 16px;
    font-weight: 400;
    right: 0;
    /* text-decoration: none;
    list-style: none; */
`
const StyledAlbumUl = styled.ul`
    
`
export default ArtistAlbum