import React, {useState, useEffect, useRef} from 'react'
import Axios from "axios"
import Player from './Player';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import PlayerBanner from '../card/PlayerBanner';
import LikeyBanner from '../card/LikeyBanner';
import MylistSelectModal from '../modal/MylistSelectModal';
import { RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine, RiHeart3Fill } from "react-icons/ri";


function Playlist({handleRender, render}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");

    // 플레이리스트의 노래 목록
    const [playerMusic, setPlayerMusic] = useState([]);
    // 하단 플레이어의 노래 항목
    const [listenMusic, setListenMusic] = useState([]);
    const [showPlaylist, setShowPlaylist] = useState(true);
    const [showMorebox, setShowMorebox] = useState([]); 
    // 곡 취소 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    const [delCount, setDelCount] = useState(0);
    // 전체 선택 체크 val
    const [checkAll, setCheckall] = useState(false);
    // 선택 모달
    const [modalOpen, setModalOpen] = useState(false);
    // 좋아요 누를 때 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    
    const moreIconRef = useRef([]);
    const moreboxRef = useRef([]);

    // 편집모드
    const [editMode, setEditMode] = useState(false);

    let array = [];
    let array2 = [];


    function addLikeyFunc(music_id){

        Axios.post("/ezenmusic/addlikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            setLikeyBannerOn(1)
            handleRender();

        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeyFunc(music_id){
        Axios.post("/ezenmusic/dellikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            setLikeyBannerOn(-1); 
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delPlayerlistFunc(e, music_id){
        e.preventDefault();
        Axios.post("/playerHandle/delplayerlist",{
            character_id: userid_cookies,
            music_id: music_id
        })
        .then(({data}) => {
            handleRender();
        })
    }

    /////////////// checkbox 관련 Function
    function selectCheck(e, index){
        let array = [];

        for(let i=0; i<playerMusic.length; i++){
            array.push(playerMusic[i]);
            if(i === index){
                array[i].checked = !array[i].checked;
            }
        }

        for(let i=0; i<array.length; i++){
            if(array[i].checked === true){
                setModalOpen(true);
                break;
            }
            if(i === array.length -1){
                setModalOpen(false);
            }
        }
        setPlayerMusic(array);
    }

    function selectCheckAll(){
        let array = [];
        
        for(let i=0; i<playerMusic.length; i++){
            array.push(playerMusic[i]);
            array[i].checked = !checkAll;
        }
        
        // checkAll 변수 변경 전 true 였다면
        if(checkAll === true){
            setModalOpen(false);
        }
        else{
            setModalOpen(true);
        }

        setPlayerMusic(array);
        setCheckall(() => {return !checkAll;});
    }

    function selectCheckdel(){
        setModalOpen(false);
        setCheckall(false);
        let array = [];
        for(let i=0; i<playerMusic.length; i++){
            array.push(playerMusic[i]);
            array[i].checked = false;
        }
        setPlayerMusic(array);
    }

    function delplayerlist(){
        let array = [];
        
        for(let i=0; i<playerMusic.length; i++){
            if(playerMusic[i].checked === true){
                array.push(playerMusic[i].music_id);
            }
        }
        setDelCount(array.length);
        Axios.post("/playerHandle/checklistDel", {
            character_id: userid_cookies,
            list: array
        })
        .then(({data}) => {
            setEditMode(false);
            setModalOpen(false);
            handleRender();
            setCheckall(false);
            setPlayerBannerOn(true);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    /////////////////////////////////////////////
    /////////////////////////////////////////////


    useEffect(() => {
        if(!userid_cookies){
            // 로그인 안되어 있을 때
            setListenMusic([]);
            setPlayerMusic([]);
        }
        else{
            Axios.post("/ezenmusic/allpage/likeylist", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                if(data == -1){
        
                }
                else{
                    array2 = data[0].music_list;
                }
            })
            .catch((err) => {
                console.log(err);
            })


            Axios.post("/ezenmusic/playerbar", {
                character_id: userid_cookies
            })
            .then(({data}) => {
                if(data == -1){
                    setListenMusic([]);
                    setPlayerMusic([]);
                }
                else{
                    for(let i=0; i<data.length; i++){
                        // object 에 likey 라는 항목 넣고 모두 false 세팅
                        data[i].likey = false;
                        data[i].checked = false;
                    }
        
                    for(let i=0; i<array2.length; i++){
                        for(let j=0; j<data.length; j++){
                            if(array2[i] === Number(data[j].music_id)){
                                // 좋아요 해당 object 의 값 true 로 변경
                                data[j].likey = true;
                            }
                        }
                    }

                    for(let i=0; i<data.length; i++){
                        if(data[i].now_play_music === true){
                            // 아래 player에 나올 노래
                            setListenMusic(data[i]);
                        }
                    }
                    // 플레이리스트에 들어갈 노래들
                    setPlayerMusic(data);

                    for(let i=0; i<data.length; i++){
                        array.push("false");
                    }
                    setShowMorebox(() => {return array;});
                }
            })
            .catch((err) => {
                {}
            })

        }
    }, [render, userid_cookies])

    function changeMusicFunc(e, item){
        e.preventDefault();
        setListenMusic(item);
        // 현재 재생중인 곡 수정(playerlist -> now_play_list)
        Axios.post("/playerHandle/changeNowMusic", {
            character_id: userid_cookies,
            music_id: item.music_id
        })
    }



    function showPlaylistFunc(){
        // 이렇게 set 함수 안에 함수형태로 넣으면 비동기 식으로 넘어가지 않음.
        setShowPlaylist(showPlaylist => {return !showPlaylist});
    }
    
    function handleShowMoreBox(index){
        let handleArray = [];
        for(let i=0; i<showMorebox.length; i++){
            handleArray.push(showMorebox[i]);
        }
        if(handleArray[index] === "false"){
            handleArray[index] = "true";
        }
        else{
            handleArray[index] = "false";
        }

        setShowMorebox(handleArray); 
    }

    useEffect(() => {
        function handleClickOutside(e){    
            for(let i=0; i<moreboxRef.current.length; i++){
                if(moreboxRef.current[i] && !moreboxRef.current[i].contains(e.target)) {
                    if(moreIconRef.current[i].contains(e.target)){
                    }
                    else{
                        handleShowMoreBox(i); 
                    }
                }

            }
        }

        document.addEventListener("mousedown", handleClickOutside);
    }, [moreboxRef, moreIconRef]);

    return (
        <>
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} count={delCount} page={"playerlistDel"}/> }
        { likeyBannerOn !== 0 && <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"track"}/> }

        <div>
            <Player listenMusic={listenMusic} showPlaylistFunc={showPlaylistFunc} handleRender={handleRender} delLikeyFunc={delLikeyFunc} addLikeyFunc={addLikeyFunc}/>
        </div>

        <StyledPlaylist $showval={listenMusic.length === 0? true : showPlaylist} $img={listenMusic.org_cover_image}>
            <div className="blur-box">
                <div className="flex items-center justify-center">
                    {
                        listenMusic.length === 0?
                        <div className="col-7">
                            <div className="text-center">
                                <p className="text-gray-light text-[22px] font-light-bold mb-[30px]" onClick={() => showPlaylistFunc()}>재생목록이 비어있습니다.</p>
                                <div className="w-[350px] h-[350px] m-auto rounded-[20px] bg-gray"></div>
                            </div>
                        </div>
                        :
                        <div className="col-7">
                            <div className="text-center">
                                <p className="text-white text-[22px] font-bold mb-[10px]" onClick={() => showPlaylistFunc()}><Link to={"/detail/track/" + listenMusic.music_id + "/details"}>{listenMusic.music_title}</Link></p>
                                <p className="text-gray-500 text-[14px] mb-[15px]" onClick={() => showPlaylistFunc()}><Link to={"detail/artist/" + listenMusic.artist_id + "/artisttrack"}>{listenMusic.artist_name}</Link></p>
                                <img src={"/image/album/" + listenMusic.org_cover_image} alt="cover_image" className="w-[350px] h-[350px] m-auto rounded-[20px]"  />
                            </div>
                        </div>
                    }
                    <div className="col-5 mt-[100px] pr-[100px]">
                        <div>
                            <div className="flex justify-between border-b-[1px] border-b-gray-500 mb-[15px]">
                                <div className="flex">
                                    <p className="text-white border-b-[2px] border-b-[#3f3fff] mr-[20px] cursor-pointer">음악</p>
                                </div>
                            </div>
                            {
                                editMode?
                                <div className="flex justify-between items-center mb-[5px] mt-[15px]">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="" checked={checkAll} onClick={selectCheckAll} readOnly/>
                                        <p className="text-gray text-[14px] ml-[10px] cursor-pointer hover:text-white">전체선택</p>
                                    </div>
                                    <p className="text-gray text-[14px] mr-[10px] cursor-pointer hover:text-white" onClick={() => setEditMode(false)}>완료</p>
                                </div>
                                :
                                <div className="flex items-center justify-end mb-[5px] mt-[15px]">
                                    <p className="text-gray text-[14px] mr-[15px] cursor-pointer hover:text-white">내 리스트 가져오기</p>
                                    <p className="text-gray text-[14px] mr-[10px] cursor-pointer hover:text-white" onClick={() => setEditMode(true)}>편집</p>
                                </div>
                            }
                        </div>
                        <div className="h-[600px] overflow-scroll">
                            { modalOpen && <MylistSelectModal clickToSelectdelAllPlaylist={selectCheckdel} handleDeleteConfirm={delplayerlist}/> }
                            {
                                playerMusic.map((item, index) => (
                                    <div key={index} className="flex my-[20px] items-center">
                                        {
                                            editMode &&
                                            <input type="checkbox"  readOnly className="col-2 mr-[10px]" checked={item.checked} id={item.music_id} onChange={(e) => selectCheck(e, index)} />

                                        }
                                        <img src={"/image/album/" + item.org_cover_image} alt="cover_image" className="w-[50px] h-[50px] rounded-[5px]" />
                                        <div onClick={(e) => changeMusicFunc(e, item)} className="col-10 cursor-pointer pl-[15px]">
                                            <p className="text-white text-[15px]">{item.music_title}</p>
                                            <p className="text-gray-400 text-[11px]">{item.artist_name}</p>
                                        </div>
                                        
                                        <div className="col-1" ref={(element) => {moreIconRef.current[index] = element}}><RiMore2Line className="text-gray-400 text-[22px] cursor-pointer relative" onClick={(e) => handleShowMoreBox(index)} />
                                        {
                                            showMorebox[index] === "true" &&
                                            <Styledlist ref={(element) => {moreboxRef.current[index] = element}}>
                                                <ul>
                                                    <li onClick={showPlaylistFunc}><Link to={"/detail/track/"+item.music_id+"/details"} className="flex items-center"><RiMusic2Line /><p>곡 정보</p></Link></li>
                                                    <li onClick={showPlaylistFunc}><Link to={"/detail/album/"+item.album_id+"/albumtrack"} className="flex items-center"><RiAlbumLine /><p>앨범 정보</p></Link></li>
                                                    <li onClick={showPlaylistFunc}><Link to={"/detail/artist/"+item.artist_id+"/track?sortType=POPULARITY"} className="flex items-center"><RiMicLine /><p>아티스트 정보</p></Link></li>
                                                        {
                                                            item.likey === true ?
                                                            <li className="flex items-center cursor-pointer" onClick={() => delLikeyFunc(item.music_id)}><RiHeart3Fill className="text-blue"/><p>종아요</p></li>
                                                            :
                                                            <li className="flex items-center cursor-pointer" onClick={() => addLikeyFunc(item.music_id)}><RiHeart3Line /><p>종아요</p></li>
                                                        }
                                                    <li onClick={(e) => delPlayerlistFunc(e, item.music_id)}><Link to="#" className="flex items-center"><RiProhibitedLine /><p>삭제</p></Link></li>
                                                </ul>
                                            </Styledlist>
                                        }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </StyledPlaylist>
        </>
    )
}

const StyledPlaylist = styled.div`
    -webkit-scrollbar, 
    div::-webkit-scrollbar{
        display: none;
    }

    position: fixed;
    top: 0;
    z-index: 10001;
    width: 100%;
    height: 100%;
    background-image: ${(props) => "url(/image/album/"+props.$img+")"};
    background-size: 90% 90%;

    transform: ${(props) => props.$showval? "translateY(100%)" : "translateY(0%)"};
    transition: 0.5s;

    .blur-box{
        width: 100%;
        height: 100%;
        background-color: rgba(10, 10, 10, 0.8);
        backdrop-filter: blur(50px);
    }

    input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        border: 1px solid #999;
        appearance: none;
        cursor: pointer;
        transition: background 0.2s;
      }
    
      input[type="checkbox"]:checked {
        background: var(--main-theme-color);
        border: none;

      }
`

export const Styledlist = styled.div`
    position: sticky;
    // position: absolute;
    // box-shadow: 0 0 30px 5px #efefef;
    width: 200px;
    right: 150px;
    z-index: 100;

    
    ul{
        position: absolute;
        z-index: 100;
        background-color: white;
        width: 200px;
        right: 150px;
        border-radius: 7px;
        right: 200px;
    }

    ul>li:first-child{
        padding-left: 15px;
        padding-top: 15px;
        padding-bottom: 8px;
    }

    li{
        padding-left: 15px;
        padding-top: 8px;
        padding-bottom: 8px;
    }

    ul>li:last-child{
        padding-left: 15px;
        padding-top: 8px;
        padding-bottom: 15px;
    }

    ul>*{
        font-size: 14px;
        color: gray;
    }

    li p{
        margin-left: 10px;
    }

    li:hover{
        color: var(--main-theme-color);
    }
`
export default Playlist