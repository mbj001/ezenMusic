import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import styled from 'styled-components';
import { RiPlayLine, RiPlayListAddFill, RiEdit2Fill } from "react-icons/ri";
import { PiMusicNotesLight } from "react-icons/pi";

import MusicListHeader from '../card/MusicListHeader';
import MusicListCard from '../card/MusicListCard';
import { Cookies } from 'react-cookie';
import LikeyBanner from '../card/LikeyBanner';
import PlaylistAdd from '../modal/PlaylistAdd';
import AllCheckedModal from '../modal/AllCheckedModal';
import MusicListTable from '../card/MusicListTable';
import DuplicatedPlaylistName from '../modal/DuplicatedPlaylistName';
import DetailMylistAddMusic from '../modal/DetailMylistAddMusic';

function DetailMylist({playlist_id, handleRender}) {

    const [playlistData, setPlaylistData] = useState([]);
    const [albumAndMusicData, setAlbumAndMusicData] = useState([]);

    ////////// MBJ //////////
    // 좋아요 누를 때 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 전체선택 베너
    const [allcheckVal, setAllcheckVal] = useState(false);
    //
    let array = [];
    ////////// ~MBJ //////////

    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);

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
            userid: userid_cookies
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

    const clickToAddMusicModalOpen = (e, playlist_id) =>{
        e.preventDefault()
        console.log(playlist_id);
        setDetailMylistAddMusicModalData([playlist_id]);
        setDetailMylistAddMusicOpen(true)
    }

    const clickToAddMusicModalClose = () =>{
        setDetailMylistAddMusicOpen(false);
    }


    ///////////////////////////////

    useEffect(() => {     
        const cookies = new Cookies();
        const userid_cookies = cookies.get("client.sid");

        // likey 목록 가져옴
        if(userid_cookies !== undefined){
            Axios.get("http://localhost:8080/ezenmusic/allpage/likeylist/" + userid_cookies)
            .then(({data}) => {
                // console.log("browse likeylist axios get complete!!");
                array = data[0].music_list;
                })
            .catch((err) => {
                console.log(err);
            })
        }

        Axios.get("http://localhost:8080/ezenmusic/detail/detailmylist/" + playlist_id)
        .then(({data}) => {
            for(let i=0; i<data.length; i++){
                // object 에 likey 라는 항목 넣고 모두 false 세팅
                data[i].likey = false;
            }
            for(let i=0; i<array.length; i++){
                for(let j=0; j<data.length; j++){
                    if(array[i] === Number(data[j].id)){
                        // 좋아요 해당 object 의 값 true 로 변경
                        data[j].likey = true;
                    }
                }
            }
            setAlbumAndMusicData(data);

            Axios.get("http://localhost:8080/playlist/detail/detailmylist/" + playlist_id)
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
    }, [])
    
    return (
        <>
        {
            duplicatedModalOpen === true?
            <DuplicatedPlaylistName clickToModalClose={clickToModalClose}/>
            :
            ""
        }
        {
            playlistModalOpen?
            <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal}/>
            :
            ""
        }
        {
            allcheckVal ?
            <AllCheckedModal setAllcheckVal={setAllcheckVal}/>
            :
            ""
        }
        {
            detailMylistAddMusicModalOpen ?
            <DetailMylistAddMusic setDetailMylistAddMusicOpen={setDetailMylistAddMusicOpen} clickToAddMusicModalClose={clickToAddMusicModalClose} detailMylistAddMusicModalData={detailMylistAddMusicModalData}/>
            :
            ""
        }
        {   
            playlistData.map((item, index) => (
            <>
            {
                playlistData[index].playlist == null?
                <StyledDetail key={index}>
                    <div>
                        <div className="flex items-center p-[30px]">
                            <div className='null-image flex w-[240px] h-[240px] rounded-[10px]'>
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
                                <div className="flex mt-[50px] ">
                                    <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                                </div>
                            </div>
                        </div>
                    </div>
                </StyledDetail>
                :
                <StyledDetail key={index}>
                    <div>
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/album/"+playlistData[index].thumbnail_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[10px]" />
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
                                <p className="font-normal">총 {playlistData[index].playlist.length}곡</p>
                                <div className="flex mt-[50px] ">
                                    <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                                </div>
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
                playlistData[0].playlist == null?
                <StyledMylistDivFalse key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] flex flex-wrap justify-center items-center mx-auto'>
                    <div className='flex flex-col text-center mt-32'>
                    <img src="/image/noplaylist.svg" alt="noplaylist" />
                    <p className='mt-2 font-bold'>곡이 하나도 없어용 ㅠㅠ</p>
                    <span>곡을 추가해주세요!</span>
                    <button type='button' className='mt-[3px] text-[15px]' onClick={(e) => clickToAddMusicModalOpen(e, item.playlist_id)}> + 곡 추가하기 </button>
                    </div>
                </StyledMylistDivFalse>
                
                :
                <MusicListTable page="detailmylist" lank={false} music_list={albumAndMusicData} handleRender={handleRender}/>
            ))
        }

        </>
    )
}

export default DetailMylist

const StyledDetail = styled.div`
    width: 1440px;
    margin: 0 auto;

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
        background-color: var(--mylist-null-image-after);
      }
      .null-image:before{
        position: absolute;
        display: block;
        top: -5px;
        content: "";
        z-index: 2;
        left: 6px;
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
        left: 10px;
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
        z-index: 1999;
        background-color: rgba(0,0,0,0.2);
      }
      .null-image-icon{
        color: var(--main-text-gray-lighter);
        z-index: 1000;
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
    width: 1440px;
    margin: 0 auto;
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
    margin-top: 5px;
    border: 1px solid var(--main-text-gray-lighter);
    padding: 5px 10px;
    border-radius: 20px;
  }
`