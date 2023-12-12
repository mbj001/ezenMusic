import React, {useState, useEffect} from 'react'
import Axios from "axios";
import styled from 'styled-components';
import { RiPlayLine, RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

function SearchArtist({keyward, page}) {

    const [artistInfo, setArtistInfo] = useState([]);
    const [hasArtist, setHasArtist] = useState(false);

    useEffect(() => {
        Axios.get("/ezenmusic/search/artist/" + keyward)
        .then(({data}) => {
            if(data.length == 0){
                setHasArtist(false);
            }
            else{
                setHasArtist(true);
                if(page === "all")
                {
                    setArtistInfo([data[0]]);
                }
                else{
                    setArtistInfo(data);
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
    <>

    <StyledSearchArtist>
        {
            page === "all" && hasArtist?
            <Link to={"/search/track?keyward=" + keyward} ><p className="flex items-center font-bold text-[22px] mb-[20px]">아티스트<RiArrowRightSLine className="mt-[3px]" /></p></Link>
            :
            ""
        }
        {
            hasArtist?
            artistInfo.map((item, index) => (
                <div key={index}>
                    <div className='flex items-center'>
                        <div className="w-[180px] h-[180px] rounded-[50%] hover:brightness-75 overflow-hidden" >
                            <img src={"/image/artist/"+item.org_artist_image} alt="img" className="w-full h-full object-cover"/>
                        </div>
                        <div className="pl-[20px]">
                            <p className="font-bold mb-[10px]">{item.artist_name}</p>
                            <p className="text-[12px] text-gray mb-[20px]">
                                {item.artist_class === "solo" && "솔로"} 
                                {item.artist_class === "duo" && "듀오"} 
                                {item.artist_class === "group" && "그룹"} 
                                <span className="mx-[5px]">|</span> 
                                {item.artist_gender === "male" && "남성"}
                                {item.artist_gender === "duo" && "듀오"}
                                {item.artist_gender === "female" && "여성"}
                            </p>
                            <div className="flex items-center">
                                <RiPlayLine className="mt-[2px] ml-[-4px] mr-[5px] text-[18px]"/>
                                <p className="text-[13px]">인기곡 듣기</p>
                            </div>   
                        </div>
                    </div>
                </div>
            ))
            :
            ""
        }
    </StyledSearchArtist>
    </>
    )
}

export const StyledSearchArtist = styled.div`
    margin-bottom: 60px;

`

export default SearchArtist