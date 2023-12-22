import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'

const PurchaseSuccess = ({setModalOpen}) => {
    const closeModal = () =>{
        setModalOpen(false);
    }
    return (
        <StyledSuccessModal>
            <div className='success-modal-box'>
                <p>
                    이용권 구매가 완료되었습니다. <br />
                    EZEN MUSIC을 즐겨보세요!
                </p>
                <button type='button' onClick={() => closeModal()}>
                    <Link to={'../../'}>
                        메인 페이지로 이동하기
                    </Link>
                </button>
            </div>
        </StyledSuccessModal>
    )
}

export default PurchaseSuccess

const StyledSuccessModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999999999999999;
    background-color: rgba(0,0,0,0.6);
    .success-modal-box{
        position: fixed;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 200px;
        border-radius: 5px;
        background-color: var(--main-background-white);
        color: var(--main-text-black);
        opacity: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        p{
            font-size: 15px;
            line-height: 1.47;
            color: #484848;
            text-align: center;
            margin-bottom: 28px;
        }
        button{
            min-width: 85px;
            height: 36px;
            padding: 0 15px;
            font-size: 14px;
            line-height: 36px;
            color: #fff;
            text-align: center;
            background-color: #3f3fff;
            border-radius: 5px;
            a{
                width: 100%;
                height: 100%;
            }
        }
    }
`;