import React, {useState, useEffect, useContext} from 'react'
import Axios from 'axios'
import styled from 'styled-components';
import LikeyBanner from '../card/LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import PlayerBanner from '../card/PlayerBanner';
import PlaylistAdd from '../modal/PlaylistAdd';
import AddPlaylistBanner from '../card/AddPlaylistBanner';
import { Cookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import ArtistAlbumCard from '../card/ArtistAlbumCard';
import { AppContext } from '../App'
function ArtistAlbum({artist_id, handleRender, sortType}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));
    
    const [artistAlbum, setArtistAlbum] = useState([]);
    
    // 좋아요 베너
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    let array = [];
    
    //////////// 건우 ////////////
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [playlistModalData, setPlaylistModalData] = useState([]);
    const [addPlaylistBannerOn, setAddPlaylistBannerOn] = useState(false);

    function handleplaylistModal(){
        setPlaylistModalOpen(playlistModalOpen => {return !playlistModalOpen;})
    }

    ///////////////////////////////

    
    useEffect(() => {
        let album_array = [];

        Axios.post("/ezenmusic/detail/artist/album", {
            sortType: sortType,
            artist_id: artist_id
        })
        .then(({data}) => {
            for(let i=0; i<data.length; i++){
                album_array.push(data[i]);
                album_array[i].likey = false;
            }
            if(isSessionValid){
                Axios.post("/ezenmusic/allpage/likeylist/", {
                    character_id: userid_cookies,
                    division: "likealbum"
                })
                .then(({data}) => {
                    if(data === -1){
    
                    }
                    else{                   
                        for(let i=0; i<data[0].music_list.length; i++){
                            for(let j=0; j<album_array.length; j++){
                                if(data[0].music_list[i] === album_array[j].album_id){
                                    album_array[j].likey = true;
                                    break;
                                }
                            }
                        }
                    }
                    // console.log(album_array);
                    setArtistAlbum(album_array);
                })
                .catch((err) => {
                    console.log(err)
                })
            }
            else{
                setArtistAlbum(album_array);
            }
        })
        .catch((err) => {
            console.log(err);
        })
        
    },[sortType])

    return (
        <>
        { playlistModalOpen && <PlaylistAdd setPlaylistModalOpen={setPlaylistModalOpen} playlistModalData={playlistModalData} handleplaylistModal={handleplaylistModal} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        {/* 플레이리스트 추가 베너 */}
        { addPlaylistBannerOn && <AddPlaylistBanner addPlaylistBannerOn={addPlaylistBannerOn} setAddPlaylistBannerOn={setAddPlaylistBannerOn} /> }
        { playerBannerOn && <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} /> }
        { likeyBannerOn !== 0 && <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"album"} /> }
        { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
        {/* ~ modal */}
        <div className='mx-auto md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
            <div className="">
                    <ButtonBox>
                        <Link to={"/detail/artist/"+artist_id+"/album?sortType=RECENT"}>
                            <span className={ sortType === "RECENT" ? "text-[11px] text-blue" : "text-[11px]"}>최신순</span>
                        </Link>
                        <Link to={"/detail/artist/"+artist_id+"/album?sortType=POPULARITY"}>
                            <span className={ sortType === "POPULARITY" ? "text-[11px] text-blue mx-[15px]" : "text-[11px] mx-[15px]"}>인기순</span>
                        </Link>
                        <Link to={"/detail/artist/"+artist_id+"/album?sortType=WORD"}>
                            <span className={ sortType === "WORD" ? "text-[11px] text-blue" : "text-[11px]"}>가나다순</span>
                        </Link>
                    </ButtonBox>
                
                    <AlbumCover>
                        <ArtistAlbumCard artistAlbum={artistAlbum} setArtistAlbum={setArtistAlbum} handleRender={handleRender}/>
                    </AlbumCover>
            </div>

        </div>
        </>
    )
}
//승렬
export const ButtonBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: end;

    button{
        color: #333;
        font-size: 13px;
        margin-right: 8px;
        &:hover{
            color: var(--main-theme-color);
        }
    }
`;
export const AlbumCover = styled.ul`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

// 승렬
const EachLiBox = styled.li`
    margin: 20px 0;

    div{
        .album-cover-image{
            width: 175px;
            heigth: 175px;
            border-radius: 6px;
            overflow: hidden;
            a{
                width: 100%;
                height: 100%;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .album-info{
            width: 220px;
            height: 175px;
            padding-left: 20px;
            .album-title{
                width: 100%;
                font-size: 15px;
                font-weight: 700;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                margin-top: 10px;
                &:hover{
                    color: var(--main-theme-color);
                }
            }
            .album-artist{
                a{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: start;
                    margin-bottom: 15px;
                    .artist-name{
                        max-width: 189px;
                        font-size: 14px;
                        font-weight: 400;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: inline-block;
                    }
                    .right-icon{
                        width: 13px;
                        height: 13px;
                        margin-top: 2px;
                        svg{
                            width: 100%;
                            height: 100%;
                            display: block;
                            margin-left: -2px;
                            margin-top: 1px;
                        }
                    }
                }
            }
            .album-size{
                margin-bottom: 5px;
                p{
                    color: #333;
                    font-size: 13px;
                    font-weight: 400;   
                }
            }
            .album-release{
                p{
                    color: #969696;
                    font-size: 13px;
                    font-weight: 400;
                }
            }
            .album-icon-box{
                display: flex;
                flex-direction: row;
                margin-top: 20px;
                button{
                    margin-left: -3px;
                    margin-right: 14px;
                }
            }
        }
    }
    .active{
        font-size: 14px;
        color: var(--main-theme-color);
    }

    .not-active{
        font-size: 14px;
    }
`;

export const StyledTablediv = styled.div`
    vertical-align: middle;
    p>a{
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

`

export const StyledTableli = styled.div`
    font-size: 20px;
    vertical-align: middle;

    a:hover{
        color: var(--main-theme-color);
    }
    p>a{
        display: block;
        overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    }

    // p{
    //     font-weight: 400;
    // }     
`
    

export default ArtistAlbum