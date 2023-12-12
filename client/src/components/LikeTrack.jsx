import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Axios from 'axios';
import { userid_cookies } from '../config/cookie';
import LoginRequest from '../card/LoginRequest';
import MusicListTable from '../card/MusicListTable';
import { AppContext } from '../App'

function LikeTrack({division, handleRender}) {
    // LSR
    // 로그아웃한 상태에서 쿠키에 character.sid 아무렇게나 만들어두면 userid_cookies에 이상한 값 들어가면서 
    // LoginRequest 페이지가 풀려버려서 app.js에서 뿌려주는 context 추가했어요
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [likeyList, setLikeyList] = useState([]);
    const [likeypageCheck, setLikeypageCheck] = useState(false);
    // 좋아요 곡 정보 없을 때 (초기값 = false)
    const [hasLikeyList, setHasLikeyList] = useState(false);

    let array = [];

    function handleLikeypage(){
        setLikeypageCheck(likeypageCheck => {return !likeypageCheck})
    }


    useEffect(() =>{
        if(userid_cookies !== undefined){
            Axios.post(`/ezenmusic/storage/likey`, {
                character_id: userid_cookies,
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
            isSessionValid && userid_cookies ? 
            <>
            {
                hasLikeyList === false?
                <StyledMylistDiv className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] h-[450px] flex flex-wrap justify-center items-center mx-auto'>
                    <div className='text-center'>
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