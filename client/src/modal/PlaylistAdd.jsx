import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Axios from 'axios'
import { RiCloseFill, RiAddLine } from "react-icons/ri";
import { PiMusicNotesLight } from "react-icons/pi";
import { useCookies, Cookies } from 'react-cookie';

const PlaylistAdd = ({setPlaylistModalOpen, playlistModalData, handleplaylistModal}) => {
    
    const cookies = new Cookies();
    let userid_cookies = cookies.get("client.sid");

    const [addPlaylist, setAddPlaylist] = useState([]);
    const [addNewPlaylist, setAddNewPlaylist] = useState(false);

    console.log(playlistModalData);

    useEffect(() =>{
        Axios.post(`http://localhost:8080/playlist/browse/addplaylist` ,{
            userid: userid_cookies
        })
        .then(({data}) =>{
            // console.log(data);
            if(data !== -1){
                setAddPlaylist(data);
            }
        })
        .catch((err) =>{
            {}
        })
    }, [])

    
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    let date = year + month  + day;

    const [input_playlist_name, setInput_playlist_name] = useState(date);
    const [duplicatedPlaylistName, setDuplicatedPlaylistName] = useState(false);
    
    const clickToAddNewMusicToPlaylist = async(e, playlist_name, playlist_id) => {
        e.preventDefault();
        const userData = {
            userid: userid_cookies,
            date: date,
            music_id: playlistModalData.music_id,
            thumbnail_image: playlistModalData.thumbnail_image,
            album_title: playlistModalData.album_title,
            theme_playlist: playlistModalData.playlist,
            playlist_name: playlist_name,
            playlist_id: playlist_id,
            album_id: playlistModalData.album_id
        };
        await Axios.post(`http://localhost:8080/playlist/browse/addmusictoplaylist`, userData)
        .then(({data}) =>{
        //   console.log(data);
        });
        handleplaylistModal();
        // setPlaylistModalOpen(false);
      };

      const clickToAddNewMusicAndPlaylist = async(e) =>{
        e.preventDefault();
        const userData = {
            userid: userid_cookies,
            date: date,
            music_id: playlistModalData[0],
            thumbnail_image: playlistModalData[1],
            playlist_name: input_playlist_name
        };
        await Axios.post(`http://localhost:8080/playlist/browse/addnewmusicandplaylist`, userData)
        .then(({data}) =>{
            if(data == 1){
                console.log('플레이리스트 제목이 중복됨')
                setDuplicatedPlaylistName(true);
            }else{
                console.log("플레이리스트 생성됨");
                handleplaylistModal();
            }
        });
      }


    const clickToAddNewPlaylist = async(e) =>{
        e.preventDefault();
        if(addNewPlaylist == false){
            await setAddNewPlaylist(true);
        }else{
            await setAddNewPlaylist(false);
        }
    }
    // console.log(setAddNewPlaylist)

    const clickPlaylistModalClose = async(e) =>{
        e.preventDefault();
        await setPlaylistModalOpen(false);
    };

    return (
        <StyledModal>
            <div className='modal-box flex flex-col w-[530px] max-h-[768px] overflow-y-scroll overflow-x-hidden'>
                <div className='modal-header w-[530px] h-[90px] flex justify-between'>
                    <span className='ml-[30px]'>내 리스트에 담기</span>
                    <RiCloseFill className='mr-[30px] w-[30px] h-[30px] cursor-pointer' onClick={clickPlaylistModalClose}/>
                </div>

                <div className='modal-contents flex flex-col mt-[5px] w-[530px] mb-[40px]'>
                    <div className='playlist flex items-center w-[470px] h-[90px] mx-auto'>
                        {
                            addNewPlaylist == false?
                            <>
                            <div className='no-playlist w-[70px] h-[70px] border rounded-md cursor-pointer' onClick={clickToAddNewPlaylist}><RiAddLine className='mt-[22px] ml-[22px] text-[25px]'/></div>
                            <span className='ml-3 cursor-pointer' onClick={clickToAddNewPlaylist}>새로운 리스트 추가하기</span>
                            </>
                            :
                            <form onSubmit={(e) => clickToAddNewMusicAndPlaylist(e)} method='post' className='relative mt-[30px]' >
                                <ul className='w-[470px] h-[120px]'>
                                    <li className=' border-b-2'>
                                        { duplicatedPlaylistName && <label className='text[-14px]' style={{color: "var(--signup-invalid-color)"}}>중복된 플레이리스트 이름이 존재합니다!!</label>}
                                        <input type="text" name="playlist_name" className='w-[400px]' placeholder={date} value={input_playlist_name} onChange={(e) => setInput_playlist_name(e.target.value)} />
                                        <input type="hidden" name="music_id" value={playlistModalData[0]} />
                                        <input type="hidden" name="thumbnail_image" value={playlistModalData[1]} />
                                    </li>
                                    <li className=''>
                                        <button className='absolute right-10' onClick={clickToAddNewPlaylist}>취소</button>
                                        <button type='submit' className='absolute right-0' style={{color: "var(--main-theme-color)"}}>생성</button>
                                    </li>
                                </ul>
                            </form>
                        }
                    </div>
                {
                    addPlaylist.length !== 0?
                    addPlaylist.map((data, index) =>(
                        <div className='playlist flex items-center w-[470px] h-[90px] mx-auto cursor-pointer' onClick={(e) => clickToAddNewMusicToPlaylist(e, data.playlist_name, data.playlist_id)}>
                        {
                            addPlaylist[index].thumbnail_image == null?
                            <div className='no-playlist w-[70px] h-[70px] border rounded-md cursor-pointer' onClick={clickToAddNewPlaylist}><PiMusicNotesLight className='mt-[22px] ml-[22px] text-[25px]'/></div>
                            :
                            <img src={"/image/album/" + addPlaylist[index].thumbnail_image} alt="cover_image" className='w-[70px] h-[70px] rounded-md' />
                        }
                            <span className='ml-3'>{addPlaylist[index].playlist_name}</span>
                        </div>
                    ))
                    :
                    ""
                }
                </div>
            </div>
        </StyledModal>
    )
}

export default PlaylistAdd


const StyledModal = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
    background-color: rgba(0,0,0,0.5);

    .modal-box{
        position: absolute;
        top: 45%;
        left: 50%;
        background-color: var(--main-background-white);
        transform: translate(-50%, -50%);
        // opacity: 1;
        border-radius: 5px;
        // overflow-y: auto;
        .modal-header{
            span{
                color: var(--modal-text-black);
                font-size: 18px;
                font-weight: 500;
            }
        }
        .modal-contents{
            .playlist{
                span{
                    color: var(--main-text-gray);
                }

            }
        }
    }
    .no-playlist{
        background-color: var(--mylist-null-image-before);
    }
`;