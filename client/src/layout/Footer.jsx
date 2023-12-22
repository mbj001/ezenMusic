import React from 'react'
import { AiOutlineGithub, AiOutlineInstagram, AiOutlineMail } from 'react-icons/ai'
import { FiArrowUpRight } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const Footer = () => {
    const locationNow = useLocation();
    if (locationNow.pathname === "/discovery") return null;
    return (
        <>
            <StyledFooter className='pt-4 md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] mx-auto mt-5'>
                <div className='footer-menu-area h-[150px] mb-4 flex justify-between relative'>
                    <div className='flex flex-row justify-start w-full h-full'>
                        <ul className='footer-ul w-[190px] h-[130px]'>
                            <li className='footer-title'>
                                <Link to={''}>고객센터</Link>
                            </li>
                            <li className='footer-title'>
                                <Link to={''}>공지사항</Link>
                            </li>
                        </ul>
                        <ul className='footer-ul w-[190px] h-[130px]'>
                            <li className='footer-title'>
                                EZEN MUSIC 서비스
                            </li>
                            <li>
                                <Link to={''}>크리에이터 스튜디오</Link>
                            </li>
                            <li>
                                <Link to={''}>플레이어 다운로드</Link>
                            </li>
                            <li>
                                <Link to={''}>서비스 소개</Link>
                            </li>
                        </ul>
                        <ul className='footer-ul w-[190px] h-[130px]'>
                            <li className='footer-title'>
                                기업 정보
                            </li>
                            <li>
                                <Link to={''}>회사 소개</Link>
                            </li>
                        </ul>
                        <ul className='footer-ul w-[190px] h-[130px]'>
                            <li className='footer-title'>
                                문의
                            </li>
                            <li>
                                <Link to={''}>
                                    마케팅/ 광고/ 제휴 문의<FiArrowUpRight/>
                                </Link>
                            </li>
                            <li>
                                <Link to={''}>
                                    서비스 이용 문의<FiArrowUpRight/>
                                </Link>
                            </li>
                            <li>
                                <Link to={''}>
                                    음원 유통 문의<FiArrowUpRight/>
                                </Link>
                                
                            </li>
                        </ul>
                    </div>
                    <div className='footer-sns-area flex justify-end absolute top-3 right-0'>
                        <FooterSnsLink to={'https://github.com/mbj001/ezenMusic'}>
                            <AiOutlineGithub />
                        </FooterSnsLink>
                        <FooterSnsLink to={''}>
                            <AiOutlineInstagram />
                        </FooterSnsLink>
                        <FooterSnsLink to={''}>
                            <AiOutlineMail />
                        </FooterSnsLink>
                    </div>
                </div>
                
                <div className='footer-info-area h-[150px]'>
                    <ul className='policy-info-area'>
                        <li>이용약관</li>
                        <li>개인정보 처리방침</li>
                        <li>청소년 보호정책</li>
                        <li>사업자정보 확인</li>
                    </ul>
                    <ul className='contact-info-area upper'>
                        <li>통신판매업 신고번호 : 0000-가나다라-0000</li>
                        <li>사업자 등록번호 : 000-00-00000</li>
                    </ul>
                    <ul className='contact-info-area under'>
                        <li>경기 김포시 김포한강4로 125 월드타워 8층, 10층</li>
                        <li>Ezen@music.com</li>
                    </ul>
                    <div className='copyright-and-available-browser'>
                        <p className='copyright'>
                            이젠아카데미 풀스택반 ezenmusic &copy; ALL RIGHTS RESERVED
                        </p>
                        <p className='available-browser'>
                            본 사이트는 Chrome 및 Microsoft Edge 브라우저에서 사용 가능합니다.
                        </p>
                    </div>
                </div>
            </StyledFooter>
        </>
        
    )
}

export default Footer

const StyledFooter = styled.footer`
    border-top: 1px solid #e0e1e5;
    margin-bottom: 40px;
    .footer-menu-area{
        div{
            .footer-ul{
                li{
                    color: #8e8e93;
                    font-size: 13px;
                    padding: 8px 0;
                    a{
                        &:hover{
                            color: var(--main-theme-color);
                        }
                    }
                }
                .footer-title{
                    color: var(--main-text-black);
                    font-weight: 700;
                }
                &:last-child{
                    li{
                        a{
                            display: flex;
                            flex-direction: row;
                            justify-content: start;
                            align-items: center;
                        }
                    }
                }
            }
        }
    }
    .footer-info-area{
        .policy-info-area, .contact-info-area{
            font-size: 12px;
            color: #8e8e93;
            >li{
                float: left;
                position: relative;
                margin-right: 10px;
                &::after{
                    content: '';
                    display: block; 
                    width: 1px;
                    height: 12px;
                    position: absolute;
                    top: 4px;
                    right: -5px;
                    background-color: #d8d8d8;
                    color: #d8d8d8;
                }
                &:last-child::after{
                    content: '';
                    display: block; 
                    width: 0px !important;
                }
            }
            &::after{
                content: '';
                display: block;
                clear: both;
            }
        }
        .contact-info-area{
            font-size: 11px;
            color: #bcbcc0;
        }
        .upper{
            margin-top: 10px;
        }
        .under{
            margin-bottom: 10px;
        }
    }
    .copyright-and-available-browser{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .copyright{
            font-size: 11px;
            color: #8e8e93;
        }
        .available-browser{
            font-size: 11px;
            color: #cacace;
        }
    }
`;

const FooterSnsLink = styled(Link)`
    width: 20px;
    height: 20px;
    margin-left: 20px;
    >svg{
        width: 100%;
        height: 100%;
    }
`;