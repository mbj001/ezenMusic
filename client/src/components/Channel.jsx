import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import {StyledDetail} from "../components/Track"
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { Cookies } from 'react-cookie';
import LikeyBanner from '../card/LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import MusicListTable from '../card/MusicListTable';
import PlayerBanner from '../card/PlayerBanner';
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import { AppContext } from '../App'

//승렬
import { MusicListCardAddMyListButton as AddMyListButton } from '../style/StyledIcons';
import { MusicListCardAddPlaylistButton as AddPlaylistButton } from '../style/StyledIcons';
import { ArtistLikeButton as LikeButton } from '../style/StyledIcons';
import { ArtistFilledHeartButton as FilledHeart } from '../style/StyledIcons';
import { TinyPlayButton as PlayButton } from '../style/StyledIcons';

function Channel({themeplaylist_id, details, handleRender}) {
    
    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));
    
    // 테마리스트 정보
    const [channelInfo, setChannelInfo] = useState([]);
    // 테마리스트 안의 곡들
    const [channelMusic, setChannelMusic] = useState([]);
    // 곡 or 댓글
    const [initNum, setInitNum] = useState(details);
    // 전체 곡 수
    const [totalMusicNum, setTotalMusicNum] = useState(-1);
    // 테마리스트 좋아요 클릭 베터
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 테마리스트 좋아요
    const [islikey, setIslikey] = useState(false);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);



    let array = [];
    let array2 = [];

    function HandleLikey(){
        setIslikey(islikey => {return !islikey})
    }


    function addLikeTheme(){
        Axios.post("/ezenmusic/addlikey", {
            character_id: userid_cookies,
            id: themeplaylist_id,
            division: "liketheme"
        })
        .then(({data}) => {
            HandleLikey();
            setLikeyBannerOn(1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeTheme(){
        Axios.post("/ezenmusic/dellikey", {
            character_id: userid_cookies,
            id: themeplaylist_id,
            division: "liketheme"
        })
        .then(({data}) => {
            HandleLikey();
            setLikeyBannerOn(-1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    // 2023-12-01 channel 플레이어 추가
    function playerAdd(change_now_play){
        let array = [];

        for(let i=0; i<channelMusic.length; i++){
            array.push(channelMusic[i].music_id)
        }

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            music_list: array,
            change_now_play: change_now_play
        })

        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, themeplaylist_id) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: null,
            album_title: null,
            thumbnail_image: null,
            theme_playlist: themeplaylist_id
        });
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////


    useEffect(() => {
        if(!details){
            setInitNum("");
        }
        
        if(isSessionValid){
            Axios.post("/ezenmusic/detail/album_theme/likey", {
                character_id: userid_cookies,
                division: "liketheme"
            })
            .then(({data}) => {
                array2 = data;
                
                // 테마리스트 좋아요 되어있는지 검증
                for(let i=0; i<array2.length; i++){
                    if(array2[i] === Number(themeplaylist_id)){
                        setIslikey(!islikey);
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
    
            Axios.post("/ezenmusic/allpage/likeylist/", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                if(data === -1){

                }
                else{
                    array = data[0].music_list;
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }

        Axios.get("/ezenmusic/channelinfo/"+themeplaylist_id)
        .then(({data}) => {
            setChannelInfo(data);
        })
        .catch((err) => {
            console.log(err);
        })

        Axios.get("/ezenmusic/channel/"+themeplaylist_id)
        .then(({data}) => {        
            for(let i=0; i<data.length; i++){
                // object 에 likey 라는 항목 넣고 모두 false 세팅
                data[i].likey = false;
            }

            // userid_cookies 없으면 for 문을 안돌면서 true 값 저장안됨.
            for(let i=0; i<array.length; i++){
                for(let j=0; j<data.length; j++){
                    if(array[i] === Number(data[j].music_id)){
                        // 좋아요 해당 object 의 값 true 로 변경
                        data[j].likey = true;
                    }
                }
            }

            setChannelMusic(data);
            setTotalMusicNum(data.length);
        })
        .catch((err) => {
            console.log(err);
        })

    }, [])

    return (
        <>
        {
            playlistModalOpen?
            <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} setAddPlaylistBannerOn={setAddPlaylistBannerOn}/>
            :
            ""
        }
        {/* 플레이리스트 추가 베너 */}
        { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"channel"} /> }
        {
            
            channelInfo.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div className="mb-[40px]">
                        <div className="flex items-center p-[30px]">
                            <div className='relative'>
                                <div className='w-[230px] h-[230px] rounded-[6px] hover:brightness-75 overflow-hidden border-1 M-img-border'>
                                    <img src={"/image/themeplaylist/"+item.org_cover_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[6px]"/>
                                </div>
                                <PlayButton onClick={isSessionValid ? ()=>{playerAdd(true);} : () => setLoginrRequestVal(true)}></PlayButton>
                            </div>
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.themeplaylist_title}</p>
                                <p className="text-[14px] text-gray mb-[20px]">{item.description}</p>  
                                <p>총 {totalMusicNum}곡</p>
                                <p className="text-[14px] text-gray">{item.release_date_format}</p>
                                <div className="flex mt-[30px] ml-[-9px]">
                                    <AddPlaylistButton onClick={isSessionValid? () => playerAdd(false) : () => setLoginrRequestVal()}></AddPlaylistButton>
                                    <AddMyListButton onClick={isSessionValid? (e) => clickPlaylistModalOpen(e, item.themeplaylist_id) : () => setLoginrRequestVal()}></AddMyListButton>
                                    {
                                        islikey?
                                        <FilledHeart onClick={isSessionValid? () => delLikeTheme() : () => setLoginrRequestVal()}></FilledHeart>
                                        :
                                        <LikeButton onClick={isSessionValid? () => addLikeTheme() : () => setLoginrRequestVal()}></LikeButton>
                                    }    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="mb-[40px]">
                        {
                            // initNum === ""?
                            //     <div>
                            //         <Link to={"/detail/channel/" + item.themeplaylist_id + ""} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("")}>곡</Link>
                            //         {/* <Link to={"/detail/channel/" + item.themeplaylist_id + "/comments"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("comments")}>댓글</Link> */}
                            //     </div>
                            //     :
                            //     <div>
                            //         <Link to={"/detail/channel/" + item.themeplaylist_id + ""} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("")}>곡</Link>
                            //         {/* <Link to={"/detail/channel/" + item.themeplaylist_id + "/comments"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("comments")}>댓글</Link> */}
                            //     </div>

                        }
                    </div>
                </StyledDetail>
            ))
        }
            <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"theme"}/>
            { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
        {
            initNum ===""?
                <MusicListTable page="channel" lank={false} music_list={channelMusic} handleRender={handleRender}/>

            :
            <Comments />
        }
    </>
    )
}

export default Channel