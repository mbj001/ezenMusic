import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components';
import { RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

function SearchAlbum({keyward, page}) {

    const [searchAlbum, setSearchAlbum] = useState([]);
    const [hasAlbum, setHasAlbum] = useState(false);
    let array = [];

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/search/album/" + keyward)
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
            <Link to={"/search/album?keyward=" + keyward} ><p className="flex items-center font-bold text-[22px] mb-[20px]">앨범<RiArrowRightSLine className="mt-[3px]" /></p></Link>
            :
            ""
        }
        <StyledSearchAlbum>
        {
            searchAlbum.map((item, index) => (
                <div key={index} className="album-box col-4 flex items-center mb-[40px]">
                    
                    <Link to={"/detail/album/"+item.album_id+"/albumtrack"}><img src={"/image/album/"+item.org_cover_image} alt="cover_image" className="w-[175px] h-[175px] rounded-[10px]" /></Link>
                    <div className="ml-[20px]">
                        <Link to={"/detail/album/"+item.album_id+"/albumtrack"}><p className="font-bold mb-[5px] hover-text-blue">{item.album_title}</p></Link>
                        <Link to="#"><p className="text-[14px] mb-[20px] flex items-center">{item.artist}<RiArrowRightSLine className="text-[18px] mt-[3px]" /></p></Link>
                        <p className="text-[13px]">{item.album_size}</p>
                        <p className="text-[13px] text-gray">{item.release_date_format}</p>
                    </div>
                </div>
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

    img:hover{
        filter: brightness(70%)
    }
`

export default SearchAlbum