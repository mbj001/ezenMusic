import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components';
import { RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import SearchAlbumtrack from "../card/SearchAlbumtrack";

function SearchAlbum({keyward, page}) {

    const [searchAlbum, setSearchAlbum] = useState([]);
    const [hasAlbum, setHasAlbum] = useState(false);
    let array = [];

    useEffect(() => {
        Axios.get("/ezenmusic/search/album/" + keyward)
        .then(({data}) => {
            if(data.length == 0){
                setHasAlbum(false);
            }
            else{
                setHasAlbum(true);
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
                    setSearchAlbum(array);
                }
                else{
                    setSearchAlbum(data);
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
            page === "all" && hasAlbum?
            <Link to={"/search/album?keyward=" + keyward} ><p className="flex items-center font-bold text-[22px] mb-[10px]">앨범<RiArrowRightSLine className="mt-[3px]" /></p></Link>
            :
            ""
        }
        <StyledSearchAlbum>

        {    
            searchAlbum.map((item, index) => (
            <SearchAlbumtrack key={index} title={item.music_title} album_title={item.album_title} artist_id={item.artist_id} artist_name={item.artist_name} img={item.org_cover_image} album_id={item.album_id} album_release_date={item.release_date_format} album_size={item.album_size}/>
                ))
        }
        </StyledSearchAlbum>
        </>
    )
}

export const StyledSearchAlbum = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    margin-left: -85px;

    img:hover{
        filter: brightness(70%)
    }
`

export default SearchAlbum