import React, {useEffect, useState, useContext} from 'react'
import MusicListHeader from './MusicListHeader'
import MusicListCard from './MusicListCard'
import LikeyBanner from './LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import AllCheckedModal from '../modal/AllCheckedModal';
import PlaylistAdd from '../modal/PlaylistAdd';
import styled from 'styled-components';
import { IoPlayOutline } from "react-icons/io5";
import PlayerBanner from './PlayerBanner';
import Axios from "axios";
import AddPlaylistBanner from './AddPlaylistBanner';
import { Cookies } from 'react-cookie';
import { AppContext } from '../App'

function MusicListTable({page, lank, music_list, handleRender, showMore, browseCheckAll, handleLikeypage, setDetailMylistAddMusicOpen, detailMylistAddMusicModalData, 
    playlist_id, handleDetailMylistPage}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));
    
    // props music_list 저장할 변수 (checked 변경 용도)
    const [musiclist, setMusiclist] = useState([]);
    // 좋아요 누를 때 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 전체선택
    const [allcheckVal, setAllcheckVal] = useState(false);
    // 선택한 노래들 정보 저장
    const [selectedMusicList, setSelectedMusicList] = useState([]);
    // selected 항목 유무 체크
    const [hasSelectbox, setHasSelectbox] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    const [addplayerCount, setAddplayerCount] = useState(0);
    const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);

                    
    // 전체 듣기 클릭
    function listenAll(){
        let array = [];
        
        for(let i=0; i<musiclist.length; i++){
            array.push(musiclist[i].music_id);
        }
        Axios.post("/playerHandle/checklistAdd", {
            character_id: userid_cookies,
            music_list: array,      // select 한 음악 id 들어있는 배열 전달
            change_now_play: true
        })
        .then(({data}) => {
            setAddplayerCount(array.length);        // 전체 곡 수
            setPlayerBannerOn(true);                // 플레이어 추가 베너
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, music_id, img) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: music_id,
            album_title: null,
            thumbnail_image: img,
            playlist: null
        });
        setPlaylistModalOpen(true);
    }
    /////////////////////////

    // 음악 체크박스 체크
    function selectMusic(e, index){

        let array = [];
        let music_id_list = [];         // checked true 인 music id 값들 저장

        for(let i=0; i<musiclist.length; i++){
            array.push(musiclist[i]);
            if(i === index){
                array[i].checked = !array[i].checked;
            }

            if(array[i].checked === true){
                music_id_list.push(array[i].music_id);
            }
        }

        for(let i=0; i<array.length; i++){
            if(array[i].checked === true){
                setHasSelectbox(true);
                break;
            }
            // 반복문 다 돌았는데 true 없을 때
            if(i === array.length -1){
                setHasSelectbox(false);
            }
        }

        setMusiclist(array);
        setSelectedMusicList(music_id_list);
    }


    // 전체선택
    function selectAllFunc(e){

        setAllcheckVal(e.target.checked);
        
        let array = []
        let music_id_list = [];         // checked true 인 music id 값들 저장

        // 전체 선택 체크
        if(e.target.checked === true){
            for(let i=0; i<musiclist.length; i++){
                array.push(musiclist[i]);
                array[i].checked = true;
                setHasSelectbox(true);
                music_id_list.push(musiclist[i].music_id);
            }
            setSelectedMusicList(music_id_list);
        }

        // 전체 선택 해제
        else{
            for(let i=0; i<musiclist.length; i++){
                array.push(musiclist[i]);
                array[i].checked = false;
                setHasSelectbox(false);
            }
            setSelectedMusicList([]);
        }
    }

    // checked 의 modal close
    function selectModalClose(){
        let array = [];

        for(let i=0; i<musiclist.length; i++){
            array.push(musiclist[i]);
            array[i].checked = false;
            setHasSelectbox(false);
        }

        setAllcheckVal(false);
        setSelectedMusicList([]);
    }


    useEffect(() => {
        if(browseCheckAll !== undefined){
            setAllcheckVal(browseCheckAll);
        }

        // checked 항목 false 로 저장
        for(let i=0; i<music_list.length; i++){
            music_list[i].checked = false;
        }

        setMusiclist(music_list);
        setHasSelectbox(false);
    }, [music_list])


    return (
    <div>
        {/* 재생목록 추가 베너 */}
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} count={addplayerCount} /> }
        {/* 플레이리스트 추가 베너 */}
        { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        {/* 좋아요 추가 베너 */}
        <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"track"}/>
        {/* 로그인 해주세요 모달 */}
        { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} />  }
        { hasSelectbox  &&  
            <AllCheckedModal setAllcheckVal={setAllcheckVal} selectedMusicList={selectedMusicList} setSelectedMusicList={setSelectedMusicList} 
            handleRender={handleRender} setPlayerBannerOn={setPlayerBannerOn} setAddplayerCount={setAddplayerCount} page={page} handleLikeypage={handleLikeypage} 
            setDetailMylistAddMusicOpen={setDetailMylistAddMusicOpen} detailMylistAddMusicModalData={detailMylistAddMusicModalData} selectModalClose={selectModalClose} 
            setAddPlaylistBannerOn={setAddPlaylistBannerOn} playlist_id={playlist_id} handleDetailMylistPage={handleDetailMylistPage}/> 
        }
        { playlistModalOpen &&
            <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} 
            setAddPlaylistBannerOn={setAddPlaylistBannerOn}/>
        }

        {
            musiclist.length !== 0 &&

            <StyledBrowser className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
                <div className="mb-3 flex items-center justify-between">
                    {
                        page === "browse" &&
                        <div className="flex items-center">
                            <p className="chart-title">EzenMusic 차트</p>
                            <p className="text-slate-400 text-[12px] ml-[10px]">24시간 집계</p>
                        </div>
                    }
                    {
                        page !== "detailmylistaddmusic" &&
                        <div className="all-play-box" onClick={isSessionValid? () => listenAll(): () => setLoginrRequestVal(true)}>
                            <IoPlayOutline className="all-play-icon"/>
                            <p>전체듣기</p>
                        </div>
                    }
                </div>

                <table className="table table-hover">
                    <MusicListHeader lank={lank} selectAllFunc={selectAllFunc} allcheckVal={allcheckVal} page={page} />
                    <tbody>
                        {
                            page === "browse"?
                            <>
                            {
                                musiclist.map((item, index) => (
                                    <MusicListCard key={index} lank={index+1} music_title={item.music_title} album_title={item.album_title} artist_id={item.artist_id} 
                                    artist_name={item.artist_name} img={item.org_cover_image} music_id={item.music_id} album_id={item.album_id} check_all={allcheckVal} 
                                    setAllcheckVal={setAllcheckVal} selectMusic={selectMusic}
                                    likey={item.likey} setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} clickPlaylistModalOpen={clickPlaylistModalOpen}
                                    setLoginrRequestVal={setLoginrRequestVal}  setPlayerBannerOn={setPlayerBannerOn} setAddplayerCount={setAddplayerCount} 
                                    index={index} checked={item.checked}/>
                                ))
                            }
                            </>
                            :
                            (
                                page === "detailmylistaddmusic"?
                                <>
                                {
                                    musiclist.map((item, index) => (
                                        <MusicListCard key={index} music_title={item.music_title} album_title={item.album_title} artist_name={item.artist_name} 
                                        img={item.org_cover_image} music_id={item.music_id} check_all={allcheckVal} page={page}
                                        clickPlaylistModalOpen={clickPlaylistModalOpen} handleLikeypage={handleLikeypage}
                                        selectMusic={selectMusic}  setPlayerBannerOn={setPlayerBannerOn}
                                        setAddplayerCount={setAddplayerCount} index={index} checked={item.checked}/>
                                    ))
                                }
                                </>
                                :
                                <>
                                {
                                    musiclist.map((item, index) => (
                                        <MusicListCard key={index} music_title={item.music_title} album_title={item.album_title} artist_id={item.artist_id} artist_name={item.artist_name} 
                                        img={item.org_cover_image} music_id={item.music_id} album_id={item.album_id} likey={item.likey} check_all={allcheckVal} 
                                        setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} clickPlaylistModalOpen={clickPlaylistModalOpen}
                                        setLoginrRequestVal={setLoginrRequestVal}  handleLikeypage={handleLikeypage} selectMusic={selectMusic}  setPlayerBannerOn={setPlayerBannerOn}
                                        setAddplayerCount={setAddplayerCount} index={index} checked={item.checked}/>
                                    ))
                                }
                                </>
                            )
                        }
                    </tbody>
                </table>
            </StyledBrowser>
        }
    </div>
    )
}

export const StyledBrowser = styled.div`
    margin: 0 auto;

    .chart-title{
        font-size: 20px;
        font-weight: 700;
    }

    .all-play-box{
        display: flex;
        align-items: center;
        font-size: 13px;
        line-height: 17px;
        color: #222;
        cursor: pointer;
        letter-spacing: -0.5px;
        margin-left: 24px;
        &:hover *{
            color: var(--main-theme-color);
        }
        .all-play-icon{
            font-size: 16px;
            color: #222;
            margin-right: 3px;
            margin-top: 1px;
        }
        p{
            margin-left: -3px;
        }
    }

    tbody>*{
        color: #f6f6f6;
    }
`;
export default MusicListTable