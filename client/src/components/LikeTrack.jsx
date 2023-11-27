import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Axios from 'axios';
import { Cookies } from 'react-cookie';
import MusicListCard from '../card/MusicListCard';
import { StyledBrowser, StyledTableth } from '../pages/Browse';
import { RiPlayLine } from "react-icons/ri";
import MusicListHeader from '../card/MusicListHeader';
import AllCheckedModal from '../modal/AllCheckedModal';
import LikeyBanner from '../card/LikeyBanner';

function LikeTrack({division}) {
    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    const [likeyList, setLikeyList] = useState([]);
    const [allcheckVal, setAllcheckVal] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    const [likeypageCheck, setLikeypageCheck] = useState(false);

    function handleLikeypage(){
        setLikeypageCheck(likeypageCheck => {return !likeypageCheck})
    }


    useEffect(() =>{
        Axios.post(`http://localhost:8080/ezenmusic/storage/likey`, {
            userid: userid_cookies,
            division: division
        })
        .then(({data}) =>{
            setLikeyList(data);
        })
        .catch((err) =>{
            {}
        })
    }, [likeypageCheck]);

    return (
        <>
        {
        likeyList.length == 0?
        <StyledMylistDiv className='w-[1440px] h-[768px] flex flex-wrap justify-around mx-auto'>
            <div className='text-center mt-[150px]'>
                <img src="/image/nolike.svg" alt="nolike" className=' ml-16'/>
                <p className='pt-2 font-bold'>좋아요 한 곡이 없어요</p>
                <p className='pt-1'>좋아요를 많이 할수록 Ezenmusic과 가까워 져요</p>
            </div>
        </StyledMylistDiv>
        :
        <StyledBrowser  className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
            <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn}/>
            <div className="mb-3">
                <div className="flex items-center cursor-pointer">
                    <RiPlayLine className="all-play-icon absolute top-[2px] left-[0px]"/>
                    <p className="ml-[25px] text-[14px] text-gray">전체듣기</p>
                </div>
            </div>
            <div>
                <hr className="text-gray"/>
                <table className="table table-hover">
                    <MusicListHeader lank={false} setAllcheckVal={setAllcheckVal} allcheckVal={allcheckVal} />
                    <tbody>
                        {
                            likeyList.map((item, index) => (
                                <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} 
                                img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} likey={"alltrue"} 
                                handleLikeypage={handleLikeypage} setLikeyBannerOn={setLikeyBannerOn} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
        allcheckVal ?
        <AllCheckedModal setAllcheckVal={setAllcheckVal}/>
        :
        ""
    }
        </StyledBrowser>
        }
        </>
    )
}

export const StyledMylistDiv = styled.div`
  img{
    width: 180px;
    height: 130px;
  }
  button{
    margin-top: 5px;
    border: 1px solid var(--main-text-gray-lighter);
    padding: 5px 10px;
    border-radius: 20px;
  }
`

export default LikeTrack