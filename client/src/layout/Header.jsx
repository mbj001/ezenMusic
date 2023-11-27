import React, {useState, useEffect, useContext}  from 'react'
import { Link } from 'react-router-dom'
import { RiSearchLine } from "react-icons/ri";
import styled from 'styled-components';
import { AppContext } from '../App';
import { getCookie } from '../config/cookie';
import axios from 'axios';
import {logoutMethod} from '../methods/logout'
import LogoutConfirm from '../modal/LogoutConfirm';

function Header() {
    const isSessionValid = useContext(AppContext);
    const [ loginStatus, setLoginStatus ] = useState(isSessionValid);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [inputVal, setInputVal] = useState("");
    function searchSubmit(e){
        e.preventDefault();
    }
    const logout = async() =>{
        //setModalOpen(true);

        let serverResponse = await removeServerSession();
        console.log(serverResponse);
        logoutMethod(serverResponse);
    };
    const removeServerSession = async() =>{
        try{
            const isRemovedServerSession = await axios.post('http://localhost:8080/verifiedClient/logout', {token: getCookie('connect.sid')});
            
            if(isRemovedServerSession.data.logoutSuccess){
                return true;
            }else{
                return false;
            }
        }catch(error){
            console.log(error);
            alert('서버와 연결에 실패했습니다. 잠시후에 시도해주세요.');
            window.location = '/';
        }
    }
    useEffect(()=>{
        setLoginStatus(isSessionValid);
    },[isSessionValid]);

    return (
        <StyledHeader className="header-box d-flex justify-content-between align-items-center md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
            {modalOpen && <LogoutConfirm setModalOpen={setModalOpen}/>}
            <div className='header-left-side flex flex-row align-items-center justify-start'>
                <Link to="/" className="logo">
                    EzenMusic
                </Link>
                
                <div className='header-link-area flex align-items-center justify-start px-10'>
                    <div className=''>
                        <Link to="/browse" className="header-chart-link mr-8">
                            <span className="text-[15px]">둘러보기</span>
                        </Link>
                    </div>
                    <div className=''>
                        <Link to="/storage/mylist" className="header-chart-link mr-8">
                            <span className="text-[15px]">보관함</span>
                        </Link>
                    </div>
                    <div className=''>
                        <Link to="/purchase/voucher" className="header-chart-link">
                            <span className="text-[15px]">이용권</span>
                        </Link>
                    </div>
                </div>

                <form className="search-box col-6 position-relative mt-[2px]">
                    <RiSearchLine />
                    <form action={"/search/all"} onSubmit={searchSubmit}>
                        <input type="text" id='search' name="keyward" className="block col-4 header-search" placeholder='검색어를 입력하세요' value={inputVal} onChange={(e) => setInputVal(e.target.value)} />
                        <button type="submit" className="d-none"></button>
                    </form>
                </form>
            </div>
            
            
            <div className='header-right-side'>
                { 
                    loginStatus ==='false' ?             
                    <Link to="/signin" className="header-login-link text-[12px]">로그인</Link>
                    :
                    <button type='button' onClick={logout} className="header-login-link text-[12px]">로그아웃</button>
                }
                {
                    loginStatus === 'false' ?             
                    <Link to="/signup" className="header-login-link text-[12px]">회원가입</Link>
                    :
                    <Link to="/myinfo/password" className="header-login-link text-[12px]">내정보</Link>
                    
                }
            </div>
        </StyledHeader>
    )
}

export default Header
const HeaderCover = styled.div`
    width: 100vw;
    padding: 0 80px;
`;

const StyledHeader = styled.div`
    min-width: 950px;
    height: 100px;
    margin: 0px auto;
    position: sticky; 
    top: 0;
    left: 0;
    z-index: 5000;
    background-color: var(--main-text-white);
    .header-left-side{
        .logo{
            font-size: 24px;
            color: var(--main-text-black);
            text-decoration: none;
            font-weight: 900;
        }
        .header-link-area{
            div{
                white-space: nowrap;
                .header-chart-link{
                    color: var(--main-text-black);
                    text-decoration: none;
                    font-size: 17px;
                    font-weight: 400;
                    &:hover{
                        color: var(--main-theme-color);
                    }
                }
            }
        }
        .search-box{
            >svg{
                position: absolute;
                top: 7px;
                left: 10px;
            }
            .header-search{
                // border: 1px solid var(--main-text-gray);;
                border: 1px solid #dbdbdb;
                border-radius: 20px;
                padding-left: 30px;
                padding-top: 5px;
                padding-bottom: 5px;
                font-size: 14px;
                width: 350px;
                height: 30px;
            }
        }
    }
    .header-right-side{
        .header-login-link{
            color: var(--main-text-gray);
            text-decoration: none;
            // font-size: 14px;
            margin-left: 30px;
            &:hover{
                color: var(--main-theme-color);
            }
        }
    }
`;