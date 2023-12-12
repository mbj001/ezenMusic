import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';
import styled from 'styled-components';
import Details from './Details';
import Similar from './Similar';
import LikeyBanner from '../card/LikeyBanner';
import { userid_cookies } from '../config/cookie';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import PlayerBanner from '../card/PlayerBanner';
import icons from '../assets/sp_button.6d54b524.png'
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';

function Track({music_id, details, handleRender}) {

    const [detailMusic, setDetailMusic] = useState([]);
    const [initNum, setInitNum] = useState();
    const [islikey, setIslikey] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    let array = [];

    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    if(!initNum){
        setInitNum(details);
    }

    function handleLikey(){
        setIslikey(islikey => {return !islikey})
    }

    function addLikeTrack(){
        Axios.post("/ezenmusic/addlikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            handleLikey();
            setLikeyBannerOn(1)
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeTrack(){
        Axios.post("/ezenmusic/dellikey", {
            character_id: userid_cookies,
            id: music_id,
            division: "liketrack"
        }
        )
        .then(({data}) => {
            handleLikey();
            setLikeyBannerOn(-1); 
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    
    // 2023-12-01 channel 플레이어 추가
    function playerAdd(){
        let array = [];
        array.push(music_id);

        Axios.post("/playerHandle/playerAdd", {
            character_id: userid_cookies,
            music_list: array
        })
        .then(({data}) => {
            setPlayerBannerOn(true);
            handleRender();
        })
        .catch((err) => {
            console.log(err);
        })
    }


    //////////// 건우 ////////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, music_id, img) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: music_id,
            album_title: null,
            thumbnail_image: img,
            theme_playlist: null
        });
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////

    
    useEffect(() => {
        if(userid_cookies !== undefined){
            Axios.post("/ezenmusic/likey/liketrack", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                array = data;
                Axios.get("/ezenmusic/detail/" + music_id)
                .then(({data}) => {
                    data[0].likey = false;
                    for(let i=0; i<array.length; i++){
                        if(Number(data[0].music_id) === array[i]){
                            data[0].likey = true;
                            setIslikey(() => {return true});
                            // setIslikey(!islikey);
                        }
                    }
        
                    setDetailMusic(data);
                })
                .catch((err) => {
                    {}
                })
            })
            .catch((err) => {
                console.log(err);
            })
        }
        
        else{
            Axios.get("/ezenmusic/detail/" + music_id)
            .then(({data}) => {
                data[0].likey = false;
                for(let i=0; i<array.length; i++){
                    if(Number(data[0].music_id) === array[i]){
                        data[0].likey = true;
                        setIslikey(() => {return true});
                        // setIslikey(!islikey);
                    }
                }
    
                setDetailMusic(data);
            })
            .catch((err) => {
                {}
            })
        }
        setInitNum(details);
    
    }, [])
    
    return (
        <>
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"channel"} /> }
        { playlistModalOpen && <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal}  setAddPlaylistBannerOn={setAddPlaylistBannerOn}/> }
        {/* 플레이리스트 추가 베너 */}
        { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        { likeyBannerOn !== 0 && <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"track"}/> }
        {/* 로그인 해주세요 모달 */}
        { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }

        {
            detailMusic.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div>
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/album/"+item.org_cover_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[10px]" />
                            <div className="m-[30px]">
                                <Link to={"/detail/album/" + item.album_id + "/albumtrack"}><p className="detail-title mb-[10px] hover-text-blue">{item.music_title}</p></Link>
                                <Link to={"/detail/artist/"+item.artist_id+"/artisttrack"}><p className="font-normal hover-text-blue">{item.artist_name}</p></Link>
                                <Link to={"/detail/album/" + item.album_id + "/albumtrack"}><p className="font-light text-gray hover-text-blue">{item.album_title}</p></Link>
                                <div className="flex mt-[30px] ">

                                    <button className="artist_listplus ml-[-10px]" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? (e) => playerAdd() : (e) => setLoginrRequestVal(true)}></button>
                                    <button className="artist_box " style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? (e) => clickPlaylistModalOpen(e, music_id, item.org_cover_image) : (e) => setLoginrRequestVal(true)}></button>
                                    {
                                        islikey?
                                        <button className="redheart" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? (e) => delLikeTrack() : (e) => setLoginrRequestVal(true)}></button>
                                        :
                                        <button className="iconsheart" style={{backgroundImage:`url(${icons})`}}  onClick={userid_cookies? (e) => addLikeTrack() : (e) => setLoginrRequestVal(true)}></button>
                                    }    

                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="mb-[40px]">
                        {
                            initNum === "details" || initNum === undefined?
                                <div>
                                    <Link to={"/detail/track/" + item.music_id + "/details"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("details")}>상세정보</Link>
                                    <Link to={"/detail/track/" + item.music_id + "/similar"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("similar")}>유사곡</Link>
                                </div>
                                :
                                <div>
                                    <Link to={"/detail/track/" + item.music_id + "/details"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("details")}>상세정보</Link>
                                    <Link to={"/detail/track/" + item.music_id + "/similar"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("similar")}>유사곡</Link>
                                </div>

                        }
                    </div>
                    {
                        initNum === "details"?
                            <Details music_id={item.music_id} music_title={item.music_title} composer={item.composer} lyricist={item.lyricist} arranger={item.arranger} lyrics={item.lyrics}/>
                            :
                            <Similar genre={item.genre} music_id={item.music_id} handleRender={handleRender}/>
                    }
                </StyledDetail>
            ))
        }
        </>
    )
}

export default Track

export const StyledDetail = styled.div`
    // width: 1440px;
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
`