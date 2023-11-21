import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Axios from 'axios';

const Likey = () => {
    const userid = "guest";
    const [likeyList, setLikeyList] = useState([]);

    useEffect(() =>{
        Axios.get(`http://localhost:8080/likey/storage/likey/'${userid}'`)
        .then(({data}) =>{
            setLikeyList(data);
        })
        .catch((err) =>{
            {}
        })
    }, [])

    let isliked;
    likeyList.map((item, index) =>{
        return(
            isliked = item.likeylist
        )
    })



    return (
        <>
        {
        isliked === null?
        <StyledMylistDiv className='w-[1440px] h-[768px] flex flex-wrap justify-around mx-auto'>
            <div className='text-center mt-80'>
            <img src="/image/nolike.svg" alt="nolike" className=' ml-16'/>
            <p className='pt-2 font-bold'>좋아요 한 곡이 없어요</p>
            <p className='pt-1'>좋아요를 많이 할수록 Ezenmusic과 가까워 져요</p>
            </div>
        </StyledMylistDiv>
        :
        <StyledMylistDiv className='w-[1440px] h-[768px] flex flex-wrap justify-around mx-auto'>
            <div className='text-center mt-80'>
            <img src="/image/nolike.svg" alt="nolike" className=' ml-16'/>
            <p className='pt-2 font-bold'>좋아요 한 곡이 없어요</p>
            <p className='pt-1'>좋아요를 많이 할수록 Ezenmusic과 가까워 져요</p>
            </div>
        </StyledMylistDiv>

        }
        </>
    )
}

export default Likey


const StyledMylistDiv = styled.div`
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