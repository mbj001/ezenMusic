import React, {useState, useEffect} from 'react'
import Axios from "axios"
import Player from './Player';
import styled from 'styled-components';
import { Link, Router } from 'react-router-dom';
function Playlist() {
    const [playerMusic, setPlayerMusic] = useState([]);
    const [listenMusic, setListenMusic] = useState({});
    const [showPlaylist, setShowPlaylist] = useState(true);

    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/playerbar/")
        .then(({data}) => {
            setPlayerMusic(data);
            setListenMusic(data[0]);
        })
        .catch((err) => {
            {}
        })
    }, [])

    function changeMusicFunc(e, item){
        e.preventDefault();
        setListenMusic(item);
    }


    function showPlaylistFunc(e){
        e.preventDefault();
        setShowPlaylist(!showPlaylist);
    }

    return (
        <>
        <StyledPlaylist showVal={showPlaylist}>
            <div className="flex items-center">
                <div className="col-7">
                    <div className="text-center">
                        <p className="text-white text-[22px] font-bold mb-[10px]" onClick={showPlaylistFunc}><Link to={"/detail/track/" + listenMusic.id + "/details"}>{listenMusic.title}</Link></p>
                        <p className="text-gray-500 text-[14px] mb-[15px]">{listenMusic.artist}</p>
                        <img src={"/image/album/" + listenMusic.org_cover_image} alt="cover_image" className="w-[350px] h-[350px] m-auto rounded-[20px]"  />
                    </div>
                </div>
                <div className="col-5 mt-[100px] pr-[100px]">
                    <div>
                        <div className="flex justify-between">
                            <div className="flex">
                                <p className="text-white">음악</p>
                                <p className="text-white">오디오</p>
                            </div>
                            <p>편집</p>
                        </div>
                        <div className="flex">
                            <input type="text" placeholder='재생목록에서 검색해주세요' className="rounded-[20px] bg-gray-800" />
                            <div>
                                <p>내 리스트 가져오기</p>
                                <p>그룹접기</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-[600px] overflow-scroll">
                        {
                            playerMusic.map((item, index) => (
                                <div className="flex my-[20px]">
                                    <img src={"/image/album/" + item.org_cover_image} alt="cover_image" className="w-[50px] h-[50px]" />
                                    <div onClick={(e) => changeMusicFunc(e, item)} className="cursor-pointer">
                                        <p className="text-white">{item.title}</p>
                                        <p className="text-white">{item.artist}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </StyledPlaylist>
        <div onClick={showPlaylistFunc} >
            <Player listenMusic={listenMusic} showPlaylistFunc={showPlaylistFunc} />
        </div>
        </>
    )
}

const StyledPlaylist = styled.div`
    position: fixed;
    top: 0;
    z-index: 10001;
    width: 100%;
    height: 100%;
    background: linear-gradient(100deg, #333 10%, #3b3b3b 30%, #333 50%, #3b3b3b 70%, #333 90%);

    transform: ${(props) => props.showVal? "translateY(100%)" : "translateY(0%)"};
    transition: 0.5s;
    // color: ${(props) => props.showVal? "red" : "blue"};

    // p{
    //     color: white;
    // }
`

export default Playlist