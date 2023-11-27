import React, {useState, useEffect} from 'react'
import styled from 'styled-components';

function MusicListHeader({lank, setAllcheckVal, page, allcheckVal}) {

    function allcheckFunc(e){
        setAllcheckVal(e.target.checked);
    }

    return (
    <thead className="h-[50px] align-middle ">
        <tr className="">
            <StyledTableth scope="col" className="text-center w-[5%]"><input type="checkbox" id="all-check-box" checked={allcheckVal} onClick={allcheckFunc} /></StyledTableth>
            {
                lank?
                <StyledTableth scope="col" className="text-center w-[8%]"><p>순위</p></StyledTableth>
                :
                ""
            }
            {
                page === "search"?
                <>
                <StyledTableth scope="col"><p>곡/가사</p></StyledTableth>
                <StyledTableth scope="col"><p>아티스트</p></StyledTableth>
                <StyledTableth scope="col"><p>앨범</p></StyledTableth>
                </>
                :
                <>
                <StyledTableth scope="col"><p>곡/앨범</p></StyledTableth>
                <StyledTableth scope="col"><p>아티스트</p></StyledTableth>
                <StyledTableth scope="col" className="text-center"><p>듣기</p></StyledTableth>
                <StyledTableth scope="col" className="text-center"><p>재생목록</p></StyledTableth>
                <StyledTableth scope="col" className="text-center"><p>내 리스트</p></StyledTableth>
                <StyledTableth scope="col" className="text-center"><p>더보기</p></StyledTableth>
                </>

            }
        </tr>
    </thead>
    )
}


export const StyledTableth = styled.th`
    font-size: 12px;

    p{
        color: var(--main-text-gray);
        font-weight: 400;
    }
`


export default MusicListHeader