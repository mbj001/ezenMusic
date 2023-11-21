import React, {useState, useEffect} from 'react'
import Axios from "axios"
import { StyledDetail } from './Track';
import { StyledBrowser, StyledTableth } from '../pages/Browse';
import { Link } from 'react-router-dom';
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';
import MusicListHeader from '../card/MusicListHeader';

function Chart({genre_id}) {

    const [chartinfo, setChartinfo] = useState([]);
    const [chartlist, setChartlist] = useState([]);
    const [firstchartImg, setFirstchartImg] = useState("");
    const [totalNum, setTotalNum] = useState(0)
    const [allcheckVal, setAllcheckVal] = useState(false);


    useEffect(() => {
        Axios.get("http://localhost:8080/ezenmusic/detail/chartinfo/"+genre_id)
        .then(({data}) => {
            setChartinfo(data);
            
            Axios.get("http://localhost:8080/ezenmusic/detail/chart/"+genre_id)
            .then(({data}) => {
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
                                {/* <Link to={"/detail/album/" +  + "/albumtrack"}><p className="font-light text-gray-600">{item.themetitle}</p></Link> */}
                                <div className="flex mt-[50px] ">
                                    <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                    <RiFolderAddLine className="mx-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                    <RiHeart3Line className="mx-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
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
            <div className="mb-3">
                <div className="flex items-center cursor-pointer">
                    <RiPlayLine className="all-play-icon absolute top-[2px] left-[0px]"/>
                    <p className="ml-[25px] text-[14px] text-gray-500">전체듣기</p>
                </div>
            </div>
            <div>
                <hr className="text-gray-500"/>
                <table className="table table-hover">
                    <MusicListHeader lank={false} setAllcheckVal={setAllcheckVal} />
                    <tbody>
                        {
                            chartlist.map((item, index) => (
                                <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} check_all={allcheckVal} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </StyledBrowser>
        </>
    )
}

export default Chart