import React, {useState, useEffect, useContext} from 'react'
import Axios from 'axios'   
import { Cookies } from "react-cookie";
import MusicListTable from '../card/MusicListTable';
import { Link } from 'react-router-dom';
import { AppContext } from '../App'

function ArtistTrack({artist_id, handleRender, sortType}) {

    const [artistTrackMusic, setartistTrackMusic] = useState([]);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    let array = [];

    useEffect(() => {
        
        if(isSessionValid){
            Axios.post("/ezenmusic/allpage/likeylist/", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                if(data === -1){
                }
                else{
                    array = data[0].music_list;
                    // console.log(array);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
        Axios.post("/ezenmusic/detail/artist/track/", {
            artist_id: artist_id,
            sortType: sortType
        })
        .then(({ data }) => {
            for(let i=0; i<data.length; i++){
                // object 에 likey 라는 항목 넣고 모두 false 세팅
                data[i].likey = false;
            }
            for(let i=0; i<array.length; i++){
                for(let j=0; j<data.length; j++){
                    if(array[i] === Number(data[j].music_id)){
                        // 좋아요 해당 object 의 값 true 로 변경
                        data[j].likey = true;
                    }
                }
            }
            // console.log(data);
            setartistTrackMusic(data);
        })
        .catch((err) => {
            {}
        })
    }, [sortType])

    return (
    <>
    <div className="relative md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] m-auto">
        <MusicListTable page="artisttrack" lank={false} music_list={artistTrackMusic} handleRender={handleRender}/>
        <div className="absolute right-0 top-[-7px]">
            <Link to={"/detail/artist/"+artist_id+"/track?sortType=RECENT"}>
                <span className={ sortType === "RECENT" ? "text-[11px] text-blue" : "text-[11px]"}>최신순</span>
            </Link>
            <Link to={"/detail/artist/"+artist_id+"/track?sortType=POPULARITY"}>
                <span className={ sortType === "POPULARITY" ? "text-[11px] text-blue mx-[15px]" : "text-[11px] mx-[15px]"}>인기순</span>
            </Link>
            <Link to={"/detail/artist/"+artist_id+"/track?sortType=WORD"}>
                <span className={ sortType === "WORD" ? "text-[11px] text-blue" : "text-[11px]"}>가나다순</span>
            </Link>
        </div>
    </div>
    </>
    )
}

export default ArtistTrack