import React, {useState, useEffect}  from 'react'
import { Link } from 'react-router-dom'
import "./header.css"
import { RiSearchLine } from "react-icons/ri";


function Header() {
    const [loginStatus, setLoginStatus] = useState(true);

    useEffect(() => {
        
    }, []);

    return (
    <>
    <div className="header-box d-flex justify-content-between align-items-center">
            <Link to="/" className="logo">EzenMusic</Link>
            <Link to="#" className="header-chart-link">인기차트</Link>
            <Link to="#" className="header-chart-link">최신음악</Link>
            <Link to="#" className="header-chart-link">장르음악</Link>
            <Link to="#" className="header-chart-link">보관함</Link>
            <Link to="#" className="header-chart-link">이용권</Link>
            <div className="col-6 position-relative">
                <RiSearchLine className="position-absolute header-search-icon" />
                <input type="text" className="block col-4 header-search" placeholder='검색어를 입력하세요'/>
            </div>
            { 
                loginStatus ?             
                <Link to="#" className="header-login-link">로그인</Link>
                :
                <Link to="#" className="header-login-link">로그아웃</Link>
            }
            {
                loginStatus ?             
                <Link to="#" className="header-login-link">회원가입</Link>
                :
                <Link to="#" className="header-login-link">내정보</Link>
                
            }
    </div>
    </>
    )
}

export default Header