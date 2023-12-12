import React, {useState, useEffect} from 'react'
import axios from "axios"
import { StyledBrowser } from '../pages/Browse';
import {StyledDetail} from "../components/Track"
import { RiPlayLine, RiPlayListAddFill, RiFolderAddLine, RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';
import MusicListTable from '../card/MusicListTable';
import MusicListHeader from '../card/MusicListHeader';
import AllCheckedModal from '../modal/AllCheckedModal';
import { userid_cookies } from '../config/cookie';
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import { getCookie } from '../config/cookie'
import styled from 'styled-components';
import icons from '../assets/sp_button.6d54b524.png';
import PlayerBanner from '../card/PlayerBanner';


const Recommend = ({handleRender}) => {
    const [allcheckVal, setAllcheckVal] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);

    const [ titleData, setTitleData ] = useState('');
    const [ recommendedMusic, setRecommendedMusic ] = useState([]);
    const [ recommendedPlaylist, setRecommendedPlaylist] = useState([]);

    const [ loading, setLoading ] = useState(false);
    
    const [ likeyMusicList, setLikeyMusicList ] = useState([]);
    const [ updateDate, setUpdateDate ] = useState('');

    let array = [];
    let music_list_array = [];

    const getPlaylistData = async() =>{
        const response = await axios.post('/verifiedClient/getPrefer', {token: getCookie('connect.sid'), characterId: getCookie('character.sid')});
        console.log(response);
        setTitleData(response.data);
        setLoading(false);

        // for(let i = 0; i < response.data.music.length; i++){
        //     music_list_array.push(Number(response.data.music[i].id));
        // }
        response.data.music_list.forEach((data)=>{
            music_list_array.push(Number(data.music_id));
        })
        console.log(music_list_array)
        setRecommendedPlaylist(music_list_array);

        // for(let i=0; i<(response.data.music_list?.length); i++){
        //     // object 에 likey 라는 항목 넣고 모두 false 세팅
        //     response.data.music[i].likey = false;
        // }
        response.data.music_list.forEach((data)=>{
            data.likey = false;
        })

        // userid_cookies 없으면 for 문을 안돌면서 true 값 저장안됨.
        for(let i=0; i<array.length; i++){
            for(let j=0; j<response.data.music_list.length; j++){
                if(array[i] === Number(response.data.music_list[j].id)){
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

    // MBJ
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    // 2023-12-01 channel 플레이어 추가
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
    // ~MBJ
    
    useEffect(()=>{
        setLoading(true);
        if(userid_cookies !== undefined){
                
            axios.post("/ezenmusic/allpage/likeylist", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                console.log(data)
                if(data === -1){

                }
                else{
                    setLikeyMusicList(data[0].music_list);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
        getPlaylistData();

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
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"channel"} /> }
        { playlistModalOpen &&
            <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} 
            setAddPlaylistBannerOn={setAddPlaylistBannerOn}/>
        }
        {/* 플레이리스트 추가 베너 */}
        { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        {
            <StyledDetail className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
            <RecommendHeader className="mb-[40px]">
                <div className="header-cover flex items-center p-[30px]">
                    <div className='image-cover'>
                        {
                            loading ? 
                            <img src={`/image/loading.png`} alt="loading.png"/>
                            :
                            <img src={`/image/album/${titleData.coverImage}`} alt="cover_image"/>
                        }
                        
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
                        <div className="flex mt-[15px] ">
                        {/* <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                        <RiFolderAddLine className="mx-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" onClick={(e) => clickPlaylistModalOpen(e)} /> */}
                        <button className="artist_listplus ml-[-10px]" style={{backgroundImage:`url(${icons})`}} onClick={playerAdd}></button>
                        <button className="artist_box " style={{backgroundImage:`url(${icons})`}} onClick={(e) => clickPlaylistModalOpen(e)}></button>

                        </div>
                    </div>
                </div>
                
            </RecommendHeader>
            <div className="mb-[40px]"> </div>
        </StyledDetail>
        }
        <MusicListTable lank={false} music_list={recommendedMusic} handleRender={handleRender}/>
            
        { allcheckVal && <AllCheckedModal setAllcheckVal={setAllcheckVal}/> }
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
                border-radius: 6px;
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
                width: 88%;
                height: 88%;
                position: absolute;
                z-index: -3;
                top: -8px;
                right: 6%;
                display: inline-block;
                content: "";
                background-color: #e3e3e3;
                opacity: 0.5;
                border-radius: 6px;
            }
            &:hover{
                filter: brightness(0.7);
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