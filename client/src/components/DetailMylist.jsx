import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import styled from 'styled-components';
import { RiPlayListAddFill, RiEdit2Fill } from "react-icons/ri";
import { PiMusicNotesLight } from "react-icons/pi";
import { userid_cookies } from '../config/cookie';
import PlaylistAdd from '../modal/PlaylistAdd';
import AllCheckedModal from '../modal/AllCheckedModal';
import MusicListTable from '../card/MusicListTable';
import DuplicatedPlaylistName from '../modal/DuplicatedPlaylistName';
import DetailMylistAddMusic from '../modal/DetailMylistAddMusic';
import icons from '../assets/sp_button.6d54b524.png';
import PlayerBanner from '../card/PlayerBanner';

function DetailMylist({playlist_id, handleRender}) {

    const [playlistData, setPlaylistData] = useState([]);
    const [albumAndMusicData, setAlbumAndMusicData] = useState([]);

    ////////// MBJ //////////
    // 전체선택 베너
    const [allcheckVal, setAllcheckVal] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    //
    let array = [];
    ////////// ~MBJ //////////

    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    const [detailMylistPageCheck, setDetailMylistPageCheck] = useState(false);

    function handleDetailMylistPage(){
        setDetailMylistPageCheck(detailMylistPageCheck => {return !detailMylistPageCheck})
    }

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, music_id, img) =>{
        e.preventDefault();
        setPlaylistModalData([music_id, img]);
        setPlaylistModalOpen(true);
    }

    const [openEditForm, setOpenEditForm] = useState(false);
    const [currentPlaylistName, setCurrentPlaylistName] = useState('');
    const [duplicatedModalOpen, setDuplicatedModalOpen] = useState(false);
    const [detailMylistAddMusicModalOpen, setDetailMylistAddMusicOpen] = useState(false);
    const [detailMylistAddMusicModalData, setDetailMylistAddMusicModalData] = useState([]);

    const clickToOpenEditForm = (e) =>{
        e.preventDefault();
        if(openEditForm == false){
            setOpenEditForm(true);
        }else{
            setOpenEditForm(false);
        }
    }

    const changePlaylistName = async(e) =>{
        e.preventDefault();
        const userData = {
            playlist_id: playlistData[0].playlist_id,
            playlist_name: currentPlaylistName,
            character_id: userid_cookies
        }
        
        await Axios.post(`http://localhost:8080/playlist/detail/detailmylist/changeplaylistname`, userData)
        .then(({data}) =>{
            console.log(data);
            if(data === 1){
                console.log('플레이리스트 이름 중복됨');
                setDuplicatedModalOpen(true);
            }else{
                console.log('플레이리스트 이름 변경됨');
                window.location.reload();
            }
        });
        
    }

    const clickToModalClose = () =>{
        setDuplicatedModalOpen(false);
    }

    const clickToAddMusicModalOpen = (e, playlist_id, playlist_name) =>{
        e.preventDefault()
        console.log(playlist_id);
        console.log(playlist_name);
        setDetailMylistAddMusicModalData([playlist_id, playlist_name]);
        setDetailMylistAddMusicOpen(true)
    }

    const clickToAddMusicModalClose = () =>{
        setDetailMylistAddMusicOpen(false);
    }


    ///////////////////////////////
    
    function playerAdd(bool){
        let array = [];

        for(let i=0; i<albumAndMusicData.length; i++){
            array.push(albumAndMusicData[i].music_id);
        }
        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            music_list: array,
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


    useEffect(() => {     

        // likey 목록 가져옴
        if(userid_cookies !== undefined){
            Axios.post("/ezenmusic/allpage/likeylist/", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                if(data == -1){

                }
                else{
                    array = data[0].music_list;
                }
                })
            .catch((err) => {
                console.log(err);
            })
        }

        Axios.get("/ezenmusic/detail/detailmylist/" + playlist_id)
        .then(({data}) => {
            for(let i=0; i<data.length; i++){
                // object 에 likey 라는 항목 넣고 모두 false 세팅
                data[i].likey = false;
            }
            for(let i=0; i<array.length; i++){
                for(let j=0; j<data.length; j++){
                    if(array[i] === Number(data[j].music_id)){
                        // 좋아요 해당 object 의 값 true 로 변경
                        data[j].likey = true;
                    }
                }
            }
            setAlbumAndMusicData(data);

            Axios.get("/playlist/detail/detailmylist/" + playlist_id)
            .then(({data}) => {
                setPlaylistData(data);
            })
            .catch((err) => {
                {}
            })
        })
        .catch((err) => {
            {}
        })
    }, [detailMylistAddMusicModalOpen, detailMylistPageCheck])
    
    return (
        <>
        { duplicatedModalOpen === true && <DuplicatedPlaylistName clickToModalClose={clickToModalClose}/> }
        { playlistModalOpen && <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal}/> }
        {/* { allcheckVal && <AllCheckedModal setAllcheckVal={setAllcheckVal}/> } */}
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"channel"} /> }

        { detailMylistAddMusicModalOpen && 
            <DetailMylistAddMusic setDetailMylistAddMusicOpen={setDetailMylistAddMusicOpen} handleRender={handleRender} clickToAddMusicModalClose={clickToAddMusicModalClose} 
            detailMylistAddMusicModalData={detailMylistAddMusicModalData}/>
        }

        {   
            playlistData.map((item, index) => (
            <>
            {
                playlistData[index].music_list == null?
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] flex flex-wrap items-center mx-auto'>
                    <div>
                        <div className="flex flex-wrap align-items-center items-center p-[30px]">
                            <div className='null-image flex w-[240px] h-[240px]'>
                                <span className='null-image-icon flex justify-around items-center w-full h-full'>
                                    <PiMusicNotesLight className='text-[60px]' />
                                </span>
                            </div>
                            <div className="m-[30px]">
                                <div className='flex flex-row'>
                                    {
                                        !openEditForm?
                                        <>
                                        <span className="detail-title flex justify-start mb-[10px]">{playlistData[index].playlist_name}</span>
                                        <button type='button' onClick={clickToOpenEditForm}>
                                            <RiEdit2Fill className='text-[30px] cursor-pointer'/>
                                        </button>
                                        </>
                                        :
                                        <form onSubmit={changePlaylistName} className='w-[850px] h-[48px] mb-[20px]'>
                                            <input type="text" name="playlist_name" className='w-[760px] h-[48px] border-b-2 mb-[20px] text-[28px]' placeholder={playlistData[index].playlist_name} value={currentPlaylistName}  onChange={(e) => setCurrentPlaylistName(e.target.value)} />
                                            <input type="hidden" name="playlist_id" value={playlistData[0].playlist_id} />
                                            <button type='reset' className='ml-[10px]' style={{color: "var(--main-theme-color)"}} onClick={clickToOpenEditForm}>취소</button>
                                            <button type='submit' className='ml-[20px]' style={{color: "var(--main-theme-color)"}}>확인</button>
                                        </form>
                                    }
                                </div>
                                
                                <p className="font-normal">총 0곡</p>
                                {/* <button className="artist_listplus ml-[-10px]" style={{backgroundImage:`url(${icons})`}} onClick={(e) => playerAdd()}></button> */}
                            </div>
                        </div>
                    </div>
                </StyledDetail>
                :
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] flex flex-wrap items-center mx-auto'>
                    <div>
                        <div className="flex flex-wrap align-items-center items-center p-[30px]">
                            <div className='null-image relative'>
                                <img src={"/image/album/"+playlistData[index].thumbnail_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[6px]" />
                                <button className='libutton absolute' style={{backgroundImage: `url(${icons})`}} onClick={(e) => playerAdd(true)}>Play Icon</button>
                            </div>
                            <div className="m-[30px]">
                                <div className='flex flex-row'>
                                    {
                                        !openEditForm?
                                        <>
                                        <span className="detail-title flex justify-start mb-[10px]">{playlistData[index].playlist_name}</span>
                                        <button type='button' onClick={clickToOpenEditForm} >
                                            <RiEdit2Fill className='text-[30px] cursor-pointer'/>
                                        </button>
                                        </>
                                        :
                                        <form onSubmit={changePlaylistName} className='w-[850px] h-[48px] mb-[20px]'>
                                            <input type="text" name="playlist_name" className='w-[760px] h-[48px] border-b-2 mb-[20px] text-[28px]' placeholder={playlistData[index].playlist_name} value={currentPlaylistName}  onChange={(e) => setCurrentPlaylistName(e.target.value)} />
                                            <input type="hidden" name="playlist_id" value={playlistData[0].playlist_id} />
                                            <button type='reset' className='ml-[10px]' style={{color: "var(--main-theme-color)"}} onClick={clickToOpenEditForm}>취소</button>
                                            <button type='submit' className='ml-[20px]' style={{color: "var(--main-theme-color)"}}>확인</button>
                                        </form>
                                    }
                                </div>
                                <p className="font-normal">총 {playlistData[index].music_list.length}곡</p>
                                <button className="artist_listplus ml-[-10px] mt-[10px]" style={{backgroundImage:`url(${icons})`}} onClick={(e) => playerAdd(false)}></button>
                            </div>
                        </div>
                    </div>
                </StyledDetail>
            }
            </>
            ))
            
        }
        {
            playlistData.map((item, index) =>(
                playlistData[0].music_list == null?
                <StyledMylistDivFalse key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] h-[450px] flex flex-wrap justify-center items-center mx-auto'>
                    <div className='flex flex-col text-center'>
                    <img src="/image/noplaylist.svg" alt="noplaylist" />
                    <p className='mt-2 font-bold'>내 리스트에 곡이 없어요</p>
                    <span className='mt-1 mb-3'>곡을 추가해주세요!</span>
                    <button type='button' onClick={(e) => clickToAddMusicModalOpen(e, item.playlist_id, item.playlist_name)}> + 곡 추가하기 </button>
                    </div>
                </StyledMylistDivFalse>
                :
                <MusicListTable page="detailmylist" lank={false} playlist_id={playlist_id} handleDetailMylistPage={handleDetailMylistPage} music_list={albumAndMusicData} handleRender={handleRender}/>
            ))
        }

        </>
    )
}

export default DetailMylist

const StyledDetail = styled.div`
    // width: 1440px;
    // margin: 0 auto;

    .detail-title{
        font-size: 28px;
        font-weight: 700;
    }

    .lyrics{
        white-space: pre-wrap;
    }

    .active{
        background-color: var(--main-theme-color);
        color: white
    }

    
    .null-image{
        position: relative;
        border-radius: 6px;
        background-color: var(--mylist-null-image-cover);
    }
    .null-image::before{
        position: absolute;
        display: block;
        top: -4px;
        content: "";
        z-index: -1;
        left: 2.5%;
        width: 95%;
        height: 95%;
        background-color: var(--mylist-null-image-before);
        opacity: 0.5;
        border-radius: 10px;
    }
    .null-image::after{
        position: absolute;
        display: block;
        top: -8px;
        content: "";
        z-index: -2;
        left: 5%;
        width: 90%;
        height: 90%;
        background-color: var(--mylist-null-image-after);
        opacity: 0.8;
        border-radius: 10px;
    }
    .null-image span{
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }
    .null-image span:hover{
        z-index: 1999;
        background-color: rgba(0,0,0,0.2);
    }
    .null-image-icon{
        color: var(--main-text-gray-lighter);
        z-index: 1000;
    }
    .libutton{
          z-index: 5;
          bottom: 10px;
    }
`

export const StyledTableth = styled.th`
    font-size: 12px;

    p{
        color: var(--main-text-gray);
        font-weight: 400;
    }
`


export const StyledBrowser = styled.div`
    // border: 1px solid black;

    .chart-title{
        font-size: 20px;
        font-weight: 700;
    }

    .all-play-box{
        font-size: 14px;
        color: var(--main-text-gray);
    }

    .all-play-box:hover *{
        color: var(--main-theme-color);
    }

    .all-play-icon{
        font-size: 20px;
        color: var(--main-text-gray);
    }

    tbody>*{
        color: var(--main-text-gray);
    }
`;

const StyledMylistDivFalse = styled.div`
  img{
    width: 180px;
    height: 130px;
  }
  button{
    margin-left: 40px;
    margin-top: 5px;
    border: 1px solid var(--main-text-gray-lighter);
    padding: 5px;
    border-radius: 20px;
    font-size: 14px;
    width: 100px;
  }
`