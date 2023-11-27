import React, {useState, useEffect} from 'react'
import Axios from 'axios';
import styled from 'styled-components';
import { RiPlayLine, RiPlayListAddFill, RiEdit2Fill } from "react-icons/ri";
import MusicListCard from '../card/MusicListCard';

function DetailMylist({playlist_id, handleRender}) {

    const [playlistData, setPlaylistData] = useState([]);
    const [albumAndMusicData, setAlbumAndMusicData] = useState([]);


    useEffect(() => {        
        Axios.get("http://localhost:8080/ezenmusic/detail/detailmylist/" + playlist_id)
        .then(({data}) => {
            setAlbumAndMusicData(data);
            console.log(data)
            Axios.get("http://localhost:8080/playlist/detail/detailmylist/" + playlist_id)
            .then(({data}) => {
                setPlaylistData(data);
            })
            .catch((err) => {
                {}
            })
        })
        .catch((err) => {
            {}
        })
    }, [])
    console.log(albumAndMusicData);
    console.log(playlistData);
    
    return (
        <>
        {   
            playlistData.map((item, index) => (
                <>
                {
                    playlistData[index].playlist == null?
                    <StyledDetail key={index}>
                        <div>
                            <div className="flex items-center p-[30px]">
                                <img src="/image/noplaylist.svg" alt="cover_image" className="w-[230px] h-[230px] rounded-[10px]" />
                                <div className="m-[30px]">
                                    <p className="detail-title flex justify-start mb-[10px]">{playlistData[index].playlist_name}</p>
                                    <RiEdit2Fill />
                                    <p className="font-normal">총 0곡</p>
                                    <div className="flex mt-[50px] ">
                                        <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </StyledDetail>
                    :
                    <StyledDetail key={index}>
                        <div>
                            <div className="flex items-center p-[30px]">
                                <img src={"/image/album/"+playlistData[index].thumbnail_image} alt="cover_image" className="w-[230px] h-[230px] rounded-[10px]" />
                                <div className="m-[30px]">
                                    <p className="detail-title mb-[10px]">{playlistData[index].playlist_name}</p>
                                    <p className="font-normal">총 {playlistData[index].playlist.length}곡</p>
                                    <div className="flex mt-[50px] ">
                                        <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray cursor-pointer hover-text-blue" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </StyledDetail>
                }
                </>
                ))
            
        }

                    
        <StyledBrowser className="relative">
            <div className="mb-3 flex flex-col justify-between">
                <div className="absolute top-0 left-0 flex ml-[10px] cursor-pointer">
                    <RiPlayLine className="all-play-icon absolute top-[4px] left-[55px]"/>
                    <p>전체듣기</p>
                </div>
                <div className="absolute top-0 right-0 items-center">
                    <p className="">편집</p>
                </div>
            </div>
            <div className='mt-[40px]'>
                <hr className="text-gray"/>
                <table className="table table-hover">
                    <thead className="h-[50px] align-middle ">
                        <tr className="">
                            <StyledTableth scope="col" className="text-center w-[5%]"><input type="checkbox" /></StyledTableth>
                            <StyledTableth scope="col"><p>곡/앨범</p></StyledTableth>
                            <StyledTableth scope="col"><p>아티스트</p></StyledTableth>
                            <StyledTableth scope="col" className="text-center"><p>듣기</p></StyledTableth>
                            <StyledTableth scope="col" className="text-center"><p>재생목록</p></StyledTableth>
                            <StyledTableth scope="col" className="text-center"><p>내 리스트</p></StyledTableth>
                            <StyledTableth scope="col" className="text-center"><p>더보기</p></StyledTableth>
                        </tr>
                    </thead>
                    <tbody>
                        {   
                            albumAndMusicData.map((item, index) => (
                                albumAndMusicData[0].title == null?
                                ""
                                :
                                <MusicListCard key={index} title={item.title} album_title={item.album_title} artist_num={item.artist_num} artist={item.artist} img={item.org_cover_image} music_id={item.id} album_id={item.album_id} handleRender={handleRender} />

                            ))
                        }
                    </tbody>
                </table>
                {
                    playlistData.map((item, index) =>(
                        playlistData[0].playlist == null?
                        <StyledMylistDivFalse key={index} className='w-[1440px] h-[768px] flex flex-wrap justify-around mx-auto'>
                          <div className='text-center mt-32'>
                            <img src="/image/noplaylist.svg" alt="noplaylist" />
                            <p className='mt-2 font-bold'>곡이 하나도 없어용 ㅠㅠ</p>
                            {/* <form onSubmit={createPlaylistWhenNull} method='post' className='mt-3'>
                              <input type="hidden" name='userid' value={userid_cookies} />
                              <input type="hidden" name="date" value={date} />
                              <button type='submit' >
                                + 새로운 리스트 만들기
                              </button>
                            </form> */}
                          </div>
                        </StyledMylistDivFalse>
                        
                        :
                        ""

                    ))

                }
            </div>
        </StyledBrowser>
        </>
    )
}

export default DetailMylist

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

    .active{
        background-color: var(--main-theme-color);
        color: white
    }
`

export const StyledTableth = styled.th`
    font-size: 12px;

    p{
        color: var(--main-text-gray);
        font-weight: 400;
    }
`


export const StyledBrowser = styled.div`
    width: 1440px;
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
        font-size: 20px;
        color: var(--main-text-gray);
    }

    tbody>*{
        color: var(--main-text-gray);
    }
`;

const StyledMylistDivFalse = styled.div`
  img{
    width: 180px;
    height: 130px;
  }
  button{
    margin-top: 5px;
    border: 1px solid var(--main-text-gray-lighter);
    padding: 5px 10px;
    border-radius: 20px;
  }
`