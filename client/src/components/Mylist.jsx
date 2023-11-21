import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import Axios from 'axios';
import { useCookies, Cookies } from 'react-cookie';

const Mylist = (playlist_id) => {
    const [thumbnail, setThumbnail] = useState([]);
    const [listContent, setListContent] = useState([]);
    const cookies = new Cookies();

    const userid_cookies = cookies.get("client.sid");

    useEffect(()=>{
        Axios.get(`http://localhost:8080/ezenmusic/storage/mylist/'${userid_cookies}'`)
        .then(({data}) => {
        setThumbnail(data);
        Axios.get(`http://localhost:8080/playlist/storage/mylist/'${userid_cookies}'`)
        .then(({data}) =>{
            setListContent(data);
        })
        .catch((err) => {
        {}
        })
    })
        .catch((err) => {
        {}
        })
    }, [])
  
  
    return (
    <>
    {
        listContent === null ?
        <StyledMylistDivFalse className='w-[1440px] h-[768px] flex flex-wrap justify-around mx-auto'>
          <div className='text-center mt-80'>
            <img src="/image/noplaylist.svg" alt="noplaylist" />
            <p className='mt-2 font-bold'>내 리스트가 없어요</p>
            <p className='mt-1'>1개만 만들어도 DJ배지 획득 가능!</p>
            <form action="" method='post' className='mt-3'>
              <input type="hidden" name='userid' value={userid_cookies} />
              <button type='submit'>
                + 새로운 리스트 만들기
              </button>
            </form>
          </div>
        </StyledMylistDivFalse>
        :
        <StyledMylistDivTrue className='flex flex-wrap justify-evenly mt-16'>
          {
            listContent.map((item, index) => (
              <div key={index} className="flex items-center">
                <Link to = {"/detail/detailmylist/" + listContent[index].num}>
                  <img src={"/image/album/" + thumbnail[0].org_cover_image} alt="org_cover_image" className="rounded-[20px] hover:brightness-75" />
                </Link>
                <div className="ml-[20px]">
                  <p className="text-[18px]">{listContent[index].playlist_name}</p>
                  <p className="text-[16px] text-gray-600">총 {listContent[index].playlist.length}곡</p>
                </div>
              </div>
              
            ))
          }
            <div className='flex'>
              <div className='shadow-md'>
                <img src="/image/noplaylist.svg" alt="noplaylist" className='hover:brightness-75' />
              </div>
              <div className='ml-[20px] mt-20'>
                <p style={{fontSize: '15px', color: "var(--main-theme-color)"}}>새로운 리스트 만들기</p>
              </div>
            </div>
        </StyledMylistDivTrue>
    }
    </>
    )
}

export default Mylist

const StyledMylistDivFalse = styled.div`
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

const StyledMylistDivTrue = styled.div`
  height: 100%;
  img{
    width: 175px;
    height: 175px;
  }
`




