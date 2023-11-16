import React, { useState } from 'react'
import MainStyledSection from '../layout/MainStyledSection'
import styled from 'styled-components'

const EmailSignUp = () => {
    const [ checkList, setCheckList ] = useState([]); // 전체선택 누르면 여기에 필수체크박스 name 담아주고 일괄 체크

    return (
        <MainStyledSection>
            <Logo className='logo mx-auto mt-5 mb-5'>
                EzenMusic
            </Logo>
            <div className="overflow-hidden">
                <TermBox>
                    <div className='terms'>
                        <p className='title pb-5'>
                            이용약관
                        </p>
                        <div className='detail'>
                            <form className='mb-5'>
                                <label className='w-full flex align-items-center justify-start'>
                                    <input type="checkbox" name='neccessary-term1'/> {/* 여기 name 바꿔줘야 함 */}
                                    <div className='w-full flex justify-between'>
                                        <div>
                                            <span className='necessary' style={{color:'var(--main-theme-color)'}}>(필수)</span> 이용약관
                                        </div>
                                        <div className='see-all'>
                                            <button type='button'>전문보기</button>
                                        </div>
                                    </div>
                                </label>
                                <label className='w-full flex align-items-center justify-start'>
                                    <input type="checkbox" name='neccessary-term2'/> {/* 여기 name 바꿔줘야 함 */}
                                    <div className='w-full flex justify-between'>
                                        <div>
                                            <span className='necessary' style={{color:'var(--main-theme-color)'}}>(필수)</span> 개인정보 수집 및 이용 안내
                                        </div>
                                        <div className='see-all'>
                                            <button type='button'>전문보기</button>
                                        </div>
                                    </div>
                                </label>
                                <label className='w-full flex align-items-center justify-start'>
                                    <input type="checkbox" name='neccessary-term3'/> {/* 여기 name 바꿔줘야 함 */}
                                    <div className='w-full flex justify-between'>
                                        <div>
                                            <span className='necessary' style={{color:'var(--main-theme-color)'}}>(필수)</span> 제 3자 제공 동의
                                        </div>
                                        <div className='see-all'>
                                            <button type='button'>전문보기</button>
                                        </div>
                                    </div>
                                </label>
                                {/* 선택 약관 */}
                                <label className='w-full flex align-items-center justify-start'>
                                    <input type="checkbox" name='choice-term'/> {/* 여기 name 바꿔줘야 함 */}
                                    <div className='w-full flex justify-between'>
                                        <div>
                                            <span className='necessary'>(선택)</span> 제 3자 제공 동의(선택)
                                        </div>
                                        <div className='see-all'>
                                            <button type='button'>전문보기</button>
                                        </div>
                                    </div>
                                </label>
                                <label className='w-full flex align-items-center justify-start'>
                                    <input type="checkbox" name='choice-term'/> {/* 여기 name 바꿔줘야 함 */}
                                    <div className='w-full flex justify-between '>
                                        <div>
                                            <span className='necessary'>(선택)</span> 제 3자 제공 동의(선택)
                                        </div>
                                        <div className='see-all'>
                                            <button type='button'>전문보기</button>
                                        </div>
                                    </div>
                                </label>
                                <label className='w-full flex align-items-start justify-start'>
                                    <input type="checkbox" name='choice-term'/> {/* 여기 name 바꿔줘야 함 */}
                                    <div className='w-full flex justify-between'>
                                        <div className='w-10/12'>
                                            <span className='necessary'>(선택)</span> 이벤트/혜택 알림 제공을 위한 개인정보 수집 및 이용 안내
                                        </div>
                                        <div className='see-all'>
                                            <button type='button'>전문보기</button>
                                        </div>
                                    </div>
                                </label>
                                {/* 전체동의 */}
                                
                                <label className='w-full flex align-items-start justify-start pt-5 pb-10' style={{borderTop:'1px solid #d9d9d9'}}>
                                    <input type="checkbox" name='check-all-necessary'/> {/* 여기 name 바꿔줘야 함 */}
                                    <div className='w-full flex justify-between align-items-center'>
                                        <div className=''>
                                            <span className='font-bold'>전체동의</span>
                                            <p style={{color: 'var(--main-text-gray-lighter)'}}>(선택)이벤트/혜택 알림을 포함하여 모두 동의합니다.</p>
                                        </div>
                                    </div>
                                </label>
                                <Next type='button'>
                                    다음
                                </Next>
                            </form>
                        </div>
                    </div>
                </TermBox>
            </div>
        </MainStyledSection>
    )
}

export default EmailSignUp
const Logo = styled.div`
    font-size: 30px;
    color: var(--main-theme-color);
    text-decoration: none;
    font-weight: 900;
`;

const TermBox = styled.div`
    width: 700px;
    height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    padding: 60px 120px;
    border: 1px solid #d9d9d9;
    .terms{
        width: 100%;
        height: 100%;
        .title{
            color: #181818;
            font-size: 30px;
            font-weight: 700;
            text-align: center;
        }
        .detail{
            border-top: 1px solid #d9d9d9;
            // border-bottom: 1px solid #d9d9d9;
            >form{
                label{
                    input{
                        width: 30px;
                        height: 30px;
                        margin-right: 10px;
                    }
                    height: 30px;
                    margin: 30px 0;
                    font-size: 17px;
                    font-weight: 400;
                    >div{
                        .see-all{
                            color: #929292;
                            font-size: 15px;
                            font-weight: 300;
                        }
                    }
                }
                input[type=checkbox]{
                    accent-color: var(--main-theme-color);
                    border-color: #d9d9d9;
                }
            }
        }
    }
`;

const Next = styled.button`
    width: 100%;
    height: 70px;
    color: var(--main-text-white);
    background-color: var(--main-theme-color);
    font-size: 19px;
    font-weight: 600;

`;