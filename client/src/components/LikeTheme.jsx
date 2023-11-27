import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components'
import { Cookies } from "react-cookie";
import { Link } from 'react-router-dom';
import { RiPlayListAddFill, RiFolderAddLine, RiArrowRightSLine, RiPlayListAddLine } from "react-icons/ri";
import { StyledMylistDiv } from './LikeTrack';

function LikeTheme({division}) {

    const [likeAlbumList, setLikeAlbumList] = useState([]);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    useEffect(() => {
        Axios.post("http://localhost:8080/ezenmusic/storage/liketheme", {
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
    <StyledLikeTheme className="md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] m-auto flex flex-wrap mt-4 mb-5">
        {
            likeAlbumList.map((item, index) => (
                <div key={index} className="album-box col-4 flex items-center mb-[40px] px-[10px]">
                    <div className="col-5">
                        <Link to={"/detail/channel/"+item.num}><img src={"/image/themeplaylist/"+item.org_cover_image} alt="cover_image" className="w-[175px] h-[175px] rounded-[10px]" /></Link>
                    </div>
                    <div className="">
                        <Link to={"/detail/channel/"+item.num}><p className="font-bold mb-[5px] hover-text-blue">{item.themetitle}</p></Link>
                        {/* <Link to="#"><p className="text-[14px] mb-[10px] flex items-center">{item.artist}<RiArrowRightSLine className="text-[18px] mt-[3px]" /></p></Link> */}
                        <p className="text-[13px] mb-[2px]">총 {item.count}곡</p>
                        <p className="text-[12px] text-gray">{item.release_date_format}</p>
                        <div className="flex mt-[20px]">
                            <RiPlayListAddLine className="text-[20px] mr-[20px] text-gray cursor-pointer hover-text-blue" />
                            <RiFolderAddLine className="text-[22px] text-gray cursor-pointer hover-text-blue"/>
                        </div>
                    </div>
                </div>
            ))
        }
    </StyledLikeTheme>
    }
    </>
    )
}

export const StyledLikeTheme = styled.div`
    margin-bottom: 20px;
    // display: flex;
    // flex-wrap: wrap;

    img:hover{
        filter: brightness(70%)
    }

    album-box{
        // flex-wrap: wrap;
        // overflow: hidden;
    }
`

export default LikeTheme