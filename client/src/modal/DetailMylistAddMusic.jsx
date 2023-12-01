import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import styled from 'styled-components';
import { RiCloseLine } from "react-icons/ri";
import MusicListTable from '../card/MusicListTable';
import { useCookies, Cookies } from 'react-cookie';


const DetailMylistAddMusic = ({setDetailMylistAddMusicOpen, clickToAddMusicModalClose, detailMylistAddMusicModalData}) => {
    
    const cookies = new Cookies();
    let userid_cookies = cookies.get("client.sid");
    console.log(detailMylistAddMusicModalData);

    useEffect(()=>{
        const userData = {
            playlist_id: detailMylistAddMusicModalData[0],
            userid: userid_cookies
        }

        Axios.post(`http://localhost:8080/playlist/detailmylist/addmusicmodal`, userData)
             .then(({data}) =>{
                console.log(data);
             })
             .catch((err) =>{
                {}
             })
    }, [])

    const [selectedBtn, setSelcetedBtn] = useState(false);
    
    const clickToSelectList = () =>{

    }

  return (
    <StyledDetailMylistAddMusic className=''>
        <div className='pt-[70px] md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] mx-auto'>
            <div className='flex justify-between'>
                <span className='flex text-[26px] font-bold'>곡 추가하기</span>
                <span className='flex text-[50px] cursor-pointer'><RiCloseLine onClick={clickToAddMusicModalClose}/></span>
            </div>
            <div className='pt-[10px] flex justify-start'>
                <button className='select-btn w-[80px] h-[30px]'>재생목록</button>
                <button className='select-btn ml-[10px] w-[100px] h-[30px]'>좋아요 한 곡</button>
                <button className='select-btn ml-[10px] w-[100px] h-[30px]'>최근 들은 곡</button>
            </div>
        </div>

        <div className='modal-contents'>

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
    .select-btn{
        color: var(--main-text-black);
        border-radius: 20px;
        font-size: 15px
    }
    .select-btn-active{
        background-color: var(--main-theme-color);
        color: var(--main-text-white);
        border-radius: 20px;
        font-size: 15px
    }
`

export default DetailMylistAddMusic