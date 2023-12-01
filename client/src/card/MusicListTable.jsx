import React, {useEffect, useState} from 'react'
import MusicListHeader from './MusicListHeader'
import MusicListCard from './MusicListCard'
import LikeyBanner from './LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import AllCheckedModal from '../modal/AllCheckedModal';
import PlaylistAdd from '../modal/PlaylistAdd';
import styled from 'styled-components';
import { RiPlayLine, RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { IoPlayOutline } from "react-icons/io5";
import PlayerBanner from './PlayerBanner';

function MusicListTable({page, lank, music_list, handleRender, showMore, browseCheckAll, handleLikeypage}) {
    // 좋아요 누를 때 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 전체선택
    const [allcheckVal, setAllcheckVal] = useState(false);

    // 선택한 노래들 정보 저장
    const [selectedMusicList, setSelectedMusicList] = useState([]);

    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);
    const [addplayerCount, setAddplayerCount] = useState(0);


    // // 더보기 (Browse)
    // const [showMore, setShowMore] = useState(false);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);

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
    ///////////////////////////////

    useEffect(() => {
        // 전체 선택 체크
        if(allcheckVal === true){
            let array = [];
            // selectedMusicList 에 전체 저장
            for(let i=0; i<music_list.length; i++){
                array.push(music_list[i].id);
            }
            setSelectedMusicList(array);
        }
        else{
            setSelectedMusicList([]);
        }
    }, [allcheckVal])


    function selectMusic(e){
        let array = [];

        for(let i=0; i<selectedMusicList.length; i++){
            array.push(selectedMusicList[i]);
        }
        if(selectedMusicList.length == 0){
            array.push(e.target.id);
        }
        else{
            if(e.target.checked == true){
                array.push(e.target.id);
            }
            else{
                for(let i=0; i<array.length; i++){
                    if(array[i] == e.target.id){
                        array.splice(i, 1);
                    }
                }
            }
        }
        setSelectedMusicList(array);
    }

    useEffect(() => {
        if(browseCheckAll !== undefined){
            setAllcheckVal(browseCheckAll);
        }
    }, [music_list])

    return (
    <div>
        {
            playerBannerOn?
            <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} count={addplayerCount} />
            :
            ""
        }
        
        {/* 좋아요 추가하면 나오는 베너 */}
        <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"track"}/>
        
        {/* 로그인 해주세요 모달 */}
        {
            loginRequestVal?
            <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} />
            :
            ""
        }
        {
            allcheckVal ?
            <AllCheckedModal setAllcheckVal={setAllcheckVal} selectedMusicList={selectedMusicList} handleRender={handleRender} setPlayerBannerOn={setPlayerBannerOn} setAddplayerCount={setAddplayerCount}/>
            :
            <>
                {
                    selectedMusicList.length > 0?
                    <AllCheckedModal setAllcheckVal={setAllcheckVal} selectedMusicList={selectedMusicList} handleRender={handleRender} setPlayerBannerOn={setPlayerBannerOn} setAddplayerCount={setAddplayerCount} />
                    :
                    ""
                }
            </>
        }
        {
            playlistModalOpen?
            <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal}/>
            :
            ""
        }
            <StyledBrowser className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
                <div className="mb-3 flex items-center justify-between">
                    {
                        page === "browse"?
                    <div className="flex items-center">
                        <p className="chart-title">EzenMusic 차트</p>
                        <p className="text-slate-400 text-[12px] ml-[10px]">24시간 집계 (16시 기준)</p>
                    </div>
                    :
                    ""
                    }
                    <div className="all-play-box flex cursor-pointer text-black hover-text-blue items-center">
                        <IoPlayOutline className="all-play-icon text-black mr-[3px] mt-[1px]"/>
                        <p>전체듣기</p>
                    </div>
                </div>
            <hr className="text-gray"/>
            <table className="table table-hover">
            <MusicListHeader lank={lank} setAllcheckVal={setAllcheckVal} allcheckVal={allcheckVal} />
            <tbody>
                {
                    page === "browse"?
                    <>
                    {
                        music_list.map((item, index) => (
                            <MusicListCard key={index} lank={index+1} title={item.title} album_title={item.album_title} artist_num={item.artist_num} 
                            artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} 
                            setAllcheckVal={setAllcheckVal} selectMusic={selectMusic}
                            likey={item.likey} setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} clickPlaylistModalOpen={clickPlaylistModalOpen}
                            setLoginrRequestVal={setLoginrRequestVal}  setPlayerBannerOn={setPlayerBannerOn} setAddplayerCount={setAddplayerCount}/>
                        ))
                    }
                    </>
                    :
                    <>
                    {
                        music_list.map((item, index) => (
                            <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} 
                            img={item.org_cover_image} music_id={item.id} album_id={item.album_id} likey={item.likey} check_all={allcheckVal} 
                            setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} clickPlaylistModalOpen={clickPlaylistModalOpen}
                            setLoginrRequestVal={setLoginrRequestVal}  handleLikeypage={handleLikeypage} selectMusic={selectMusic}  setPlayerBannerOn={setPlayerBannerOn}
                            setAddplayerCount={setAddplayerCount}/>
                        ))
                    }
                    </>
                }
                {/* {
                    page === "browse"?
                    <>
                    {
                        showMore?
                        music_list.map((item, index) => (
                            <MusicListCard key={index} lank={index+1} title={item.title} album_title={item.album_title} artist_num={item.artist_num} 
                            artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} 
                            setAllcheckVal={setAllcheckVal}
                            likey={item.likey} setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} clickPlaylistModalOpen={clickPlaylistModalOpen}
                            setLoginrRequestVal={setLoginrRequestVal}/>
                        ))
                        :
                        music_list.map((item, index) => (
                            <MusicListCard key={index} lank={index+1} title={item.title} album_title={item.album_title} artist_num={item.artist_num} 
                            artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} 
                            setAllcheckVal={setAllcheckVal}
                            likey={item.likey} setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} clickPlaylistModalOpen={clickPlaylistModalOpen}
                            setLoginrRequestVal={setLoginrRequestVal}/>
                        )).filter((item, index) => (index < 10))
                    }
                    </>
                    :
                    <>
                    {
                        music_list.map((item, index) => (
                            <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} 
                            img={item.org_cover_image} music_id={item.id} album_id={item.album_id} likey={item.likey} check_all={allcheckVal} 
                            setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender} clickPlaylistModalOpen={clickPlaylistModalOpen}
                            setLoginrRequestVal={setLoginrRequestVal}  handleLikeypage={handleLikeypage} selectMusic={selectMusic}/>
                        ))
                    }
                    </>
                } */}
            </tbody>
        </table>
        </StyledBrowser>
    </div>
    )
}

export const StyledBrowser = styled.div`
    // width: 1440px;
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
        font-size: 16px;
        color: var(--main-text-gray);
    }

    tbody>*{
        color: var(--main-text-gray);
    }
`;
export default MusicListTable



{/* <StyledBrowser className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
                <div className="mb-3">
                    <div className="flex items-center cursor-pointer">
                        <RiPlayLine className="all-play-icon absolute top-[2px] left-[0px]"/>
                        <p className="ml-[25px] text-[14px] text-gray">전체듣기</p>
                    </div>
                </div> */}


                // <StyledBrowser className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
                // <div className="mb-3">
                //     <div className="flex items-center">
                //         <p className="chart-title">EzenMusic 차트</p>
                //         <p className="text-slate-400 text-[12px] ml-[10px]">24시간 집계 (16시 기준)</p>
                //     </div>
                //     <div className="all-play-box absolute top-0 right-0 flex cursor-pointer">
                //         <RiPlayLine className="all-play-icon absolute top-[2px] right-[55px]"/>
                //         <p>전체듣기</p>
                //     </div>
                // </div>