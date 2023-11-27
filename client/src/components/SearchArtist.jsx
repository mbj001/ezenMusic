import React, {useState, useEffect} from 'react'
import Axios from "axios";
import styled from 'styled-components';
import { RiPlayLine, RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';

function SearchArtist({keyward, page}) {

    const [artistInfo, setArtistInfo] = useState([]);
    const [hasArtist, setHasArtist] = useState(false);

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/search/artist/" + keyward)
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
                        <img src={"/image/artist/" + item.org_artist_img} alt="artist_img" className="w-[170px] h-[170px] rounded-[50%]"/>
                        <div className="pl-[20px]">
                            <p className="font-bold mb-[10px]">{item.artist}</p>
                            <p className="text-[11px] text-gray mb-[20px]">{item.artist_class} <span className="mx-[5px]">|</span> {item.artist_gender}</p>
                            <div className="flex items-center">
                                <RiPlayLine className="mt-[2px] mr-[5px] text-[18px]"/>
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