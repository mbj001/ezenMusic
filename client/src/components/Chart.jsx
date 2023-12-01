import React, {useState, useEffect} from 'react'
import Axios from "axios"
import { StyledDetail } from './Track';
import { StyledBrowser } from '../pages/Browse';
import { RiPlayLine, RiPlayListAddFill, RiFolderAddLine, RiHeart3Line } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';
import MusicListHeader from '../card/MusicListHeader';
import { Cookies } from "react-cookie";
import AllCheckedModal from '../modal/AllCheckedModal';
import LikeyBanner from '../card/LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import MusicListTable from '../card/MusicListTable';
import PlayerBanner from '../card/PlayerBanner';
import icons from '../assets/sp_button.6d54b524.png'

function Chart({genre_id, handleRender}) {

    const [chartinfo, setChartinfo] = useState([]);
    const [chartlist, setChartlist] = useState([]);
    const [firstchartImg, setFirstchartImg] = useState("");
    const [totalNum, setTotalNum] = useState(0)

    const [allcheckVal, setAllcheckVal] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    // 플레이어 추가 베너
    const [playerBannerOn, setPlayerBannerOn] = useState(false);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");
    let array = [];


    // 2023-12-01 album 플레이어 추가
    function playerAdd(){
        let array = [];

        for(let i=0; i<chartlist.length; i++){
            array.push(chartlist[i].id)
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



    useEffect(() => {

        if(userid_cookies !== undefined){
            Axios.post("http://localhost:8080/ezenmusic/allpage/likeylist/", {
                userid: userid_cookies,
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

        Axios.get("http://localhost:8080/ezenmusic/detail/chartinfo/"+genre_id)
        .then(({data}) => {
            setChartinfo(data);
            
            Axios.get("http://localhost:8080/ezenmusic/detail/chart/"+genre_id)
            .then(({data}) => {
                ///// data에 좋아요 추가하는 부분
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

    return (
        <>
        {
            playerBannerOn?
            <PlayerBanner playerBannerOn={playerBannerOn} setPlayerBannerOn={setPlayerBannerOn} page={"albumtrack"} />
            :
            ""
        }
        {
            chartinfo.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div className="mb-[40px]">
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/album/"+firstchartImg} alt="cover_image" className="w-[230px] h-[230px] rounded-[25px]" />
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.full_genre}</p>
                                <p className="font-normal">총 {totalNum}곡</p>
                                <div className="flex mt-[30px] ">
                                    <button className="artist_listplus ml-[-10px]" style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? playerAdd : setLoginrRequestVal}></button>
                                    <button className="artist_box " style={{backgroundImage:`url(${icons})`}} onClick={userid_cookies? "" : setLoginrRequestVal}></button>
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
        
        { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
        </>
    )
}

export default Chart