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
import LoginRequest from '../card/LoginRequest';
import MusicListTable from '../card/MusicListTable';

function LikeTrack({division, handleRender}) {
    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    const [likeyList, setLikeyList] = useState([]);
    const [likeypageCheck, setLikeypageCheck] = useState(false);

    // 좋아요 곡 정보 없을 때 (초기값 = false)
    const [hasLikeyList, setHasLikeyList] = useState(false);


    let array = [];

    function handleLikeypage(){
        setLikeypageCheck(likeypageCheck => {return !likeypageCheck})
    }


    useEffect(() =>{
        // console.log("**********************")
        // console.log(data);
        if(userid_cookies !== undefined){
            Axios.post(`http://localhost:8080/ezenmusic/storage/likey`, {
                userid: userid_cookies,
                division: division
            })
            .then(({data}) =>{
                if(data == -1){
                    setHasLikeyList(false);
                }
                else{
                    for(let i=0; i<data.length; i++){
                        array.push(data[i]);
                        array[i].likey = true;
                    }
                    setHasLikeyList(true);
                    setLikeyList(array);
                }
            })
            .catch((err) =>{
                {}
            })
        }
    }, [likeypageCheck]);

    return (
        <>
        {
            userid_cookies ? 
            <>
            {
                hasLikeyList === false?
                <StyledMylistDiv className='w-[1440px] h-[768px] flex flex-wrap justify-around mx-auto'>
                    <div className='text-center mt-[150px]'>
                        <img src="/image/nolike.svg" alt="nolike" className=' ml-16'/>
                        <p className='pt-2 font-bold'>좋아요 한 곡이 없어요</p>
                        <p className='pt-1'>좋아요를 많이 할수록 Ezenmusic과 가까워 져요</p>
                    </div>
                </StyledMylistDiv>
                :
                <MusicListTable page="liketrack" lank={false} music_list={likeyList} handleRender={handleRender} handleLikeypage={handleLikeypage}/>
            }
            </>
            :
            <LoginRequest />
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