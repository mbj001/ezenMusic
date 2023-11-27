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

function Chart({genre_id, handleRender}) {

    const [chartinfo, setChartinfo] = useState([]);
    const [chartlist, setChartlist] = useState([]);
    const [firstchartImg, setFirstchartImg] = useState("");
    const [totalNum, setTotalNum] = useState(0)

    const [allcheckVal, setAllcheckVal] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");
    let array = [];

    useEffect(() => {

        Axios.get("http://localhost:8080/ezenmusic/allpage/likeylist/"+userid_cookies)
        .then(({data}) => {
                array = data[0].music_list;
            })
        .catch((err) => {
            console.log(err);
        })

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
            chartinfo.map((item, index) => (
                <StyledDetail key={index} className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]'>
                    <div className="mb-[40px]">
                        <div className="flex items-center p-[30px]">
                            <img src={"/image/album/"+firstchartImg} alt="cover_image" className="w-[230px] h-[230px] rounded-[25px]" />
                            <div className="m-[30px]">
                                <p className="detail-title mb-[10px]">{item.full_genre}</p>
                                <p className="font-normal">총 {totalNum}곡</p>
                                <div className="flex mt-[50px] ">
                                    <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                                    <RiFolderAddLine className="mx-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                                    <RiHeart3Line className="mx-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="mb-[40px]">
                    </div>
                </StyledDetail>
            ))
        }
        <StyledBrowser className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
            <LikeyBanner likeyBannerOn={likeyBannerOn} setLikeyBannerOn={setLikeyBannerOn} pageDivision={"track"}/>
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
                            chartlist.map((item, index) => (
                                <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} likey={item.likey} check_all={allcheckVal} setLikeyBannerOn={setLikeyBannerOn} handleRender={handleRender}/>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </StyledBrowser>
        {
                allcheckVal ?
                <AllCheckedModal setAllcheckVal={setAllcheckVal}/>
                :
                ""
        }
        </>
    )
}

export default Chart