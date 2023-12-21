import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import styled from 'styled-components';
import { RiCloseLine } from "react-icons/ri";
import MusicListTable from '../card/MusicListTable';
import { Cookies } from 'react-cookie';

// 승렬
import { CloseButton } from '../style/StyledIcons';

const DetailMylistAddMusic = ({setDetailMylistAddMusicOpen, clickToAddMusicModalClose, detailMylistAddMusicModalData, handleRender}) => {
    
    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");

    const [musicListData, setMusicListData] = useState([]);
    const [likeyListData, setLikeyListData] = useState([]);
    const [selectedBtn, setSelectedBtn] = useState(false);


    useEffect(()=>{
        const userData = {
            playlist_id: detailMylistAddMusicModalData[0],
            playlist_name: detailMylistAddMusicModalData[1],
            character_id: userid_cookies
        }

        Axios.post(`/playlist/detailmylist/addmusicmodal`, userData)
             .then(({data}) =>{
                setMusicListData(data);
             })
             .catch((err) =>{
                {}
             })
    }, [])

    
    const clickToSelectLikeyList = async() =>{
        const userData = {
            playlist_id: detailMylistAddMusicModalData[0],
            playlist_name: detailMylistAddMusicModalData[1],
            character_id: userid_cookies
        }

        await Axios.post(`/playlist/detailmylist/addmusicmodal/selectlikeylist`, userData)
                   .then(({data}) =>{
                        setLikeyListData(data);
                   })

        setSelectedBtn(true);
    }
    const clickToSelectPlaylist = () =>{
        setSelectedBtn(false);
    } 


    return (
    <StyledDetailMylistAddMusic className=''>
        <div className='pt-[70px] md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] mx-auto'>
            <div className='flex justify-between'>
                <span className='flex text-[26px] font-bold'>곡 추가하기</span>
                <span className='flex text-[50px] cursor-pointer'><CloseButton onClick={clickToAddMusicModalClose}></CloseButton></span>
            </div>
            <div className='pt-[20px] flex justify-start'>
                <button className={ selectedBtn === false? 'select-btn-active ml-[10px] w-[100px] h-[30px]' : 'select-btn ml-[10px] w-[100px] h-[30px]'} onClick={() => clickToSelectPlaylist()}>재생목록</button>
                <button className={ selectedBtn === true? 'select-btn-active ml-[10px] w-[120px] h-[30px]' : 'select-btn ml-[10px] w-[120px] h-[30px]'} onClick={() => clickToSelectLikeyList()}>좋아요 한 곡</button>
            </div>
        </div>

        <div className='modal-contents overflow-scroll h-[70%] mt-[20px]'>
            {
                
                selectedBtn === false?
                (
                    // 플레이어리스트가 비어있을 때
                    musicListData === 1?
                    <div className='flex flex-col items-center text-center mt-80'>
                        <img src="/image/noplaylist.svg" alt="noplaylist" className='w-[180px] h-[130px]' />
                        <p className='mt-2 font-bold'>앗!</p>
                        <p className='mt-1'>재생목록이 비어있어요...</p>
                    </div>
                    :
                    <MusicListTable page="detailmylistaddmusic" lank={false} music_list={musicListData} setDetailMylistAddMusicOpen={setDetailMylistAddMusicOpen} handleRender={handleRender} detailMylistAddMusicModalData={detailMylistAddMusicModalData}/>
                )
                :
                (
                    // 좋아요 목록(track)이 비어있을 때
                    likeyListData === 1?
                    <div className='flex flex-col items-center text-center mt-80'>
                        <img src="/image/nolike.svg" alt="nolike" className='w-[180px] h-[130px]' />
                        <p className='mt-2 font-bold'>앗!</p>
                        <p className='mt-1'>좋아요 한 곡이 비어있어요...</p>
                    </div>
                    :
                    <MusicListTable page="detailmylistaddmusic" lank={false} music_list={likeyListData} setDetailMylistAddMusicOpen={setDetailMylistAddMusicOpen} handleRender={handleRender} detailMylistAddMusicModalData={detailMylistAddMusicModalData}/>
                )
            }
        </div>
    </StyledDetailMylistAddMusic>
    )
}

const StyledDetailMylistAddMusic = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    margin: 0 auto;
    background-color: var(--main-background-white);
    z-index: 99999;

    -webkit-scrollbar, 
    div::-webkit-scrollbar{
        display: none;
    }

    .select-btn{
        color: var(--main-text-black);
        border-radius: 20px;
        font-size: 15px;
        &:hover{
            color: var(--main-theme-color);
        }
    }
    .select-btn-active{
        background-color: var(--main-theme-color);
        color: var(--main-text-white);
        border-radius: 16px;
        font-size: 15px;
        height: 32px;
        padding: 0 10px;
        
    }

`

export default DetailMylistAddMusic