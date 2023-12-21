import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const PleaseBuyVoucher = ({setVoucherModalOpen}) => {
    return (
        <StyledBuyVoucherModal>
            <div className="modal-box">
                <p className="text-[14px]">이용권을 구매하셔야 이용이 가능합니다.</p>
                <p className="text-[14px]">이용권 페이지로 이동하시겠습니까?</p>
                <div className="mt-[50px]">
                    <span className="text-[13px] border-1 border-gray-light hover-border-blue text-blue mr-[10px] px-[27px] py-[7px] rounded-[5px] cursor-pointer" onClick={() => setVoucherModalOpen(false)}>취소</span>
                    <Link to="/purchase/voucher" className="text-[13px] border-1 border-blue bg-blue text-white px-[27px] py-[7px] rounded-[5px] hover-bg-deepblue cursor-pointer" onClick={() => setVoucherModalOpen(false)}>이동</Link>
                </div>
            </div>
        </StyledBuyVoucherModal>
        )
}

export const StyledBuyVoucherModal = styled.div`
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
        height: 180px;
        background-color: white;
        border-radius: 10px;
        text-align: center;
        padding-top: 30px;
    }
`

export default PleaseBuyVoucher