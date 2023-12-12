import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import { userid_cookies } from '../config/cookie';
import MusicListTable from '../card/MusicListTable';

function Similar({genre, music_id, handleRender}) {
    const [similarMusic, setSimilarMusic] = useState([]);

    let array = [];

    useEffect(() => {

        if(userid_cookies !== undefined){
            Axios.post("/ezenmusic/allpage/likeylist/",{
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                    array = data[0].music_list;
                })
            .catch((err) => {
                console.log(err);
            })
        }

        Axios.get("/ezenmusic/similar/"+genre)
        .then(({data}) => {
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
            setSimilarMusic(data);
        })
        .catch((err) => {
            {}
        })
    }, [music_id])

    return (
        <MusicListTable page="similar" lank={false} music_list={similarMusic} handleRender={handleRender}/>
    )
}


export default Similar