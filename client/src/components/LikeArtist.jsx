import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components'
import { Cookies } from "react-cookie";
import { Link } from 'react-router-dom';
import { RiPlayListAddFill, RiFolderAddLine, RiArrowRightSLine, RiPlayListAddLine } from "react-icons/ri";
import { StyledMylistDiv } from './LikeTrack';

function LikeArtist({division}) {
    const [likeAlbumList, setLikeAlbumList] = useState([]);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    useEffect(() => {
        Axios.post("http://localhost:8080/ezenmusic/storage/likeartist", {
            userid: userid_cookies,
            division: division
        })
        .then(({data}) => {
            setLikeAlbumList(data);
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
        <>
        {
        likeAlbumList.length == 0?
        <StyledMylistDiv className='w-[1440px] h-[768px] flex flex-wrap justify-around mx-auto'>
            <div className='text-center mt-[150px]'>
                <img src="/image/nolike.svg" alt="nolike" className=' ml-16'/>
                <p className='pt-2 font-bold'>좋아요 한 곡이 없어요</p>
                <p className='pt-1'>좋아요를 많이 할수록 Ezenmusic과 가까워 져요</p>
            </div>
        </StyledMylistDiv>
        :
        <StyledLikeAlbum>
            {
                likeAlbumList.map((item, index) => (
                    <div key={index} className="album-box col-4 flex items-center mb-[40px]">
                        <Link to={"/detail/artist/"+item.artist_num+"/artisttrack"}><img src={"/image/artist/"+item.org_artist_img} alt="cover_image" className="w-[175px] h-[175px] rounded-[50%]" /></Link>
                        <div className="ml-[20px]">
                            <Link to={"/detail/artist/"+item.artist_num+"/artisttrack"}><p className="font-bold mb-[7px] hover-text-blue">{item.artist}</p></Link>
                            <p className="text-[11px] mb-[10px] flex items-center text-gray">{item.artist_class} <span className="px-[5px] text-[7px]">|</span> {item.artist_gender} <span className="px-[5px] text-[7px]">|</span> {item.genre}</p>
                            <p className="text-[13px] mb-[2px]">{item.album_size}</p>
                            <p className="text-[12px] text-gray">{item.release_date_format}</p>
                        </div>
                    </div>
                ))
            }
        </StyledLikeAlbum>
        }
        </>
    )
}

export const StyledLikeAlbum = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;

    img:hover{
        filter: brightness(70%)
    }
`

export default LikeArtist