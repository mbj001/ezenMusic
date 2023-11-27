import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Axios from 'axios';
import { Cookies } from 'react-cookie';

const Mylist = (playlist_id) => {
    const [thumbnail, setThumbnail] = useState([]);
    const [listContent, setListContent] = useState([]);
    // const [addPlaylistWhenNull, setAddPlaylistWhenNull] = useState(false);
    const cookies = new Cookies();

    let userid_cookies = cookies.get("client.sid");

    useEffect(()=>{
        Axios.get(`http://localhost:8080/ezenmusic/storage/mylist/'${userid_cookies}'`)
        .then(({data}) => {
        setThumbnail(data);
        console.log(data);
        Axios.get(`http://localhost:8080/playlist/storage/mylist/'${userid_cookies}'`)
        .then(({data}) =>{
            setListContent(data);
            console.log(data);
        })
        .catch((err) => {
        {}
        })
    })
        .catch((err) => {
        {}
        })
    }, [])
    
    
    // 유저의 플레이 리스트가 없는 상태에서 새로운 리스트를 만들 때 기본 제목 값
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    let date = year + month  + day;

    
    const createPlaylistWhenNull = async(e) => {
      e.preventDefault();
      const userData = {
        userid: userid_cookies,
        date: date
      };
      await Axios.post(`http://localhost:8080/playlist/storage/mylist`, userData)
      .then((data) =>{
        console.log(data);
        window.location=`/detail/detailmylist/${data.data.length}`;
      });
    };

    return (
    <div className='mt-[40px]'>
    {
      
      // 플레이리스트가 하나도 존재하지 않을 때 나타나는 페이지
        !listContent[0] ?
        <StyledMylistDivFalse className='w-[1440px] h-[768px] flex flex-wrap justify-around mx-auto'>
          <div className='text-center mt-80'>
            <img src="/image/noplaylist.svg" alt="noplaylist" />
            <p className='mt-2 font-bold'>내 리스트가 없어요</p>
            <p className='mt-1'>1개만 만들어도 DJ배지 획득 가능!</p>
            <form onSubmit={createPlaylistWhenNull} method='post' className='mt-3'>
              <input type="hidden" name='userid' value={userid_cookies} />
              <input type="hidden" name="date" value={date} />
              <button type='submit' >
                + 새로운 리스트 만들기
              </button>
            </form>
          </div>
        </StyledMylistDivFalse>
          :
        <StyledMylistDivTrue className='flex flex-wrap align-items-center md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] mx-auto'>
          {
            listContent.map((item, index) => (
              <div className='col-4 my-[20px]'>
              {
                listContent[index].playlist == null?
                <div key={index} className="flex items-center w-[410px] h-[190px]">
                  <Link to = {"/detail/detailmylist/" + listContent[index].playlist_id}>
                    <img src="/image/noplaylist.svg" alt="cover_image" className="rounded-[20px] shadow-md hover:brightness-75" />
                  </Link>
                  <div className="ml-[20px]">
                    <p className="text-[18px]">{listContent[index].playlist_name}</p>
                    <p className="text-[16px] text-gray">총 0곡</p>
                  </div>
                </div>
                :
                <div key={index} className="flex items-center w-[410px] h-[190px]">
                  <Link to = {"/detail/detailmylist/" + listContent[index].playlist_id}>
                    <img src={"/image/album/" + thumbnail[index].thumbnail_image} alt="cover_image" className="rounded-[20px] hover:brightness-75" />
                  </Link>
                  <div className="ml-[20px]">
                    <p className="text-[18px]">{listContent[index].playlist_name}</p>
                    <p className="text-[16px] text-gray">총 {listContent[index].playlist.length}곡</p>
                  </div>
                </div>
              }
              </div>
            ))
          }
          <div className='flex col-4'>
            <form onSubmit={createPlaylistWhenNull} method='post' className='flex flex-row'>
            <div className='shadow-md'>
              <img src="/image/noplaylist.svg" alt="noplaylist" className='hover:brightness-75' />
            </div>
            

            <div className='flex ml-[20px]'>
              <input type="hidden" name='userid' value={userid_cookies} />
              <input type="hidden" name="date" value={date} />
              <button type='submit' style={{fontSize: '15px', color: "var(--main-theme-color)"}}>새로운 리스트 만들기</button>
            </div>
            </form>
          </div>
        </StyledMylistDivTrue>
        
    }
    </div>
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

