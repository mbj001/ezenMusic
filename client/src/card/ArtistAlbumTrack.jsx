import React, {useState, useEffect, MouseEvent, useRef} from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiHeart3Line, RiHeart3Fill} from "react-icons/ri";
import Axios from 'axios';
import { Cookies } from "react-cookie";
import LikeyBanner from './LikeyBanner';

function ArtistAlbumTrack({lank, title, album_title, artist_num, artist, img, music_id, album_size, artist_class ,artist_gender, id, album_id,album_release_date}) {

    const searchInputRef = useRef(null);
    const moreboxRef = useRef(null);
    const [isSearchMode, setIsSearchMode] = useState(false); 


    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");
    const [likeyList, setLikeyList] = useState([]);
    const [islikey, setIslikey] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    let array = [];

    function HandleLikey(){
        setIslikey(islikey => {return !islikey})
    }
    function addLikeAlbum(){
        Axios.post("http://localhost:8080/ezenmusic/addlikey", {
            userid: userid_cookies,
            id: album_id,
            division: "likealbum"
        })
        .then(({data}) => {
            HandleLikey();
            setLikeyBannerOn(1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    function delLikeAlbum(){
        Axios.post("http://localhost:8080/ezenmusic/dellikey", {
            userid: userid_cookies,
            id: album_id,
            division: "likealbum"
        })
        .then(({data}) => {
            HandleLikey();
            setLikeyBannerOn(-1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        Axios.post("http://localhost:8080/ezenmusic/detail/album_theme/likey", {
            userid: userid_cookies,
            division: "likealbum"
        })
        .then(({data}) => {
            array = data;
            console.log(array);
            setLikeyList(data);
            for(let i=0; i<array.length; i++){
                if(array[i] === Number(album_id)){
                    setIslikey(!islikey);
                }
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])


    useEffect(() => {
        function handleClickOutside(e){
            if(searchInputRef.current && !searchInputRef.current.contains(e.target)) {
                if(moreboxRef.current.contains(e.target)){
                }
                else{
                    setIsSearchMode(false); 
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
    }, [searchInputRef]);


    return (    
    <>
    <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"album"}/>
    <li className="inline-block ">
        <StyledTableli className="d-flex items-center mt-[100px] mb-3 ">
            <Link to={"/detail/album/" + album_id + "/albumtrack"}><img src={"/image/album/" + img} alt="img02" className="w-[175px] h-[175px] rounded-[5px]" /></Link>
            <div className="ml-5 overflow-hidden w-72">
                <p className="text-neutral-950 font-normal text-[16px]"><Link to={"/detail/album/" + album_id + "/albumtrack"}>{album_title}</Link></p>
                    <StyledTableli className="mb-2"><p className="text-sm"><Link to={"/detail/artist/" + artist_num + "/artisttrack"}>{`${artist} >`}</Link></p></StyledTableli>
                    <StyledTableli><p className="text-sm">{`${album_release_date}`}</p></StyledTableli>
                    <StyledTableli></StyledTableli>
                    <StyledTableli><p className="text-sm">{album_size}</p></StyledTableli>
            </div> 
        </StyledTableli>
        <div className="d-flex ml-44 absolute mt-[-50px]">
            <StyledTableli className="w-[30px]"><RiPlayFill className="m-auto text-[20px] text-gray cursor-pointer hover-text-blue" /></StyledTableli>
            <StyledTableli className="w-[30px]"><RiPlayListAddFill className="m-auto text-[20px] text-gray cursor-pointer hover-text-blue" /></StyledTableli>
            <StyledTableli className="w-[30px]"><RiFolderAddLine className="m-auto text-[20px] text-gray cursor-pointer hover-text-blue" /></StyledTableli>
            <StyledTableli className="w-[30px]">
            {
                islikey?
                <RiHeart3Fill className="mx-[10px] text-[24px] text-pink cursor-pointer" onClick={delLikeAlbum}/>
                :
                <RiHeart3Line className="mx-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" onClick={addLikeAlbum}/>
            }    
            </StyledTableli>
        </div>
    </li>
    </>
    )
}

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

const StyledMusicMenu = styled.div`
    position: absolute;
    box-shadow: 0 0 30px 5px #efefef;
    width: 200px;
    left: -150px;
    top: 60px;
    background-color: white;
    z-index: 100;

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
        color: var(--main-text-gray);
    }

    li p{
        margin-left: 10px;
    }

    li:hover{
        color: var(--main-theme-color);
    }
`

export default ArtistAlbumTrack