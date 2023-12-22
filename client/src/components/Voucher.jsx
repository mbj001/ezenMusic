import React, { useState, useContext } from 'react'
import { PurchaseBox } from '../layout/PurchaseBoxLayout'
import styled from 'styled-components'
import { BiChevronRight } from 'react-icons/bi'
import PurchaseVoucher from '../modal/PurchaseVoucher'
import PleaseLoginMessage from '../modal/PleaseLoginMessage';
import { AppContext } from '../App'
import VoucherDetail from '../modal/VoucherDetail'

const Voucher = () => {
    const isSessionValid = JSON.parse(useContext(AppContext));
    const [ type, setType ] = useState('');
    const [ modalOpen, setModalOpen ] = useState(false);
    const [loginRequestVal, setLoginrRequestVal] = useState(false);
    const [detailModapOpen, setDetailModalOpen] = useState(false);
    const [detailDivision, setDetailDivision] = useState("");

    const handleBuyButton = (value) => {
        setType(value);
        setModalOpen(true);
    }

    return (
        <div>
            { loginRequestVal && <PleaseLoginMessage setLoginrRequestVal={setLoginrRequestVal} /> }
            { detailModapOpen && <VoucherDetail setDetailModalOpen={setDetailModalOpen} detailDivision={detailDivision} /> }
            { modalOpen && <PurchaseVoucher setModalOpen={setModalOpen} plan_type={type}/> }
            <PurchaseBox>
                <div className="container">
                    <div className='row h-100'>
                        <VoucherTitle className='col-5 flex flex-col justify-between'>
                            <div className='purchase-description'>
                                <p className='purchase-info-title'>무제한 듣기</p>
                                <p className='purchase-info-description'>기기제한 없음, 무제한 스트리밍</p>
                            </div>
                            <div className='more-info'>
                                <button type='button' className='flex flex-row align-items-center' onClick = {() => {setDetailModalOpen(true); setDetailDivision("no_limit");}}>
                                    이용권 자세히 보기<BiChevronRight/>
                                </button>
                            </div>
                        </VoucherTitle>
                        <div className='col-7'>
                            <div className='row px-8'>
                                <div className="col-12 h-8 mb-8 flex justify-between align-items-center">
                                    <div className='ticket-type' style={{color:"#181818"}}>
                                        1일 이용권
                                    </div>
                                    <div className='purchase-info flex justify-end align-items-center'>
                                        <div>
                                            <del className='text-[13px] inline-block' style={{color:"#bdbdbd"}}>
                                                정가 5,000원
                                            </del>
                                            <span className='ml-3 text-[20px]' style={{color:"var(--main-theme-color)"}}>1,500</span>
                                            <span className='mr-6 text-[16px]' style={{color:"var(--main-theme-color)"}}>원</span>
                                        </div>
                                        <BuyButton value={'oneday'} onClick={isSessionValid? (e) => handleBuyButton(e.target.value) : () => setLoginrRequestVal(true)}>구매</BuyButton>
                                    </div>
                                </div>
                                <div className="col-12 h-8 mb-8 flex justify-between align-items-center">
                                    <div className='ticket-type' style={{color:"#181818"}}>
                                        1주 이용권
                                    </div>
                                    <div className='purchase-info flex justify-end align-items-center'>
                                        <div>
                                            <del className='text-[13px] inline-block' style={{color:"#bdbdbd"}}>
                                                정가 15,000원
                                            </del>
                                            <span className='ml-3 text-[20px]' style={{color:"var(--main-theme-color)"}}>8,000</span>
                                            <span className='mr-6 text-[16px]' style={{color:"var(--main-theme-color)"}}>원</span>
                                        </div>
                                        <BuyButton value={'oneweek'} onClick={isSessionValid? (e) => handleBuyButton(e.target.value) : () => setLoginrRequestVal(true)}>구매</BuyButton>
                                    </div>
                                </div>
                                <div className="col-12 h-8 mb-8 flex justify-between align-items-center">
                                    <div className='ticket-type' style={{color:"#181818"}}>
                                        2주 이용권
                                    </div>
                                    <div className='purchase-info flex justify-end align-items-center'>
                                        <div>
                                            <del className='text-[13px] inline-block' style={{color:"#bdbdbd"}}>
                                                정가 20,000원
                                            </del>
                                            <span className='ml-3 text-[20px]' style={{color:"var(--main-theme-color)"}}>13,000</span>
                                            <span className='mr-6 text-[16px]' style={{color:"var(--main-theme-color)"}}>원</span>
                                        </div>
                                        <BuyButton value={'twoweek'} onClick={isSessionValid? (e) => handleBuyButton(e.target.value) : () => setLoginrRequestVal(true)}>구매</BuyButton>
                                    </div>
                                </div>
                                <div className="col-12 h-8 mb-8 flex justify-between align-items-center">
                                    <div className='ticket-type' style={{color:"#181818"}}>
                                        1개월 이용권
                                    </div>
                                    <div className='purchase-info flex justify-end align-items-center'>
                                        <div>
                                            <del className='text-[13px] inline-block' style={{color:"#bdbdbd"}}>
                                                정가 25,000원
                                            </del>
                                            <span className='ml-3 text-[20px]' style={{color:"var(--main-theme-color)"}}>17,000</span>
                                            <span className='mr-6 text-[16px]' style={{color:"var(--main-theme-color)"}}>원</span>
                                        </div>
                                        <BuyButton value={'onemonth'} onClick={isSessionValid? (e) => handleBuyButton(e.target.value) : () => setLoginrRequestVal(true)}>구매</BuyButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PurchaseBox>
            <PurchaseBox>
                <div className="container">
                    <div className='row h-100'>
                        <VoucherTitle className='col-5 flex flex-col justify-between'>
                            <div className='purchase-description'>
                                <p className='purchase-info-title'>50회 듣기 </p>
                                <p className='purchase-info-description'>기기제한 없음, 횟수 내 무제한 스트리밍</p>
                            </div>
                            <div className='more-info'>
                                <button type='button' className='flex flex-row align-items-center' onClick = {() => {setDetailModalOpen(true); setDetailDivision("count_50");}}>
                                    이용권 자세히 보기<BiChevronRight/>
                                </button>
                            </div>
                        </VoucherTitle>
                        <div className='col-7'>
                            <div className='row px-8 pt-5'>
                                <div className="col-12 h-8 mb-8 flex justify-between align-items-center">
                                    <div className='ticket-type' style={{color:"#181818"}}>
                                        1개월 이용권
                                    </div>
                                    <div className='purchase-info flex justify-end align-items-center'>
                                        <div>
                                            <del className='text-[13px] inline-block' style={{color:"#bdbdbd"}}>
                                                정가 10,000원
                                            </del>
                                            <span className='ml-3 text-[20px]' style={{color:"var(--main-theme-color)"}}>8,000</span>
                                            <span className='mr-6 text-[16px]' style={{color:"var(--main-theme-color)"}}>원</span>
                                        </div>
                                        <BuyButton value={'onlyfifty'} onClick={isSessionValid? (e) => handleBuyButton(e.target.value) : () => setLoginrRequestVal(true)}>구매</BuyButton>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </PurchaseBox>
            <PurchaseBox>
                <div className="container">
                    <div className='row h-100'>
                        <VoucherTitle className='col-5 flex flex-col justify-between'>
                            <div className='purchase-description'>
                                <p className='purchase-info-title'>100회 듣기 </p>
                                <p className='purchase-info-description'>기기제한 없음, 횟수 내 무제한 스트리밍</p>
                            </div>
                            <div className='more-info'>
                                <button type='button' className='flex flex-row align-items-center' onClick = {() => {setDetailModalOpen(true); setDetailDivision("count_100");}}>
                                    이용권 자세히 보기<BiChevronRight/>
                                </button>
                            </div>
                        </VoucherTitle>
                        <div className='col-7'>
                            <div className='row px-8 pt-5'>
                                <div className="col-12 h-8 mb-8 flex justify-between align-items-center">
                                    <div className='ticket-type' style={{color:"#181818"}}>
                                        1개월 이용권
                                    </div>
                                    <div className='purchase-info flex justify-end align-items-center'>
                                        <div>
                                            <del className='text-[13px] inline-block' style={{color:"#bdbdbd"}}>
                                                정가 15,000원
                                            </del>
                                            <span className='ml-3 text-[20px]' style={{color:"var(--main-theme-color)"}}>13,000</span>
                                            <span className='mr-6 text-[16px]' style={{color:"var(--main-theme-color)"}}>원</span>
                                        </div>
                                        <BuyButton value={'onlyhundred'} onClick={isSessionValid? (e) => handleBuyButton(e.target.value) : () => setLoginrRequestVal(true)}>구매</BuyButton>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </PurchaseBox>
        </div>
    )
}

export default Voucher

const BuyButton = styled.button`
    padding: 5px 15px;
    border-radius: 30px;
    font-size: 17px;
    font-weight: 400;
    background-color: var(--main-theme-color);
    color: var(--main-text-white);
`;

const VoucherTitle = styled.div`
    border-right: 1px solid rgba(0,0,0,.03);
    .purchase-description{
        .purchase-info-title{
            margin-top: 4px;
            font-size: 20px;
            font-weight: 600;
            line-height: 1.2;
            color: #000;
        }
        .purchase-info-description{
            margin-top: 5px;
            font-size: 13px;
            line-height: 20px;
            color: #555;
        }
    }
    .more-info{
        >button{
            font-size: 13px;
            color: #929292;
            background-size: 100% 100%;
            >svg{
                width: 15px;
                height:inherit;
            }
        }
        
    }
`;
