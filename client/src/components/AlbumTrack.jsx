import React, {useState, useEffect, useContext} from 'react'
import Axios from 'axios'
import { Cookies } from 'react-cookie';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import MusicListTable from '../card/MusicListTable';
import { AppContext } from '../App'

function AlbumTrack({album_id, handleRender}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [albumTrackMusic, setalbumTrackMusic] = useState([]);
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);

    let array = [];


    useEffect(() => {
        if(isSessionValid){
            Axios.post("/ezenmusic/allpage/likeylist/", {
                character_id: userid_cookies,
                division: "liketrack"
            })
            .then(({data}) => {
                if(data === -1){
                    // 좋아요 없을 때
                }
                else{
                    array = data[0].music_list;
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }

        Axios.get("/ezenmusic/detail/album/albumtrack/"+album_id)
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
            setalbumTrackMusic(data);
        })
        .catch((err) => {
            {}
        })
    }, [])

    return (
        <>
        <MusicListTable page="albumtrack" lank={false} music_list={albumTrackMusic} handleRender={handleRender}/>
        { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
        </>
    )
}

export default AlbumTrack