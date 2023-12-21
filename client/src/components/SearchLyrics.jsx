import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components'
import MusicLyricsCard from '../card/MusicLyricsCard';
import MusicListHeader from '../card/MusicListHeader';
import { RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

function SearchLyrics({keyword, page, handleRender}) {
    
    const [searchLyrics, setSearchLyrics] = useState([]);
    const [haslyrics, setHaslyrics] = useState(false);

    let array = [];

    useEffect(() => {
        Axios.get("/ezenmusic/search/lyrics/" + keyword)
        .then(({data}) => {
            if(data.length == 0){
                setHaslyrics(false);
            }
            else{
                setHaslyrics(true);
                if(page === "all"){
                    if(data.length < 5){
                        for(let i=0; i<data.length; i++){
                            array.push(data[i]);
                        }
                    }
                    else{
                        for(let i=0; i<5; i++){
                            array.push(data[i]);
                        }
                    }
                    setSearchLyrics(array);
                }
                else{
                    setSearchLyrics(data);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
    <>
    {
        (page === "all" && haslyrics) &&
        <Link to={"/search/lyrics?keyword=" + keyword} ><p className="flex items-center font-bold text-[22px] mb-[20px]">가사<RiArrowRightSLine className="mt-[3px]" /></p></Link>
    }
    <StyledSearchLyrics>
        
        <table className="table table-hover">
            <MusicListHeader lank={false} page="searchLyrics"/>
            <tbody>
                {
                    searchLyrics.map((item, index) => (
                        <MusicLyricsCard key={index} music_title={item.music_title} album_title={item.album_title} album_id={item.album_id} artist_name={item.artist_name} artist_id={item.artist_id} img={item.org_cover_image} music_id={item.music_id} lyrics={item.lyrics} />
                    ))

                }
            </tbody>
        </table>
    </StyledSearchLyrics>
    </>
    )
}

const StyledSearchLyrics = styled.div`
    margin-bottom: 60px;
`

export default SearchLyrics