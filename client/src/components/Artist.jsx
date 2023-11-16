import React, { useState, useEffect } from 'react'
import Axios from "axios"
import styled from "styled-components"
import { RiPlayLine, RiPlayFill, RiPlayListAddFill, RiFolderAddLine, RiMore2Line, RiMusic2Line, RiAlbumLine, RiMicLine, RiHeart3Line, RiProhibitedLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import ArtistAlbum from "./ArtistAlbum";
import ArtistTrack from "./ArtistTrack";

function Artist({music_id, artist_num, details}) {
  
  const [detailArtist, setDetailArtist] = useState([]);

  // const [detailAlbum, setDetailAlbum] = useState([]);

  const [initNum, setInitNum] = useState();

  if (!initNum) {
    setInitNum(details)
  }

  useEffect(() => {
    Axios.get("http://localhost:8080/ezenmusic/detail/artist/"+ music_id) //music_id 는 artist_num
      .then(({ data }) => {
        console.log(music_id + "id num구하기")
        setDetailArtist(data);
      })
      .catch((err) => {
      {}  
      })
    
  }, [])
  
  return (
    <>
      {
        detailArtist.map((item, index) => (
          <StyledDetail>
          <div>
              <div className="flex p-[30px]">
                <div>
                  <img src={"/image/artist/" + item.org_artist_img} alt="artist_img" className="w-[230px] h-[230px] rounded-[175px] " />
                  </div>
              <div className="m-[30px] w-[1210px] h-[50px]">
                  <Link to={item.artist_num}><h3 className="detail-title mb-[10px]">{item.artist}</h3> </Link>
                  <StyledTable>
                <dl>
                  <dt className="hidden">아티스트 정보</dt>
                  <dd>{item.artist_class}</dd>
                  <dd>{item.artist_gender}</dd>
                  <dd>{item.genre}</dd>
                    </dl>
                    </StyledTable>
                  <div className="flex mt-[50px] ">
                                    <RiPlayListAddFill className="mr-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                    <RiFolderAddLine className="mx-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                                    <RiHeart3Line className="mx-[10px] text-[24px] text-gray-500 cursor-pointer hover:text-blue-500" />
                    </div>
              </div>  
            </div>
          </div>
          <div className="mb-[40px]">
                        {
                            initNum === "albumtrack" || initNum === undefined?
                                <div>
                                    <Link to={"/detail/artist/" + music_id + "/artisttrack"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("artisttrack")}>곡</Link>
                                    <Link to={"/detail/artist/" + music_id + "/albumtrack"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("albumtrack")}>앨범</Link>
                                </div>
                                :
                                <div>
                                    <Link to={"/detail/artist/" + music_id + "/artisttrack"} className="active rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("artisttrack")}>곡</Link>
                                    <Link to={"/detail/artist/" + music_id + "/albumtrack"} className="rounded-[20px] px-[15px] py-[7px] mr-[10px] text-gray-600 font-normal" onClick={(e) => setInitNum("albumtrack")}>앨범</Link>
                                </div>

                        }
                    </div>
                    {
                        initNum === "albumtrack"?
                            <ArtistAlbum id={music_id} album_title={item.album_title} />
                            :
                            <ArtistTrack artist_img={item.org_artist_img} artist={item.artist} music_id={music_id} />
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

    .active{
        background-color: blue;
        color: white
    }
`
const StyledTable = styled.dl`
  dd{
    display: inline-block;
    margin: 2px;
  }

  
`