import React, {useState, useEffect} from 'react'
import Axios from 'axios'   
import { Cookies } from "react-cookie";
import MusicListTable from '../card/MusicListTable';

function ArtistTrack({artist_id, handleRender}) {

    const [artistTrackMusic, setartistTrackMusic] = useState([]);

    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");

    let array = [];

    useEffect(() => {
        if(userid_cookies !== undefined){
            Axios.post("/ezenmusic/allpage/likeylist/", {
                character_id: userid_cookies,
                division: "likeartist"
            })
            .then(({data}) => {
                    array = data[0].music_list;
                })
            .catch((err) => {
                console.log(err);
            })
        }

        Axios.get("/ezenmusic/detail/artist/artisttrack/"+ artist_id)
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
            setartistTrackMusic(data);
        })
        .catch((err) => {
            {}
        })
    }, [])

    return (
        <MusicListTable page="artisttrack" lank={false} music_list={artistTrackMusic} handleRender={handleRender}/>
    )
}

export default ArtistTrack