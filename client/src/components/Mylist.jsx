import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Axios from 'axios';
import { Cookies } from 'react-cookie';
import LoginRequest from '../card/LoginRequest';
import MylistSelectModal from '../modal/MylistSelectModal';
import MylistDeleteConfirm from '../modal/MylistDeleteConfirm';
import { RiCheckFill } from "react-icons/ri";
import { PiMusicNotesLight } from "react-icons/pi";
import { AppContext } from '../App'
import PlayerBanner from '../card/PlayerBanner';

// 승렬 
import { MusicListCardAddPlaylistButton as AddPlaylistButton } from '../style/StyledIcons';
import { TinyPlayButton } from '../style/StyledIcons';

const Mylist = ({handleRender}) => {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    
    // LSR
    // 로그아웃한 상태에서 쿠키에 character.sid 아무렇게나 만들어두면 userid_cookies에 이상한 값 들어가면서 
    // LoginRequest 페이지가 풀려버려서 app.js에서 뿌려주는 context 추가했어요
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [listContent, setListContent] = useState([]);
    // Detete and Delete Confirm Variables
    const [editMode, setEditMode] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(false);
    const [renderPlaylistPage, setRenderPlaylistPage] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [selectedAll, setSelectedAll] = useState(false);
    const [dataLength, setDataLength] = useState('');
    // ~ Detete and Delete Confirm Variables

    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);


    useEffect(()=>{
        if(userid_cookies !== undefined){
            Axios.post(`/playlist/storage/mylist`, {
                character_id: userid_cookies
            })
            .then(({data}) =>{
                for(let i=0; i<data.length; i++){
                    data[i].delcheckVal = false;
                }

                setListContent(data);
            })
            .catch((err) => {
                console.log(err);
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
            character_id: userid_cookies,
            date: date
        };

        await Axios.post(`/playlist/storage/mylist/insert`, userData)
        .then(({data}) =>{
            window.location=`/detail/detailmylist/${data[0].playlist_id}`;
        });
    };


    // Delete and Delete Confirm Functions
    // 편집모드 클릭
    const clickToEditMode = async(e) =>{
        e.preventDefault();
        if(editMode === false){
            setEditMode(true);
        }else{
            setEditMode(false);
            setSelectedAll(false);
            // setSelectedIcon(false);
            setRenderPlaylistPage(!renderPlaylistPage);

            // MBJ
            // 완료 누르면 하단의 모달 꺼지게함
            setSelectedIcon(false);
            // 선택했던 항목들 false 로 리셋
            let array = [];
            for(let i=0; i<listContent.length; i++){
                array.push(listContent[i]);
                array[i].delcheckVal = false;
            }
            setListContent(array);

            }
        }

    // 체크박스 클릭
    const clickToSelectPlaylist = async(e, index) =>{
    e.preventDefault();

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
        let array = [];

        for(let i=0; i<listContent.length; i++){
            if(listContent[i].delcheckVal === true){
                array.push(listContent[i].playlist_id);
            }
        }
        setDataLength(array);
        setDeleteConfirm(() => {return !deleteConfirm});
    }


    const delPlaylist = () => {
        let array = [];

        for(let i=0; i<listContent.length; i++){
            if(listContent[i].delcheckVal === true){
                array.push(listContent[i].playlist_id);
            }
        }
        Axios.post("/ezenmusic/delPlaylist", {
            character_id: userid_cookies,
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

    function playerAdd(bool, data){

        // for(let i=0; i<albumAndMusicData.length; i++){
        //     array.push(albumAndMusicData[i].music_id);
        // }
        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            playlist_id: data.playlist_id,
            page: "mylist",
            change_now_play: bool
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return (
        
    <div className='mt-[40px]'>
        {
            isSessionValid && userid_cookies ?
            // userid_cookies ?
            <>
            {/* Delete and Delete Confirm */}
            { selectedIcon && <MylistSelectModal clickToSelectdelAllPlaylist={clickToSelectdelAllPlaylist} handleDeleteConfirm={handleDeleteConfirm} />  }
            { deleteConfirm && <MylistDeleteConfirm delPlaylist={delPlaylist} dataLength={dataLength} handleDeleteConfirm={handleDeleteConfirm}/> }
            {/* ~ Delete and Delete Confirm ~ */}
            { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"channel"} /> }


            {
            // 플레이리스트가 하나도 존재하지 않을 때
                !listContent[0] ?
                <StyledMylistDivFalse className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] h-[500px] flex flex-wrap justify-center items-center mx-auto'>
                    <div className='text-center mt-[50px]'>
                        <img src="/image/noplaylist.svg" alt="noplaylist" className='ml-[35px]' />
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
                // 플레이리스트가 하나라도 있을 때
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
                    <div className='grid-main'>
                    {
                        listContent.map((item, index) => (
                            <div key={index} className='my-[20px]'>
                                {/* <div key={index} className={ !editMode? "flex items-start w-[410px] h-[190px]" : (item.delcheckVal? "relative flex items-start w-[410px] h-[190px] brightness-75" : "relative flex items-start w-[410px] h-[190px]") }> */}
                                <div className={ !editMode? "flex items-start w-[410px] h-[190px]" : "relative flex items-start w-[410px] h-[190px]" }>
                                {
                                    // 편집모드 일때
                                    editMode && 
                                    <div className='checkbox z-[9] rounded-full overflow-hidden cursor-pointer'>
                                        <RiCheckFill className={ item.delcheckVal? 'selected w-full h-full text-[20px]' : 'checkbox-icon w-full h-full text-[20px]' } onClick={(e) => clickToSelectPlaylist(e, index)}/>
                                    </div>
                                }
                        
                                {
                                    // 썸네일 이미지가 null일때
                                    item.thumbnail_image == null?
                                    <Link to = {"/detail/detailmylist/" + listContent[index].playlist_id}>
                                        <div className={ item.delcheckVal? 'null-image flex w-[175px] h-[175px] brightness-75' : 'null-image flex w-[175px] h-[175px] rounded-[6px]'}>
                                            <span className='null-image-icon flex justify-around items-center w-full h-full'>
                                                <PiMusicNotesLight className='text-[60px]' />
                                            </span>
                                        </div>    
                                    </Link>                       
                                    :
                                    <div className='null-image relative'>
                                        <Link to = {"/detail/detailmylist/" + listContent[index].playlist_id}>
                                            <img src={"/image/album/" + item.thumbnail_image} alt="cover_image" className={ item.delcheckVal? "rounded-[6px] hover:brightness-75 brightness-75" : "rounded-[6px] hover:brightness-75"} />
                                        </Link>      
                                        <TinyPlayButton onClick={(e) => playerAdd(true, item)}></TinyPlayButton>
                                    </div>
                                }
                        
                                    <div className="flex flex-col justify-between ml-[20px]">
                                        <span className="text-[15px] mt-[15px] mb-[15px] w-[200px] font-bold text-ellipsis overflow-hidden">{listContent[index].playlist_name}</span>
                                        <span className="text-[14px]" style={{color: "var(--main-text-gray-darker)"}}>
                                            {listContent[index].music_list == null? "총 0곡" : "총"+listContent[index].music_list.length+"곡"}
                                        </span>
                                        <span className="text-[13px]" style={{color: "var(--main-text-gray)"}}>{listContent[index].create_date.replace(/-/g, '.').substr(0,10)}</span>
                                        <AddPlaylistButton onClick={(e) => playerAdd(false, item)} className='ml-[-9px] mt-[30px]'></AddPlaylistButton>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                {
                    // 편집모드 아닐때
                    !editMode &&
                    <div className='flex my-[20px] mt-[3px]'>
                        <form onSubmit={createPlaylistWhenNull} method='post' className='flex flex-row'>
                            <button type='submit'>
                                <div className='new-list w-[175px] h-[175px] flex justify-center items-center'>
                                    <img src="/image/icons/add.svg" alt="addPlaylist" className='w-[50px] h-[50px]'/>
                                </div>
                            </button>
                        
                            <div className='flex ml-[-10px]'>
                                <input type="hidden" name='userid' value={userid_cookies} />
                                <input type="hidden" name="date" value={date} />
                                <button type='submit' className='text-[15px] w-[200px] justify-between items-center ' style={{color: "var(--main-theme-color)"}}>새로운 리스트 만들기</button>
                            </div>
                        </form>
                    </div>
                }
                </div>
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

// 재생목록 하나도 없을 때
const StyledMylistDivFalse = styled.div`
    img{
        width: 160px;
        height: 130px;
    }
    button{
        margin-top: 5px;
        border: 1px solid var(--main-text-gray-lighter);
        padding: 5px 10px;
        border-radius: 20px;
    }
`
// 재생목록이 하나라도 있을 때
const StyledMylistDivTrue = styled.div`
    .grid-main{
        @media (min-width: 1024px){ 
            width: 100%;
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
            text-overflow: ellipsis;
        }
        @media (max-width: 1024px){
            width: 100%;
            margin-bottom: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
    }
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
        // 12.12 추가
        border: 1px solid #efefef;
        border-radius: 6px;
        background-color: var(--mylist-null-image-cover);
    }
    .null-image::before{
        width: 95%;
        height: 95%;
        position: absolute;
        z-index: -2;
        top: -4px;
        right: 2.5%;
        display: inline-block;
        content: "";
        background-color: #e3e3e3;
        opacity: 1;
        border-radius: 6px;
    }
    .null-image::after{
        position: absolute;
        display: block;
        top: -8px;
        content: "";
        z-index: -3;
        left: 5%;
        width: 90%;
        height: 90%;
        background-color: var(--mylist-null-image-after);
        opacity: 1;
        border-radius: 10px;
    }
    .null-image span{
        // border: 1px solid rgba(0, 0, 0, 0.1);
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
    .libutton{
        z-index: 15;
        bottom: 10px;
    }


    .checkbox{
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 99;
        width: 35px;
        height: 35px;
        filter: brightness(1);
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
        border-radius: 6px;
        background-color: #f6f6f6;
        img{
            width: 50px;
            height: 50px;
        }
    }
    .new-list:hover{
        filter: brightness(0.9);
    }

`