import React, {useState, useEffect, useContext} from 'react'
import axios from "axios"
import {StyledDetail} from "../components/Track"
import MusicListTable from '../card/MusicListTable';
import AllCheckedModal from '../modal/AllCheckedModal';
import { Cookies } from 'react-cookie';
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import { getCookie } from '../config/cookie'
import styled from 'styled-components';
import PlayerBanner from '../card/PlayerBanner';
import { AppContext } from '../App'

import { MusicListCardAddMyListButton as AddMyListButton } from '../style/StyledIcons';
import { MusicListCardAddPlaylistButton as AddPlaylistButton } from '../style/StyledIcons';

const Recommend = ({handleRender}) => {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [allcheckVal, setAllcheckVal] = useState(false);

    const [ titleData, setTitleData ] = useState('');
    const [ recommendedMusic, setRecommendedMusic ] = useState([]);
    const [ recommendedPlaylist, setRecommendedPlaylist] = useState([]);

    const [ loading, setLoading ] = useState(false);
    
    const [ updateDate, setUpdateDate ] = useState('');

    let music_list_array = [];

    const getPlaylistData = async(array) =>{
        const response = await axios.post('/verifiedClient/getPrefer', {token: getCookie('connect.sid'), characterId: getCookie('character.sid')});
        setTitleData(response.data);
        console.log(response.data.music_list);
        setLoading(false);

        response.data.music_list.forEach((data)=>{
            music_list_array.push(Number(data.music_id));
        })
        setRecommendedPlaylist(music_list_array);

        response.data.music_list.forEach((data)=>{
            data.likey = false;
        })

        // userid_cookies 없으면 for 문을 안돌면서 true 값 저장안됨.
        for(let i=0; i<array.length; i++){
            for(let j=0; j<response.data.music_list.length; j++){
                if(array[i] === Number(response.data.music_list[j].music_id)){
                    // 좋아요 해당 object 의 값 true 로 변경
                    response.data.music_list[j].likey = true;
                }
            }
        }

        setRecommendedMusic(response.data.music_list);
        
    }

    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);
    
    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: recommendedPlaylist,
            album_title: null,
            thumbnail_image: null,
            theme_playlist: null,
        });
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////

    // 2023-12-13 Recommend 플레이어 추가 MBJ
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    function playerAdd(){
        let array = [];

        for(let i=0; i<recommendedMusic.length; i++){
            array.push(recommendedMusic[i].music_id)
        }

        axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            music_list: array,
            change_now_play: false
        })

        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }
    
    useEffect(()=>{
        let array = [];

        setLoading(true);
        if(isSessionValid){
                
            axios.post("/ezenmusic/allpage/likeylist", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                console.log(data)
                if(data === -1){

                }
                else{
                    array = data[0].music_list;
                }
                getPlaylistData(array);
            })
            .catch((err) => {
                console.log(err);
            })
        }
        else{
            getPlaylistData(array);
        }
        // return 에 날짜는 오늘 날짜로 해도 좋을 듯 해서 넣어붐
        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);

        let date = year + "." + month + "." + day;
        setUpdateDate(date);

    }, []);

    return (
        <>
        { allcheckVal && <AllCheckedModal setAllcheckVal={setAllcheckVal}/> }
        { playlistModalOpen &&
            <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} 
            setAddPlaylistBannerOn={setAddPlaylistBannerOn}/>
        }
        {/* 플레이리스트 추가 베너 */}
        { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"recommend"} /> }
        {
            <StyledDetail className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
            <RecommendHeader className="mb-[40px]">
                <div className="header-cover flex items-center p-[30px]">
                    <div className='image-cover'>
                        <img src={ loading? `/image/loading.png` : `/image/album/${titleData.coverImage}`} alt="loading.png"/>
                    </div>
                    <div className="m-[30px]">
                        <p className="detail-title mb-[10px]">{titleData.description}</p>
                        <p className="main-title text-[14px] text-gray mb-[20px]">{titleData.description}</p>  
                        <div className='flex justify-start items-center mt-[50px]'>
                            <span>
                                <img src="/image/icons/new.svg" alt="new-icon" />
                            </span>
                            <p className="text-[14px] ml-[10px] text-gray">{updateDate}</p>
                        </div>
                        <div className="ml-[-10px] mt-[15px]">
                            <AddPlaylistButton onClick={() => playerAdd()}/>
                            <AddMyListButton onClick={(e) => clickPlaylistModalOpen(e)} ></AddMyListButton>
                        </div>
                    </div>
                </div>
                
            </RecommendHeader>
            <div className="mb-[40px]"> </div>
        </StyledDetail>
        }
        <MusicListTable lank={false} music_list={recommendedMusic} handleRender={handleRender}/>
    </>
    )
}

export default Recommend

const RecommendHeader = styled.div`
    .header-cover{
        .image-cover{
            position: relative;
            display: inline-block;
            img{
                width: 240px;
                height: 240px;
                border: 1px solid #efefef;
                border-radius: 6px;
                &:hover{
                    filter: brightness(0.7);
                }
            }
            &::before{
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
            &::after{
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
            
        }

        div{
            .detail-title{
                font-size: 20px;
                font-weight: 400;
            }
            .main-title{
                font-size: 28px;
                font-weight: 700;
                color: #000000;
            }
        }
    }
`;