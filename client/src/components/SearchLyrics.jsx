import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components'
import MusicLyricsCard from '../card/MusicLyricsCard';
import MusicListHeader from '../card/MusicListHeader';
import { StyledTableth } from '../pages/Browse';
import { RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

function SearchLyrics({keyward, page}) {
    
    const [searchLyrics, setSearchLyrics] = useState([]);
    const [haslyrics, setHaslyrics] = useState(false);
    const [allcheckVal, setAllcheckVal] = useState(false);

    let array = [];

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/search/lyrics/" + keyward)
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
                        setSearchLyrics(array);
                        console.log(array);
                    }
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
        page === "all" && haslyrics?
        <Link to={"/search/lyrics?keyward=" + keyward} ><p className="flex items-center font-bold text-[22px] mb-[20px]">가사<RiArrowRightSLine className="mt-[3px]" /></p></Link>
        :
        ""
    }
    <StyledSearchLyrics>
        <table className="table table-hover">
            <MusicListHeader lank={false} page="search" setAllcheckVal={setAllcheckVal} />
            <tbody>
                {
                    searchLyrics.map((item, index) => (
                        <MusicLyricsCard key={index} title={item.title} album_title={item.album_title} artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} lyrics={item.lyrics} check_all={allcheckVal} />
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