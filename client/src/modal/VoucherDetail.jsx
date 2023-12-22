import React from 'react'
import styled from 'styled-components'

const VoucherDetail = ({setDetailModalOpen, detailDivision}) => {
    return (
        <StyledVoucherDetail>
            <div className="modal-box">
                <div className="bg-blue h-[70px] flex items-center pl-[30px]">
                    { detailDivision === "no_limit" && <p className="text-white text-[14px] ">무제한 듣기</p> }
                    { detailDivision === "count_50" && <p className="text-white text-[14px] ">50회 듣기</p> }
                    { detailDivision === "count_100" && <p className="text-white text-[14px] ">100회 듣기</p> }
                </div>
                <div className="pl-[15px] pt-[15px] mb-[10px]">
                    { detailDivision === "no_limit" && <p className="text-[11px] mb-[20px]">기기제한 없이 무제한으로 음악 스트리밍이 가능한 이용권입니다.</p> }
                    { detailDivision === "count_50" && <p className="text-[11px] mb-[20px]">기기제한 없이 총 50회 스트리밍이 가능한 횟수 제한 이용권입니다.</p> }
                    { detailDivision === "count_100" && <p className="text-[11px] mb-[20px]">기기제한 없이 총 100회 스트리밍이 가능한 횟수 제한 이용권입니다.</p> }
                    <p className="text-[11px]">사용 가능한 기기</p>
                </div>
                <table className="text-center m-auto text-[11px] w-[350px]">
                    <tr className="bg-gray-morelight h-[30px]">
                        <th scope="col" className="">기기</th>
                        <th scope="col" className="">무제한 듣기</th>
                    </tr>
                    <tr className="text-center h-[30px]">
                        <td className="text-gray">모바일/태블릿</td>
                        <td className="text-gray">○</td>
                    </tr>
                    <tr className="text-center h-[30px]">
                        <td className="text-gray">PC</td>
                        <td className="text-gray">○</td>
                    </tr>
                    <tr className="text-center h-[30px]">
                        <td className="text-gray">AI 스피커</td>
                        <td className="text-gray">○</td>
                    </tr>
                    <tr className="text-center h-[30px]">
                        <td className="text-gray">T mapXNUGU</td>
                        <td className="text-gray">○</td>
                    </tr>
                </table>
                <p className="text-[11px] text-red pl-[15px] mt-[20px]">* 위의 줄력장치는 실제와는 무관함을 알려드립니다.</p>
                <div className="mt-[60px] text-center">
                    <span className="text-[13px] border-1 border-gray-light hover-border-blue text-blue mr-[10px] px-[27px] py-[7px] rounded-[5px] cursor-pointer" onClick={() => setDetailModalOpen(false)}>확인</span>
                    {/* <Link to="/signin" className="text-[13px] border-1 border-blue bg-blue text-white px-[27px] py-[7px] rounded-[5px] hover-bg-deepblue cursor-pointer">확인</Link> */}
                </div>
            </div>
        </StyledVoucherDetail>
        )
}

export const StyledVoucherDetail = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;

    .modal-box{
        width: 400px;
        height: 450px;
        background-color: white;
        // text-align: center;
    }
`

export default VoucherDetail