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

function Channel({num, details, handleRender}) {
    const [channelInfo, setChannelInfo] = useState([]);
    const [channelMusic, setChannelMusic] = useState([]);

    const [initNum, setInitNum] = useState(details);
    const [totalMusicNum, setTotalMusicNum] = useState(-1);
    const [allcheckVal, setAllcheckVal] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    const [likeyList, setLikeyList] = useState([]);
    const [islikey, setIslikey] = useState(false);
    const [themebannerVal, setThemebannerVal] = useState(false);

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
            setThemebannerVal(true);
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
            setThemebannerVal(true);
            setLikeyBannerOn(-1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        if(!details){
            setInitNum("");
        }
        
        Axios.post("http://localhost:8080/ezenmusic/detail/album_theme/likey", {
            userid: userid_cookies,
            division: "liketheme"
        })
        .then(({data}) => {
            array2 = data;
            setLikeyList(data);
            
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

        Axios.get("http://localhost:8080/ezenmusic/allpage/likeylist/"+userid_cookies)
        .then(({data}) => {
                array = data[0].music_list;
            })
        .catch((err) => {
            console.log(err);
        })

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
                                <div className="flex mt-[50px] ">
                                    <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                                    <RiFolderAddLine className="mx-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                                    {
                                        islikey?
                                        <RiHeart3Fill className="mx-[10px] text-[24px] text-pink cursor-pointer" onClick={delLikeTheme}/>
                                        :
                                        <RiHeart3Line className="mx-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" onClick={addLikeTheme}/>
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
        {
            initNum ===""?
            <StyledBrowser className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
                {
                    themebannerVal?
                    <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"theme"} setThemebannerVal={setThemebannerVal}/>
                    :
                    <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"track"}/>
                }
                <div className="mb-3">
                    <div className="flex items-center cursor-pointer">
                        <RiPlayLine className="all-play-icon absolute top-[2px] left-[0px]"/>
                        <p className="ml-[25px] text-[14px] text-gray">전체듣기</p>
                    </div>
                </div>
                <div>
                    <hr className="text-gray"/>
                    <table className="table table-hover">
                        <MusicListHeader lank={false} setAllcheckVal={setAllcheckVal} allcheckVal={allcheckVal} />
                        <tbody>
                            {
                                channelMusic.map((item, index) => (
                                    <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} likey={item.likey} check_all={allcheckVal} setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender}/>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </StyledBrowser>
            :
            <Comments />
        }
        {
            allcheckVal ?
            <AllCheckedModal setAllcheckVal={setAllcheckVal}/>
            :
            ""
        }
    </>
    )
}

export default Channel