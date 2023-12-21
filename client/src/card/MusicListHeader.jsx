import React from 'react'
import styled from 'styled-components';

function MusicListHeader({lank, selectAllFunc, page, allcheckVal}) {

    return (
    <Thead className="h-[40px] align-middle ">
        <tr className="">
            { 
                page !== "searchLyrics" &&
                <StyledTableth scope="col" className="text-center w-[5%]"><input type="checkbox" id="all-check-box" checked={allcheckVal} onClick={selectAllFunc} readOnly/></StyledTableth>
            }
            
            { lank && <StyledTableth scope="col" className="text-center w-[8%]"><p>순위</p></StyledTableth> }
            
            {
                page === "search" || page === "searchLyrics" ?
                <>
                <StyledTableth scope="col"><p>곡/가사</p></StyledTableth>
                <StyledTableth scope="col"><p>아티스트</p></StyledTableth>
                <StyledTableth scope="col"><p>앨범</p></StyledTableth>
                </>
                :
                (
                    page === "detailmylistaddmusic"?
                    <>
                    <StyledTableth scope="col"><p>곡/앨범</p></StyledTableth>
                    <StyledTableth scope="col"><p>아티스트</p></StyledTableth>
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
                )

            }
        </tr>
    </Thead>
    )
}
export default MusicListHeader

const Thead = styled.thead`
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
`;

export const StyledTableth = styled.th`
    font-size: 13px;
    p{
        color: #a0a0a0;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    input[type=checkbox]{
        accent-color: var(--main-theme-color);
        border-color: #d9d9d9;
    }
`

