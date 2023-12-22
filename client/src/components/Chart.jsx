import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import { StyledDetail } from './Track';
import { Cookies } from 'react-cookie';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import MusicListTable from '../card/MusicListTable';
import PlayerBanner from '../card/PlayerBanner';
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import { AppContext } from '../App'
import { playerAddGenre } from '../procedure/playerAddButton';

//승렬
import { MusicListCardAddMyListButton as AddMyListButton } from '../style/StyledIcons';
import { MusicListCardAddPlaylistButton as AddPlaylistButton } from '../style/StyledIcons';
import { TinyPlayButton as PlayButton } from '../style/StyledIcons';

function Chart({genre_id, handleRender}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));
    
    const [chartinfo, setChartinfo] = useState([]);
    const [chartlist, setChartlist] = useState([]);
    const [firstchartImg, setFirstchartImg] = useState("");
    const [totalNum, setTotalNum] = useState(0)

    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    let array = [];


    // 2023-12-01 album 플레이어 추가
    function playerAdd(){
        let array = [];

        for(let i=0; i<chartlist.length; i++){
            array.push(chartlist[i].music_id)
        }

        Axios.post("/playerHandle/playerAdd", {
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

    
    useEffect(() => {

        if(isSessionValid){
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

        Axios.get("/ezenmusic/detail/chartinfo/"+genre_id)
        .then(({data}) => {
            setChartinfo(data);
            
            Axios.get("/ezenmusic/detail/chart/"+genre_id)
            .then(({data}) => {
                ///// data에 좋아요 추가하는 부분
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
                ////////////////////////////////

                setChartlist(data);
                setFirstchartImg(data[0].org_cover_image);
                setTotalNum(data.length);
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    
    ////////// 건우 //////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);
    
    let music_list_array = []
    for(let i = 0; i < chartlist.length; i++){
        music_list_array.push(chartlist[i].music_id);
    }
    
    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    const clickPlaylistModalOpen = (e) =>{
        e.preventDefault();
        setPlaylistModalData({
            music_id: music_list_array,
            album_title: null,
            thumbnail_image: null,
            theme_playlist: null,
        });
        setPlaylistModalOpen(true);
    }
    ///////////////////////////////

    

    return (
        <>
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
        { playlistModalOpen && <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} setAddPlaylistBannerOn={setAddPlaylistBannerOn}/> }
        {/* 플레이리스트 추가 베너 */}
        { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }

        {
            chartinfo.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div className="mb-[40px]">
                        <div className="flex items-center p-[30px]">
                            <div className='relative'>
                                <div className='w-[230px] h-[230px] rounded-[6px] hover:brightness-75 overflow-hidden border-1 M-img-border'>
                                    {firstchartImg !== "" && <img src={"/image/album/"+firstchartImg} alt="cover_image" className="w-[230px] h-[230px] rounded-[6px]" />}
                                </div>
                                <PlayButton onClick={isSessionValid?  ()=>{playerAddGenre("mainbanner_genre", item.area, item.genre, handleRender, setPlayerBannerOn); } : () => setLoginrRequestVal(true)}></PlayButton>
                            </div>
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.description}</p>
                                <p className="font-normal">총 {totalNum}곡</p>
                                <div className="flex mt-[30px] ml-[-9px]">
                                    <AddPlaylistButton onClick={isSessionValid? () => playerAdd() : () => setLoginrRequestVal(true)}></AddPlaylistButton>
                                    <AddMyListButton onClick={isSessionValid? (e) => clickPlaylistModalOpen(e) : () => setLoginrRequestVal(true)}></AddMyListButton>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="mb-[40px]">
                    </div>
                </StyledDetail>
            ))
        }

        <MusicListTable page="chart" lank={false} music_list={chartlist} handleRender={handleRender}/>
        
        </>
    )
}

export default Chart