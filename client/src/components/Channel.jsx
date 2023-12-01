import React, {useState, useEffect} from 'react'
import Axios from "axios"
import { StyledBrowser } from '../pages/Browse';
import {StyledDetail} from "../components/Track"
import { RiPlayLine, RiPlayListAddFill, RiFolderAddLine, RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';
import MusicListHeader from '../card/MusicListHeader';
import { Link } from 'react-router-dom';
import Comments from './Comments';
import { Cookies } from "react-cookie";
import AllCheckedModal from '../modal/AllCheckedModal';
import LikeyBanner from '../card/LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import MusicListTable from '../card/MusicListTable';
import PlayerBanner from '../card/PlayerBanner';
import icons from '../assets/sp_button.6d54b524.png'
import PlaylistAdd from '../modal/PlaylistAdd';

function Channel({num, details, handleRender}) {
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


    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    let array = [];
    let array2 = [];

    function HandleLikey(){
        setIslikey(islikey => {return !islikey})
    }


    function addLikeTheme(){
        Axios.post("http://localhost:8080/ezenmusic/addlikey", {
            userid: userid_cookies,
            id: num,
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
        Axios.post("http://localhost:8080/ezenmusic/dellikey", {
            userid: userid_cookies,
            id: num,
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
    function playerAdd(){
        let array = [];

        for(let i=0; i<channelMusic.length; i++){
            array.push(channelMusic[i].id)
        }

        Axios.post("http://localhost:8080/playerhandle/playerAdd", {
            userid: userid_cookies,
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

    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e, num) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: null,
            album_title: null,
            thumbnail_image: null,
            theme_playlist: num
        });
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////


    useEffect(() => {
        if(!details){
            setInitNum("");
        }
        
        if(userid_cookies !== undefined){
            Axios.post("http://localhost:8080/ezenmusic/detail/album_theme/likey", {
                userid: userid_cookies,
                division: "liketheme"
            })
            .then(({data}) => {
                array2 = data;
                
                // 테마리스트 좋아요 되어있는지 검증
                for(let i=0; i<array2.length; i++){
                    if(array2[i] === Number(num)){
                        setIslikey(!islikey);
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
    
            Axios.post("http://localhost:8080/ezenmusic/allpage/likeylist/", {
                userid: userid_cookies,
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

        Axios.get("http://localhost:8080/ezenmusic/channelinfo/"+num)
        .then(({data}) => {
            setChannelInfo(data);
        })
        .catch((err) => {
            console.log(err);
        })

        Axios.get("http://localhost:8080/ezenmusic/channel/"+num)
        .then(({data}) => {        
            for(let i=0; i<data.length; i++){
                // object 에 likey 라는 항목 넣고 모두 false 세팅
                data[i].likey = false;
            }

            // userid_cookies 없으면 for 문을 안돌면서 true 값 저장안됨.
            for(let i=0; i<array.length; i++){
                for(let j=0; j<data.length; j++){
                    if(array[i] === Number(data[j].id)){
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
            <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal}/>
            :
            ""
        }
        {
            playerBannerOn?
            <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"channel"} />
            :
            ""
        }
        {
            
            channelInfo.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div className="mb-[40px]">
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/themeplaylist/"+item.org_cover_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[25px]" />
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.themetitle}</p>
                                <p className="text-[14px] text-gray mb-[20px]">{item.description}</p>  
                                <p>총 {totalMusicNum}곡</p>
                                <p className="text-[14px] text-gray">{item.release_date_format}</p>
                                <div className="flex mt-[30px] ">
                                    <button className="artist_listplus ml-[-10px]" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? playerAdd : setLoginrRequestVal}></button>
                                    <button className="artist_box " style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? (e) => clickPlaylistModalOpen(e, item.num) : setLoginrRequestVal}></button>
                                    {
                                        islikey?
                                        <button className="redheart" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? delLikeTheme : setLoginrRequestVal}></button>
                                        :
                                        <button className="iconsheart" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? addLikeTheme : setLoginrRequestVal}></button>
                                    }    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="mb-[40px]">
                        {
                            initNum === ""?
                                <div>
                                    <Link to={"/detail/channel/" + item.num + ""} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("")}>곡</Link>
                                    <Link to={"/detail/channel/" + item.num + "/comments"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("comments")}>댓글</Link>
                                </div>
                                :
                                <div>
                                    <Link to={"/detail/channel/" + item.num + ""} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("")}>곡</Link>
                                    <Link to={"/detail/channel/" + item.num + "/comments"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray font-normal" onClick={(e) => setInitNum("comments")}>댓글</Link>
                                </div>

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