import React, { useState, useEffect } from 'react'
import Axios from "axios"
import styled from "styled-components"
import { RiHeart3Line, RiHeart3Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import ArtistAlbum from "./ArtistAlbum";
import ArtistTrack from "./ArtistTrack";
import { NavLink, useParams } from 'react-router-dom';
import { Cookies } from "react-cookie";
import LikeyBanner from '../card/LikeyBanner';

function Artist({ music_id, handleRender }) {

    const [detailArtist, setDetailArtist] = useState([]);
    const [artistInfo, setArtistInfo] = useState([]);

    const [islikey, setIslikey] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    const [likeyList, setLikeyList] = useState([]);
    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    const {details} = useParams();

    let array = [];
    let array2 = [];

    function HandleLikey(){
        console.log("handlelikey");
        setIslikey(islikey => {return !islikey})
    }

    function addLikeAlbum(){
        Axios.post("http://localhost:8080/ezenmusic/addlikey", {
            userid: userid_cookies,
            id: music_id,
            division: "likeartist"
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
            id: music_id,
            division: "likeartist"
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
            division: "likeartist"
        })
        .then(({data}) => {
            array2 = data;
            setLikeyList(data);
            for(let i=0; i<array2.length; i++){
                if(array2[i] === Number(music_id)){
                    setIslikey(true);
                }
            }

        })
        .catch((err) => {
            console.log(err)
        })

        Axios.get("http://localhost:8080/ezenmusic/detail/artist/" + music_id) //music_id 는 artist_num
        .then(({ data }) => {

            setDetailArtist(data);

            array.push(data[0]);
            setArtistInfo(array);            
        })
        .catch((err) => {
            { }
        })

    }, [])

    return (
        <>
        <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"artist"}/>
        {
            artistInfo.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div>
                        <div className="flex p-[30px]">
                            <div>
                                <img src={"/image/artist/"+item.org_artist_img} alt="artist_img" className="w-[250px] h-[230px] rounded-[50%] " />
                            </div>
                            <div className="m-[30px] w-[1210px] h-[50px] relative">
                                <Link to={item.artist_num}><h3 className="detail-title mb-[10px]">{item.artist}</h3></Link>
                                <StyledTable>
                                    <dl className="">
                                    <dt className="hidden">아티스트 정보</dt>
                                    <dd>{item.artist_class}</dd>
                                    <dd>{item.artist_gender}</dd>
                                    <dd>{item.genre}</dd>
                                    </dl>
                                </StyledTable>
                                <div className="flex mt-[20px] ">
                                    {
                                        islikey?
                                        <RiHeart3Fill className="mx-[10px] text-[24px] text-pink cursor-pointer" onClick={delLikeAlbum}/>
                                        :
                                        <RiHeart3Line className="mx-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" onClick={addLikeAlbum}/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-[40px]">
                    <NavLink to={"/detail/artist/"+item.artist_num+"/artisttrack"} className={({ isActive }) => isActive ? "likey-nav active" : "likey-nav text-gray" }>곡</NavLink>
                    <NavLink to={"/detail/artist/"+item.artist_num+"/albumtrack"} className={({ isActive }) => isActive ? "likey-nav active" : "likey-nav text-gray" }>앨범</NavLink>
                    </div>
                    {
                        details === "albumtrack" && <ArtistAlbum music_id={music_id} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} album_size={item.album_size} />
                    }
                    {
                        details === "artisttrack" && <ArtistTrack artist_img={item.org_artist_img} artist={item.artist} artist_num={item.artist_num} music_id={music_id} handleRender={handleRender}/>
                    } 
                </StyledDetail>
            ))
        }
        </>
    )

}
export default Artist

const StyledDetail = styled.div`
    width: 1440px;
    margin: 0 auto;

    .detail-title{
        font-size: 28px;
        font-weight: 700;
    }

    .lyrics{
        white-space: pre-wrap;
    }

    .likey-nav{
        background-color: #efefef;
        padding: 7px 15px;
        border-radius: 20px;
        font-size: 14px;
        margin-right: 10px;
    }

    .active{
        background-color: var(--main-theme-color);
        color: white;
    }

    a>h3:hover{
        color: var(--main-theme-color);
    }
`

const StyledTable = styled.dl`
    dd{
        display: inline-block;
        margin: 2px;
    }  
    dd::after{
    position: absolute;
    top: 4px;
    left: 4px;
    display: block;
    width: 1px;
    height: 8px;
    content: "";
    background-color: #dcdcdc;
    }
`