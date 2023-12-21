import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import styled from 'styled-components';
import { RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import ArtistAlbumCard from '../card/ArtistAlbumCard';
import { AlbumCover } from './ArtistAlbum';
import { ButtonBox } from './ArtistAlbum';
import { Cookies } from 'react-cookie';
import { AppContext } from '../App'

function SearchAlbum({keyword, page, handleRender, sortType}) {

    const [searchAlbum, setSearchAlbum] = useState([]);
    const [hasAlbum, setHasAlbum] = useState(false);
    
    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));
    
    let album_array = [];

    
    useEffect(() => {
        Axios.post("/ezenmusic/search/album/",{
            keyword: keyword,
            sortType: sortType
        })
        .then(({data}) => {
            if(data.length == 0){
                setHasAlbum(false);
            }
            else{
                setHasAlbum(true);
                if(page === "all"){
                    if(data.length < 5){
                        for(let i=0; i<data.length; i++){
                            album_array.push(data[i]);
                            album_array[i].likey = false;
                        }
                    }
                    else{
                        for(let i=0; i<5; i++){
                            album_array.push(data[i]);
                            album_array[i].likey = false;
                        }
                    }
                }
                else{
                    for(let i=0; i<data.length; i++){
                        album_array.push(data[i]);
                        album_array[i].likey = false;
                    }
                }
                // 좋아요 체크
                if(isSessionValid){
                    Axios.post("/ezenmusic/allpage/likeylist/", {
                        character_id: userid_cookies,
                        division: "likealbum"
                    })
                    .then(({data}) => {
                        if(data === -1){
        
                        }
                        else{                   
                            for(let i=0; i<data[0].music_list.length; i++){
                                for(let j=0; j<album_array.length; j++){
                                    if(data[0].music_list[i] === album_array[j].album_id){
                                        album_array[j].likey = true;
                                        break;
                                    }
                                }
                            }
                        }
                        // console.log(album_array);
                        setSearchAlbum(album_array);
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }
                else{
                    setSearchAlbum(album_array);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }, [sortType])

    return (
        <>
        {
            (page === "all" && hasAlbum) &&
            <Link to={"/search/album?keyword=" + keyword} ><p className="flex items-center font-bold text-[22px] mb-[10px]">앨범<RiArrowRightSLine className="mt-[3px]" /></p></Link>
        }

        <div className='mx-auto md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
            {
                page !== "all" &&
                <ButtonBox>
                    <Link to={"/search/album?keyword="+keyword+"&sortType=RECENCY"}>
                        <span className={ sortType === "RECENT" ? "text-[11px] text-blue" : "text-[11px]"}>최신순</span>
                    </Link>
                    <Link to={"/search/album?keyword="+keyword+"&sortType=POPULAR"}>
                        <span className={ sortType === "POPULARITY" ? "text-[11px] text-blue mx-[15px]" : "text-[11px] mx-[15px]"}>인기순</span>
                    </Link>
                    <Link to={"/search/album?keyword="+keyword+"&sortType=ALPHABET"}>
                        <span className={ sortType === "WORD" ? "text-[11px] text-blue" : "text-[11px]"}>가나다순</span>
                    </Link>
                </ButtonBox>
            }
            <AlbumCover>
                <ArtistAlbumCard artistAlbum={searchAlbum} setArtistAlbum={setSearchAlbum} handleRender={handleRender} />
            </AlbumCover>
        </div>

        </>
    )
}

export const StyledSearchAlbum = styled.div`
    
    @media (min-width: 1024px){ 
        width: 100%;
        margin-bottom: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }
    @media (max-width: 1024px){
        width: 100%;
        margin-bottom: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    img{
        border: 1px solid #efefef;
        border-radius: 6px;
        &:hover{
            filter: brightness(70%)
        }
    }
`

export default SearchAlbum