import React, {useState, useEffect} from 'react'
import Axios from 'axios'
import MusicListCard from '../card/MusicListCard';
import MusicListHeader from '../card/MusicListHeader';
import { RiPlayLine } from "react-icons/ri";
import { StyledBrowser } from '../pages/Browse';
import { Cookies } from "react-cookie";
import AllCheckedModal from '../modal/AllCheckedModal';
import LikeyBanner from '../card/LikeyBanner';
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import MusicListTable from '../card/MusicListTable';

function AlbumTrack({id, album_title, handleRender}) {

    const [albumTrackMusic, setalbumTrackMusic] = useState([]);

    const [allcheckVal, setAllcheckVal] = useState(false);
    const [likeyBannerOn, setLikeyBannerOn] = useState(0);
    
    const cookies = new Cookies();
    const userid_cookies = cookies.get("client.sid");
    // 로그인이 필요합니다 모달 변수
    const [loginRequestVal, setLoginrRequestVal] = useState(false);


    let array = [];


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

        Axios.get("http://localhost:8080/ezenmusic/detail/album/albumtrack/"+album_title)
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
            setalbumTrackMusic(data);
            // setFlochartData(data);
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