import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {voucherSwitch} from '../methods/voucherSwitch'
import {planDescription} from '../data/planTypeDescriptions' 
import { TbMusicCheck } from "react-icons/tb";
import axios from 'axios';
import { getCookie } from '../config/cookie';
import AlreadyHaveVoucher from './AlreadyHaveVoucher';
import PurchaseSuccess from './PurchaseSuccess';
import AlreadyHaveStandbyVoucher from './AlreadyHaveStandbyVoucher';

const PurchaseVoucher = ({setModalOpen, plan_type}) => {
    const [ alreadyHave, setAlreadyHave ] = useState(false);
    const [ standby, setStandby ] = useState(false);
    const [ currentVoucherEndDate, setCurrentVoucherEndDate ] = useState('');
    const [ keepGoing, setKeepGoing ] = useState('');
    const [ newModalOpen, setNewModalOpen ] = useState(false);
    const [ plan, setPlan ] = useState([]);
    const [ userConfirm, setUserConfirm ] = useState(false);
    const [ success, setSuccess ] = useState(false);

    const confirmCheckboxRef = useRef();

    let userchoiceplan = plan.description;

    const check = async()=>{
        const check = await axios.post('/verifiedClient/checkCurrentVoucher', {token: getCookie('connect.sid'), user_id: getCookie('client.sid')});
        if(check.data.standbyVoucher){
            setStandby(true);
        }else{
            setStandby(false);
        }
        if(check.data.currentVoucher){
            setAlreadyHave(true);
            setCurrentVoucherEndDate(check.data?.renewalDate);
        }else{
            setAlreadyHave(false);
        }
    }

    const buy = async(e) => {
        if(userConfirm){
            if(alreadyHave && !keepGoing){
                setNewModalOpen(true);
            }else{
                const userData = {
                    token: getCookie('connect.sid'),
                    user_id: getCookie('client.sid'),
                    type: plan_type,
                    database: '',
                    currentVoucher: alreadyHave,
                    currentVoucherEndDate: currentVoucherEndDate
                }
                alreadyHave ? userData.database = 'standby_voucher' : userData.database = 'voucher';
                const res = await axios.post('/verifiedClient/buy', userData);
                if(res.data.success === false){ 
                    setSuccess(false);
                }else{
                    setSuccess(true);
                }
            }
        }
    }

    const handleUserConfirm = () => {
        if(confirmCheckboxRef.current.checked){
            setUserConfirm(true);
        }else{
            setUserConfirm(false);
        }
    }

    useEffect(()=>{
        check();
        planDescription.forEach((list, index)=>{
            if(plan_type === list.type){
                setPlan(list);
            }
        });
    }, []);
    
    const closeModal = () =>{
        setModalOpen(false);
    }

    useEffect(()=>{
        if(keepGoing !== '' && keepGoing === false){
            closeModal();
        }
    }, [keepGoing]);

    return (
        <StyledModal>
            {success && <PurchaseSuccess setModalOpen={setSuccess}/>}
            {!standby && !keepGoing && newModalOpen && <AlreadyHaveVoucher setModalOpen={setNewModalOpen} setKeepGoing={setKeepGoing}/>}
            {standby && <AlreadyHaveStandbyVoucher setModalOpen={setModalOpen} />}
            <div className='modal-box'>
                <div className='purchase-title'>
                    <Logo className='logo mb-10' >
                        EzenMusic
                    </Logo>
                    <p className='user-choice'>
                        {voucherSwitch(plan_type)}
                    </p>
                </div>
                
                <div className='purchase-price'>
                    <div>
                        <span className='priceof'>기본금액</span>
                        <span className='price'>{plan.originalPrice}</span>
                    </div>
                    <div>
                        <span className='priceof'>할인적용</span>
                        <span className='price discount'>-{plan.originalPrice - plan.discountPrice}</span>
                    </div>
                    <div>
                        <span className='priceof total'>최종결제금액</span>
                        <span className='price total'>{plan.discountPrice}</span>
                    </div>
                </div>
                <div className='purchase-decription'>
                    {
                        userchoiceplan && userchoiceplan.map((list)=>{
                            return (
                            <div>
                                <span><TbMusicCheck /></span> 
                                <p>
                                    {list}
                                </p>
                            </div>
                            )
                        })
                    }
                </div>
                <div className='confirm'>
                    <input type="checkbox" ref={confirmCheckboxRef} onChange={handleUserConfirm}/>
                    위 사항을 전부 확인하였으며 결제에 동의합니다.
                </div>
                <div className='buttons'>
                    <button type='button' className='cancel' onClick={() => closeModal()}>
                        결제취소
                    </button>
                    <button type='button' className={userConfirm ? 'buy active' : 'buy'} onClick={() => buy()}>
                        결제하기
                    </button>
                </div>
            </div>
        </StyledModal>
    )
}

export default PurchaseVoucher

const Logo = styled.div`
    font-size: 30px;
    color: var(--main-theme-color);
    text-decoration: none;
    font-weight: 900;
    text-align: center;
`;

const StyledModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999999999;
    background-color: rgba(0,0,0,0.6);
    .modal-box{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 500px;
        height: 600px;
        padding: 30px;
        border-radius: 5px;
        background-color: var(--main-background-white);
        color: var(--main-text-black);
        opacity: 1;
        display: flex;
        align-items: start;
        justify-content: center;
        flex-direction: column;

        .purchase-title{
            width: 100%;
            .inner-title{
                width: 100%;
                text-align: center;
                font-size: 30px;
                font-weight: 700;
                margin-bottom: 30px;
            }
            .user-choice{
                width: 100%;
                height: 50px;
                background-color: var(--main-theme-color);
                color: var(--main-text-white);
                font-size: 19px;
                text-align: center;
                line-height: 50px;
            }
        }
        .purchase-price{
            width: 100%;
            border: 1px solid var(--main-theme-color);
            padding: 20px 0 ;
            div{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 5px 10px;
                .priceof{
                    color: #aaa;
                    font-size: 16px;
                }
                .priceof.total{
                    color: #000;
                }
                .price{
                    font-size: 16px;
                    color: #333;
                }
                .price.discount{
                    color: #db2359;
                }
                .price.total{
                    font-size: 22px;
                    font-weight: 600;
                    color: var(--main-theme-color);
                }
            }
        }
        .purchase-decription{
            width: 100%;
            margin-top: 20px;
            margin-bottom: 20px;

            div{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: start;
                span{
                    width: 30px;
                    height: 30px;
                    svg{
                        display: inline-block;
                        width: 100%;
                        heigth: 100%;
                    }
                }
                p{

                }
            }
        }
        .confirm{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: start;
            margin-bottom: 20px;
            color: #333;
            font-size: 16px;
            font-wieght: 500;
            input[type=checkbox]{
                width: 20px;
                height: 20px;
                margin-right: 5px;
                accent-color: var(--main-theme-color);
                border-color: #d9d9d9;
            }
        }
        .buttons{
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .cancel{
                width: 47%;
                height: 36px;
                padding: 0 15px;
                font-size: 14px;
                color: #fff;
                background-color: var(--main-text-gray);
                &:hover{
                    opacity: 0.9;
                }
            }
            .buy{
                width: 47%;
                height: 36px;
                padding: 0 15px;
                font-size: 14px;
                color: #fff;
                background-color: var(--main-theme-color);
                opacity: 0.2;
            }
            .buy.active{
                opacity: 1;
                &:hover{
                    opacity: 0.9;
                }
            }
        }
    }
`;