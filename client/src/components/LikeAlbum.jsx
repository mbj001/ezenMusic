import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components'
import { Cookies } from "react-cookie";
import { Link } from 'react-router-dom';
import { RiPlayListAddFill, RiFolderAddLine, RiArrowRightSLine, RiPlayListAddLine, RiCheckFill } from "react-icons/ri";
import { StyledMylistDiv } from './LikeTrack';
import LoginRequest from '../card/LoginRequest';
import MylistSelectModal from '../modal/MylistSelectModal';
import MylistDeleteConfirm from '../modal/MylistDeleteConfirm';

function LikeAlbum({division}) {

    const [likeAlbumList, setLikeAlbumList] = useState([]);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    const [hasLikeyList, setHasLikeyList] = useState(false);

    // Detete and Delete Confirm Variables
    const [editMode, setEditMode] = useState(false);

    const [selectedIcon, setSelectedIcon] = useState(false);
    const [renderPlaylistPage, setRenderPlaylistPage] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [selectedAll, setSelectedAll] = useState(false);
    // ~ Detete and Delete Confirm Variables


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

        for(let i=0; i<likeAlbumList.length; i++){
            delcheckArray.push(likeAlbumList[i]);
        }

        delcheckArray[index].delcheckVal = !delcheckArray[index].delcheckVal;
        setLikeAlbumList(delcheckArray);

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

        for(let i=0; i<likeAlbumList.length; i++){
            delcheckArray.push(likeAlbumList[i]);
            if(delcheckArray[i].delcheckVal === true){
            delcheckArray[i].delcheckVal = false;
            }
        }

        setLikeAlbumList(delcheckArray);
    }


    const handleDeleteConfirm = () => {
        console.log("들어옴");
        setDeleteConfirm(() => {return !deleteConfirm});
    }


    const delPlaylist = () => {
        let array = [];

        for(let i=0; i<likeAlbumList.length; i++){
            if(likeAlbumList[i].delcheckVal === true){
                array.push(likeAlbumList[i].album_id);
            }
        }
        console.log(array);
        Axios.post("http://localhost:8080/ezenmusic/likey/delLikeAlbum", {
            userid: userid_cookies,
            likey_id_array: array,
            division: "likealbum" 
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

        for(let i=0; i<likeAlbumList.length; i++){
            delcheckArray.push(likeAlbumList[i]);
            delcheckArray[i].delcheckVal = true;
        }
        setSelectedAll(true);
        setLikeAlbumList(delcheckArray);
    }
    
    const handleDeleteNone = () => {
        setSelectedAll(false);
        let delcheckArray = [];
        
        for(let i=0; i<likeAlbumList.length; i++){
            delcheckArray.push(likeAlbumList[i]);
            delcheckArray[i].delcheckVal = false;
        }
    
        setSelectedIcon(false);
        setLikeAlbumList(delcheckArray);
    }
    // ~ Delete and Delete Confirm Functions


    useEffect(() => {
        if(userid_cookies !== undefined){
            Axios.post("http://localhost:8080/ezenmusic/storage/likealbum", {
                userid: userid_cookies,
                division: division
            })
            .then(({data}) => {
                if(data === -1){
                    setHasLikeyList(false);
                }
                else{
                    setLikeAlbumList(data);
                    console.log(data);
                    setHasLikeyList(true);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }, [renderPlaylistPage])

    return (
        <>
        {
            userid_cookies ?
            <>
            {
                !hasLikeyList ?
                <StyledMylistDiv className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] flex flex-wrap justify-center items-center mx-auto'>
                    <div className='text-center mt-[150px]'>
                        <img src="/image/nolike.svg" alt="nolike" className=' ml-16'/>
                        <p className='pt-2 font-bold'>좋아요 한 앨범이 없어요</p>
                        <p className='pt-1'>좋아요를 많이 할수록 Ezenmusic과 가까워 져요</p>
                    </div>
                </StyledMylistDiv>
            :
            <StyledLikeAlbum>
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
                {
                    // 편집모드 아닐때
                    !editMode?
                    <div className='col-12 flex justify-end mb-[30px]'>
                        <span className='edit cursor-pointer text-[13px]' onClick={clickToEditMode}>편집</span>
                    </div>
                    :
                    <div className='col-12 flex justify-between mb-[30px]'>
                        <span className='select-all flex cursor-pointer text-[13px]' onClick={ selectedAll? handleDeleteNone  : handleDeleteAll}><RiCheckFill className='mt-[3px] mr-[3px]'/> 전체선택</span>
                        <span className='edit cursor-pointer text-[13px]' style={{color: "var(--main-theme-color)"}} onClick={clickToEditMode}>완료</span>
                    </div>

                }
                {

                
                    likeAlbumList.map((item, index) => (
                        <div key={index} className="relative album-box col-4 flex items-center mb-[40px]">
                            {
                                editMode &&
                                <div className='checkbox rounded-full overflow-hidden cursor-pointer'>
                                    <RiCheckFill className={ item.delcheckVal? 'selected w-full h-full text-[20px]' : 'checkbox-icon w-full h-full text-[20px]' } onClick={(e) => clickToSelectPlaylist(e, index)} />
                                </div>
                            }
                            <Link to={"/detail/album/"+item.album_id+"/albumtrack"}><img src={"/image/album/"+item.org_cover_image} alt="cover_image" className={ item.delcheckVal? "w-[175px] h-[175px] rounded-[10px] brightness-75" : "w-[175px] h-[175px] rounded-[10px]"} /></Link>
                            <div className="ml-[20px]">
                                <Link to={"/detail/album/"+item.album_id+"/albumtrack"}><p className="font-bold mb-[5px] hover-text-blue">{item.album_title}</p></Link>
                                <Link to={"/detail/artist/"+item.artist_num+"/artisttrack"}><p className="text-[14px] mb-[10px] flex items-center">{item.artist}<RiArrowRightSLine className="text-[18px] mt-[3px]" /></p></Link>
                                <p className="text-[13px] mb-[2px]">{item.album_size}</p>
                                <p className="text-[12px] text-gray">{item.release_date_format}</p>
                                <div className="flex mt-[20px]">
                                    <RiPlayListAddLine className="text-[20px] mr-[20px] text-gray cursor-pointer hover-text-blue" />
                                    <RiFolderAddLine className="text-[22px] text-gray cursor-pointer hover-text-blue"/>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </StyledLikeAlbum>
            }
            </>
            :
            <LoginRequest />
        }
    
    </>
    )
}

export const StyledLikeAlbum = styled.div`
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;

    img:hover{
        filter: brightness(70%)
    }

    .edit:hover{
        color: var(--main-theme-color);
      }
      .select-all:hover{
        color: var(--main-theme-color);
      }
      .checkbox{
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 99;
        width: 35px;
        height: 35px;
        // border-radius: 20px;
        .checkbox-icon{
          background-color: var(--main-text-gray-lighter);
          color: var(--main-text-white);
          font-size: 25px;
        }
        
        .selected{
          background-color: var(--main-theme-color);
          color: var(--main-text-white);
          font-size: 25px;
        }
      }
`
export default LikeAlbum