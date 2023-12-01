import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Axios from 'axios';
import { Cookies } from 'react-cookie';
import LoginRequest from '../card/LoginRequest';
import LikeyBanner from '../card/LikeyBanner';
import MylistSelectModal from '../modal/MylistSelectModal';
import MylistDeleteConfirm from '../modal/MylistDeleteConfirm';
import { RiPlayListAddFill, RiCheckFill, RiAddLine } from "react-icons/ri";
import { PiMusicNotesLight } from "react-icons/pi";


const Mylist = () => {
    const [thumbnail, setThumbnail] = useState([]);
    const [listContent, setListContent] = useState([]);
    // const [addPlaylistWhenNull, setAddPlaylistWhenNull] = useState(false);

    // Detete and Delete Confirm Variables
    const [editMode, setEditMode] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState(false);
    const [renderPlaylistPage, setRenderPlaylistPage] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [selectedAll, setSelectedAll] = useState(false);
    // ~ Detete and Delete Confirm Variables

    const cookies = new Cookies();
    let userid_cookies = cookies.get("client.sid");

    
    console.log(userid_cookies);

    useEffect(()=>{
        if(userid_cookies !== undefined){
            Axios.get(`http://localhost:8080/playlist/storage/mylist/'${userid_cookies}'`)
            .then(({data}) =>{
                for(let i=0; i<data.length; i++){
                data[i].delcheckVal = false;
                }
                    // console.log(data);
                setListContent(data);
                // console.log(data);
            })
            .catch((err) => {
            {}
            })
        }
    }, [renderPlaylistPage])
    
    
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
      .then(({data}) =>{
        console.log(data);
        window.location=`/detail/detailmylist/${data[0].playlist_id}`;
      });
    };


    // Delete and Delete Confirm Functions
    // 편집모드 클릭
    const clickToEditMode = async(e) =>{
        e.preventDefault();
        if(editMode == false){
            setEditMode(true);
        }else{
            setEditMode(false);
        }
        }

        // 체크박스 클릭
        const clickToSelectPlaylist = async(e, index) =>{
        e.preventDefault();
        console.log("index : " + index);
        let delcheckArray = [];

        for(let i=0; i<listContent.length; i++){
            delcheckArray.push(listContent[i]);
        }

        delcheckArray[index].delcheckVal = !delcheckArray[index].delcheckVal;
        setListContent(delcheckArray);

        for(let i=0; i<delcheckArray.length; i++){
            if(delcheckArray[i].delcheckVal === true){
            setSelectedIcon(true);
            break;
            }
            if(i === delcheckArray.length - 1){
            setSelectedIcon(false);
            }
        }
    }


    const clickToSelectdelAllPlaylist = () => {
    setSelectedIcon(false);

    let delcheckArray = [];

    for(let i=0; i<listContent.length; i++){
        delcheckArray.push(listContent[i]);
        if(delcheckArray[i].delcheckVal === true){
        delcheckArray[i].delcheckVal = false;
        }
    }

    setListContent(delcheckArray);
    }


    const handleDeleteConfirm = () => {
    console.log("들어옴");
    setDeleteConfirm(() => {return !deleteConfirm});
    }


    const delPlaylist = () => {
    let array = [];
    for(let i=0; i<listContent.length; i++){
        if(listContent[i].delcheckVal === true){
        array.push(listContent[i].playlist_id);
        }
    }

    Axios.post("http://localhost:8080/ezenmusic/delPlaylist", {
        userid: userid_cookies,
        playlist_id_array: array 
    })
    .then(({data}) => {
        setSelectedIcon(false);
        handleDeleteConfirm();
        setRenderPlaylistPage(!renderPlaylistPage);
    })
    .catch((err) => {
        console.log(err);
    })
    }

    const handleDeleteAll = () => {
    setSelectedIcon(true);

    let delcheckArray = [];

    for(let i=0; i<listContent.length; i++){
        delcheckArray.push(listContent[i]);
        delcheckArray[i].delcheckVal = true;
    }
    setSelectedAll(true);
    setListContent(delcheckArray);
    }
    
    const handleDeleteNone = () => {
    setSelectedAll(false);
    let delcheckArray = [];
    
    for(let i=0; i<listContent.length; i++){
        delcheckArray.push(listContent[i]);
        delcheckArray[i].delcheckVal = false;
    }
    
    setSelectedIcon(false);
    setListContent(delcheckArray);
    }
    // ~ Delete and Delete Confirm Functions

    return (
    <div className='mt-[40px]'>
        {
            userid_cookies ?
            <>
            {/* Delete and Delete Confirm */}
            { 
                selectedIcon? 
                <MylistSelectModal clickToSelectdelAllPlaylist={clickToSelectdelAllPlaylist}
                handleDeleteConfirm={handleDeleteConfirm} /> 
                : 
                "" 
            }
            {
                deleteConfirm?
                <MylistDeleteConfirm delPlaylist={delPlaylist} handleDeleteConfirm={handleDeleteConfirm}/>
                :
                ""
            }
            {/* ~ Delete and Delete Confirm ~ */}

            {
            
            // 플레이리스트가 하나도 존재하지 않을 때
                !listContent[0] ?
                <StyledMylistDivFalse className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] flex flex-wrap justify-center items-center mx-auto'>
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
                    // 편집모드 아닐때
                    !editMode?
                    <div className='col-12 flex justify-end'>
                        <span className='edit cursor-pointer text-[13px]' onClick={clickToEditMode}>편집</span>
                    </div>
                    :
                    <div className='col-12 flex justify-between'>
                        <span className='select-all flex cursor-pointer text-[13px]' onClick={ selectedAll? handleDeleteNone  : handleDeleteAll}><RiCheckFill className='mt-[3px] mr-[3px]'/> 전체선택</span>
                        <span className='edit cursor-pointer text-[13px]' style={{color: "var(--main-theme-color)"}} onClick={clickToEditMode}>완료</span>
                    </div>

                    }
                    {
                        listContent.map((item, index) => (
                            <div className='col-4 my-[20px]'>
                                    <div key={index} className={ !editMode? "flex items-start w-[410px] h-[190px]" : (item.delcheckVal? "relative flex items-start w-[410px] h-[190px] brightness-75" : "relative flex items-start w-[410px] h-[190px]") }>
                                {
                                    // 편집모드 일때
                                    editMode && 
                                    <div className='checkbox z-[9] rounded-full overflow-hidden cursor-pointer brightness-100' style={{filter: "brightness(1)"}}>
                                        <RiCheckFill className={ item.delcheckVal? 'selected w-full h-full text-[20px]' : 'checkbox-icon w-full h-full text-[20px]' } onClick={(e) => clickToSelectPlaylist(e, index)}/>
                                    </div>
                                }
                        <Link to = {"/detail/detailmylist/" + listContent[index].playlist_id}>
                            {
                            // 썸네일 이미지가 null일때
                            item.thumbnail_image == null?
                            <div className={ item.delcheckVal? 'null-image flex w-[175px] h-[175px] rounded-[10px] brightness-75' : 'null-image flex w-[175px] h-[175px] rounded-[10px]'}>
                                <span className='null-image-icon flex justify-around items-center w-full h-full'>
                                <PiMusicNotesLight className='text-[60px]' />
                                </span>
                            </div>                           
                            :
                            <img src={"/image/album/" + item.thumbnail_image} alt="cover_image" className="rounded-[20px] hover:brightness-75" />
                            }
                        </Link>
                        <div className="flex flex-col ml-[20px]">
                            <span className="text-[15px] mt-[35px] mb-[10px] font-bold">{listContent[index].playlist_name}</span>
                            <span className="text-[14px]" style={{color: "var(--main-text-gray-darker)"}}>
                                {listContent[index].playlist == null? "총 0곡" : "총"+listContent[index].playlist.length+"곡"}
                            </span>
                            <span className="text-[13px]" style={{color: "var(--main-text-gray)"}}>{listContent[index].create_date.replace(/-/g, '.').substr(0,10)}</span>
                            <span className='mt-[25px]'><RiPlayListAddFill /></span>
                        </div>
                        </div>
                    </div>
                    ))
                }
                {
                    // 편집모드 아닐때
                    !editMode?
                    <div className='flex col-4'>
                    <form onSubmit={createPlaylistWhenNull} method='post' className='flex flex-row'>
                    <div className='new-list w-[175px] h-[175px] flex justify-center items-center shadow-md hover:brightness-75'>
                        <span><RiAddLine className='text-[50px]' /></span>
                    </div>
                    
        
                    <div className='flex ml-[20px]'>
                        <input type="hidden" name='userid' value={userid_cookies} />
                        <input type="hidden" name="date" value={date} />
                        <button type='submit' className='text-[15px]' style={{color: "var(--main-theme-color)"}}>새로운 리스트 만들기</button>
                    </div>
                    </form>
                    </div>
                    :
                    ""
                }
                </StyledMylistDivTrue>
                
            }
            </>
            :
            <LoginRequest />
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
.edit:hover{
  color: var(--main-theme-color);
}
.select-all:hover{
  color: var(--main-theme-color);
}
.null-image{
  position: relative;
  background-color: var(--mylist-null-image-after);
}
.null-image:before{
  position: absolute;
  display: block;
  top: -5px;
  content: "";
  z-index: 2;
  left: 4px;
  width: 95%;
  height: 103%;
  background-color: var(--mylist-null-image-before);
  border-radius: 10px;
}
.null-image:after{
  position: absolute;
  display: block;
  top: -10px;
  content: "";
  z-index: 0;
  left: 8px;
  width: 90%;
  height: 105%;
  background-color: var(--mylist-null-image-after);
  border-radius: 10px;
}
.null-image span{
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.null-image span:hover{
  z-index: 4;
  background-color: rgba(0,0,0,0.2);
}
.null-image-icon{
  color: var(--main-text-gray-lighter);
  z-index: 5;
}


  .checkbox{
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 99;
    width: 35px;
    height: 35px;
    filter: brightness(1);
    // border-radius: 20px;
    .checkbox-icon{
      background-color: var(--main-text-gray-lighter);
      color: var(--main-text-white);
      font-size: 25px;
      filter: brightness(1);
    }
    
    .selected{
      background-color: var(--main-theme-color);
      color: var(--main-text-white);
      font-size: 25px;
      filter: brightness(1);
    }
  }
  .new-list{
    background-color: var(--mylist-null-image-before);
  }

`