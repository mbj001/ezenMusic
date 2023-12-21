import React, {useState, useEffect, useContext} from 'react'
import Axios from "axios"
import { RiArrowRightSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import MusicListTable from '../card/MusicListTable';
import { Cookies } from 'react-cookie';
import { AppContext } from '../App'

function SearchTrack({keyword, page, handleRender}) {

    const cookies = new Cookies();
    const userid_cookies = cookies.get("character.sid");
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [searchTrack, setSearchTrack] = useState([]);
    const [hasTrack, setHasTrack] = useState(false);

    let array = [];
    let array2 = [];

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
                        array2 = data[0].music_list;
                        Axios.get("/ezenmusic/search/track/" + keyword)
                            .then(({data}) =>{
                                if(data.length == 0){
                                    setHasTrack(false);
                                }
                    
                                else{
                                    setHasTrack(true);
                                    for(let i=0; i<data.length; i++){
                                        // object 에 likey 라는 항목 넣고 모두 false 세팅
                                        data[i].likey = false;
                                    }
                        
                                    // userid_cookies 없으면 for 문을 안돌면서 true 값 저장안됨.
                                    for(let i=0; i<array2.length; i++){
                                        for(let j=0; j<data.length; j++){
                                            if(array2[i] === Number(data[j].music_id)){
                                                // 좋아요 해당 object 의 값 true 로 변경
                                                data[j].likey = true;
                                            }
                                        }
                                    }
                    
                                    if(page === "all"){
                                        if(data.length < 5){
                                            for(let i=0; i<data.length; i++){
                                                array.push(data[i]);
                                            }
                                        }
                                        else{
                                            for(let i=0; i<5; i++){
                                                array.push(data[i]);
                                            }
                                        }
                                        setSearchTrack(array);
                                    }
                                    else{
                                        setSearchTrack(data);
                                    }
                                }
                            })
                    }
                })
                .catch((err) => {
                    console.log(err);
            })  
        }

        else{
            Axios.get("/ezenmusic/search/track/" + keyword)
            .then(({data}) =>{
                if(data.length == 0){
                    setHasTrack(false);
                }
    
                else{
                    setHasTrack(true);
                    for(let i=0; i<data.length; i++){
                        // object 에 likey 라는 항목 넣고 모두 false 세팅
                        data[i].likey = false;
                    }
        
                    // userid_cookies 없으면 for 문을 안돌면서 true 값 저장안됨.
                    for(let i=0; i<array2.length; i++){
                        for(let j=0; j<data.length; j++){
                            if(array2[i] === Number(data[j].music_id)){
                                // 좋아요 해당 object 의 값 true 로 변경
                                data[j].likey = true;
                            }
                        }
                    }
    
                    if(page === "all"){
                        if(data.length < 5){
                            for(let i=0; i<data.length; i++){
                                array.push(data[i]);
                            }
                        }
                        else{
                            for(let i=0; i<5; i++){
                                array.push(data[i]);
                            }
                        }
                        setSearchTrack(array);
                    }
                    else{
                        setSearchTrack(data);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }

    }, [])

    return (
        <>
        <div className="mb-[60px]">
            {
                (page === "all" && hasTrack ) &&
                <Link to={"/search/track?keyword=" + keyword} >
                    <p className="flex items-center font-bold text-[22px] mb-[20px]">
                        곡<RiArrowRightSLine className="mt-[3px]" />
                    </p>
                </Link>
            }
            <MusicListTable page="searchtrack" lank={false} music_list={searchTrack} handleRender={handleRender} />
        </div>
    </>
    )
}

export default SearchTrack