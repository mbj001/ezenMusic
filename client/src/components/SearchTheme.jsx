import React, {useState, useEffect} from 'react'
import Axios from "axios"
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { RiArrowRightSLine } from "react-icons/ri";

function SearchTheme({keyward, page}) {

    const [searchTheme, setSearchTheme] = useState([]);
    const [hasTheme, setHasTheme] = useState(false);

    useEffect(() => {
        Axios.get("/ezenmusic/search/theme/"+keyward)
        .then(({data}) => {
            if(data.length == 0){
                setHasTheme(false);
            }
            else{
                setHasTheme(true);
                setSearchTheme(data);
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }, [])

    return (
        <>
        {
            page === "all" && hasTheme?
            <Link to={"/search/theme?keyward=" + keyward} ><p className="flex items-center font-bold text-[22px] mb-[20px]">테마리스트<RiArrowRightSLine className="mt-[3px]" /></p></Link>
            :
            ""
        }

        <StyledSearchTheme>
            {
                searchTheme.map((item, index) => (
                    <div key={index} className="themebox mr-[50px] w-[160px] h-[210px]">
                        <Link to={"/detail/channel/"+item.themeplaylist_id}><img src={"/image/themeplaylist/"+item.org_cover_image} alt="theme_cover_image" className="w-[160px] h-[160px] rounded-[10px]" /></Link>
                        <p className="mt-[10px] text-[15px]">{item.themeplaylist_title}</p>
                    </div>
                ))
            }
        </StyledSearchTheme>
        </>
    )
}

const StyledSearchTheme = styled.div`
    display: flex;
    margin-bottom: 60px;

    .themebox{
        // white-space: nowrap;
        overflow: hidden;
        // display:-webkit-box;
        // -webkit-line-clamp:2;
        // -webkit-box-orient:vertical;
    }

    img:hover{
        filter: brightness(70%)
    }
`

export default SearchTheme