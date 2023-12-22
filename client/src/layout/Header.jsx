import React, {useState, useEffect, useContext, useRef}  from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiSearchLine } from "react-icons/ri";
import styled from 'styled-components';
import { AppContext } from '../App';
import { getCookie, removeCookie, setCookie } from '../config/cookie';
import axios from 'axios';
import {logoutMethod} from '../methods/logout'
import LogoutConfirm from '../modal/LogoutConfirm';
import { BsSuitHeart } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { MdArrowForwardIos } from "react-icons/md";
import { voucherSwitch } from '../methods/voucherSwitch';
import CreateCharacterModal from '../modal/CreateCharacterModal'
import { IoMdCheckmark } from "react-icons/io";
import { sessionExpiredLogoutMethod } from '../methods/sessionExpired';

function Header() {
    const isSessionValid = JSON.parse(useContext(AppContext));

    const [ modalOpen, setModalOpen ] = useState(false);
    const [ confirmLogout, setConfirmLogout ] = useState(false);

    const [ character, setCharacter ] = useState([]);
    const [ characterNumber, setCharacterNumber ] = useState('');
    const [ additionalData, setAdditionalData ] = useState([]);
    const [ openPopup, setOpenPopup ] = useState(false);
    const [ createCharacterModalOpen, setCreateCharacterModalOpen ] = useState(false);
    const [ selectedCharacter, setSelectedCharacter ] = useState(0);
    const [ pfimg, setpfimg ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ activePage, setActivePage ] = useState(0);

    const locationPath = useLocation().pathname;

    const popupRef = useRef();
    const openerRef = useRef();

    const getCharacterData = async() => {
        const characterData = await axios.post('/verifiedClient/getCharacter', {token: getCookie('connect.sid'), user_id: getCookie('client.sid')});
        if(characterData.data.valid === false){
            sessionExpiredLogoutMethod(true);
        }else{
            let url = [];
            let arr = [];
            const chardata = characterData.data.slice(0, characterData.data.length-1);
            chardata.forEach((char)=>{
                arr.push(char?.profile_image);
            });
            if(!arr.includes('character01.png')){
                url.push(1);
            }
            if(!arr.includes('character02.png')){
                url.push(2);
            }
            if(!arr.includes('character03.png')){
                url.push(3);
            }
            setCharacterNumber(url[0]);
            
            setCharacter(characterData.data.filter((item, index) => index < characterData.data.length - 1));
            
            const additional = characterData.data.pop();
            additional.plan_type = voucherSwitch(additional.plan_type);
            setAdditionalData(additional);
            setLoading(false);
        }
    }

    const createCharacter = () => {
        setOpenPopup(false);
        setCreateCharacterModalOpen(true);
    }

    const changeCharacter = async(clickedId) =>{
        if(getCookie('pfimg') === clickedId){
            setOpenPopup(false);
        }else{
            const response = await axios.post('/verifiedClient/getCharacterData', {token: getCookie('connect.sid'), user_id: getCookie('client.sid'), characterNum: clickedId});

            if(response.data){
                removeCookie('character.sid', {
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });
                removeCookie('pfimg', {
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });

                setCookie('character.sid', response.data.character_id, {
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });
                setCookie('pfimg', response.data.character_num, {
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });

                window.location = '/';
            }else{
    
            }
        }
    }

    const open = (e) => {
        e.preventDefault();
        if(openPopup){
            setOpenPopup(false);    
        }else{
            setOpenPopup(true);
        }
    }

    const close = () => {
        setOpenPopup(false); 
    }

    const logoutModalOpen = () => {
        setModalOpen(true);
    }

    const logout = async() =>{
        let serverResponse = await removeServerSession();
        logoutMethod(serverResponse);
    };

    const removeServerSession = async() =>{
        try{
            const isRemovedServerSession = await axios.post('/verifiedClient/logout', {token: getCookie('connect.sid')});
            
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
        character.forEach((data, index)=>{
            if(getCookie('pfimg') === data.character_num){
                setSelectedCharacter(index);
            }
        });
    },[character]);

    useEffect(()=>{
        if(!modalOpen && confirmLogout){
            logout();
        }
    }, [modalOpen, confirmLogout])

    useEffect(()=>{
        setLoading(true);
        if(isSessionValid){
            getCharacterData();
            if(getCookie('pfimg') === undefined || getCookie('pfimg') === null){
                setCookie('character.sid', getCookie('client.sid')+'#ch01' ,{
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });
                setCookie('pfimg', 1,{
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });
                setpfimg(1);
            }else{
                setpfimg(getCookie('pfimg'));
            }
        }
    },[])

    function activeFunc(num){
        setActivePage(num);
    }

    useEffect(() => {
        if(locationPath.indexOf("/browse") != -1){
            setActivePage(1);
        }
        else if(locationPath.indexOf("/storage") != -1){
            setActivePage(2);
        }
        else if(locationPath.indexOf("/purchase") != -1){
            setActivePage(3);
        }
        else{
            setActivePage(0);    
        }
    }, [useLocation().pathname])


    useEffect(() => {
        function handleClickOutside(e){
            if(openPopup === true && createCharacterModalOpen === true){
                return;
            }else{
                if(popupRef.current && !popupRef.current.contains(e.target)) {
                    if(openerRef.current.contains(e.target)){
                        return;
                    }else{
                        setOpenPopup(false);
                    }
                }
            }
        }
        if(openPopup === true && createCharacterModalOpen === true){
            document.removeEventListener("mousedown", handleClickOutside);
        }else{
            document.addEventListener("mousedown", handleClickOutside);
        }
    }, [openPopup, createCharacterModalOpen]);


    const locationNow = useLocation();
    if(locationNow.pathname === "/discovery"){
        return null;  
    }

    
    
    return (
        // 12.13
        <>
        {/* StyledHeader가 fixed로 바뀔 때 Header가 빈 공간이 되어 따로 채워줄 용도의 박스 */}
        {/* <div className={scrollPosition < 100 ? "h-[100px]" : "h-[100px]"}></div> */}
        <div className="h-[100px]"></div>
        {/* y좌표로 100픽셀 내려갔을 때 StyledHeader의 Position을 sticky에서 fixed로 바꿈 (화면을 내렸을 때 검색창에 타이핑하면 화면이 올라가는 현상 때문에) */}
        {/* <StyledHeader className={scrollPosition < 100 ? "header-box d-flex fixed justify-content-between align-items-center md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]" : "header-box d-flex fixed justify-content-between align-items-center md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]"}> */}
        <StyledHeader className="header-box d-flex justify-content-between align-items-center md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px]">
        {/* 최 하단의 빈 </>박스도 포함 */}
            {createCharacterModalOpen && <CreateCharacterModal setModalOpen={setCreateCharacterModalOpen} characterNumber={characterNumber}/>}
            {modalOpen && <LogoutConfirm setModalOpen={setModalOpen} setConfirmLogout={setConfirmLogout}/>}
            <div className='header-left-side flex flex-row align-items-center justify-start'>
                <Link to="/" className="logo mt-[5px]" onClick={() => activeFunc(0)}>
                    
                </Link>
                <div className='header-link-area flex align-items-center justify-start px-10'>
                    <div className=''>
                        <Link to="/browse" className={activePage === 1 ? "active mr-8" : "header-chart-link mr-8"} onClick={() => activeFunc(1)}>
                            <span className="text-[15px]">둘러보기</span>
                        </Link>
                    </div>
                    <div className=''>
                        <Link to="/storage/mylist" className={activePage === 2 ? "active mr-8" : "header-chart-link mr-8"} onClick={() => activeFunc(2)}>
                            <span className="text-[15px]">보관함</span>
                        </Link>
                    </div>
                    <div className=''>
                        <Link to="/purchase/voucher" className={activePage === 3 ? "active" : "header-chart-link"} onClick={() => activeFunc(3)}>
                            <span className="text-[15px]">이용권</span>
                        </Link>
                    </div>
                </div>

                <div className="search-box col-6 position-relative mt-[2px]">
                    <RiSearchLine />
                    {/* 12.13 검색 form 하단 주석이 원래 form*/}
                    <form action={"/search/all"}>
                        <input type="text" id='search' name="keyword" className=" col-4 header-search" placeholder='검색어를 입력하세요'/>
                        <button type="submit" className="d-none"></button>
                    </form>
                </div>
            </div>
            
            <div className='header-right-side relative'>
                {
                    isSessionValid ? 
                    <MyInfoCover >
                        <button type='button' onClick={open} ref={openerRef}>
                            <span className='character-name'>
                                {character && character[selectedCharacter]?.character_name}
                            </span>
                            <span className='profile-image'>
                                <img src={loading? `/image/character/loadingCircle.png` : `/image/character/${character[selectedCharacter]?.profile_image}`} alt='character'/>
                            </span>
                        </button>
                        {
                            openPopup && 
                            <MyInfoPopUp ref={popupRef}>
                                <div className='select-character'>
                                    {   
                                        character && character.map((data, index)=>{
                                            return (
                                                <button className='character' id={index} onClick={() => changeCharacter(data.character_num)} key={index}>
                                                    <div className='inner-profile-image'>
                                                        <img src={`/image/character/${character[index]?.profile_image}`} alt="chracter" />
                                                        { pfimg === data.character_num && <span className='current-character'><IoMdCheckmark/></span> }
                                                    </div>
                                                    <div className={`character-info character${index}`}>
                                                        <div className='character-name'>{data.character_name}</div>
                                                        <div className='character-prefer-info'>
                                                            { data.prefer_genre !== null && <span className={`heart-icon`}><BsSuitHeart/></span> }
                                                            <p>
                                                                {
                                                                    data.prefer_genre !== null ?
                                                                    data.prefer_genre.map((el, index)=>{
                                                                        return (
                                                                            <>{
                                                                                <>{el} </>
                                                                            }</>
                                                                        )
                                                                    })
                                                                    :
                                                                    <>{'장르 취향을 선택해주세요'}</>
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='prefer-control'>
                                                        { pfimg === data.character_num && <Link to={'character'}>관리</Link> }
                                                    </div>
                                                </button>
                                            )
                                        })
                                    }
                                    {
                                        character.length < 3 &&
                                            <button onClick={() => createCharacter()} className='character add-character'>
                                                <div className='inner-profile-image'>
                                                    <div className='background'>
                                                        <AiOutlinePlus />
                                                    </div>
                                                </div>
                                                <div className='add-character-text'>
                                                    <p>캐릭터 추가하기  </p>
                                                </div>
                                            </button>
                                    }
                                    
                                </div>
                                <Link to={'/myinfo/password'} onClick={() => close()} className='control info-control'>
                                    <div className='inner-control'>
                                        <p>정보관리</p>
                                        <MdArrowForwardIos/>
                                    </div>
                                    <div className='info-text'>
                                        {additionalData.email}
                                    </div>
                                </Link>
                                <Link to={'/purchase/my'} onClick={() => close()} className='control voucher-control'>
                                    <div className='inner-control'>
                                        <p>이용권 관리</p>
                                        <MdArrowForwardIos/>
                                    </div>
                                    <div className='info-text'>
                                        {additionalData.plan_type}
                                    </div>
                                </Link>
                                <div className='logout-button'>
                                    <LogoutButton onClick={() => logoutModalOpen()}>
                                        로그아웃
                                    </LogoutButton>
                                </div>
                            </MyInfoPopUp>
                        }
                    </MyInfoCover>
                    :
                    <>
                        <Link to="/signin" className="header-login-link text-[12px]">로그인</Link>
                        <Link to="/signup" className="header-login-link text-[12px]">회원가입</Link>
                    </>
                }
            </div>
        </StyledHeader>
        </>
    )
}

export default Header

const MyInfoCover = styled.div`
    button{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        .character-name{
            min-width: 50px;
            padding-right: 20px;
            font-size: 13px;
            text-align: end;
        }
        .profile-image{
            display: inline-block;
            width: 40px;
            height: 40px;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
`;
const MyInfoPopUp = styled.div`
    width: 320px;
    min-height: 350px;
    background-color: var(--main-background-white);
    position: absolute;
    top: 60px;
    right: 0;
    border-radius: 3px;
    box-shadow: 0 0 30px 0 rgba(0,0,0,0.09);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    &::before{
        width: 7px;
        height: 7px;
        content: '';
        display: block;
        position: absolute;
        top: -14px;
        right: 12px;
        border-width: 7px;
        border-color: transparent transparent var(--main-background-white) transparent;
    }
    .select-character{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 15px;
        .character{
            width: 100%;
            padding: 4px 15px;
            display: flex;
            flex-column: row;
            align-items: center;
            justify-content: start;
            .inner-profile-image{
                width: 60px;
                height: 60px;
                padding: 5px;
                position: relative;
                img{
                    display: inline-block;
                    width: 100%;
                    height: 100%;
                }
                .current-character{
                    width: 18px;
                    height: 18px;
                    position: absolute;
                    z-index: 99999999999999999999999999999;
                    bottom: 5px;
                    right: 5px;
                    border-radius: 50%;
                    background-color: var(--main-theme-color);
                    padding: 2px;
                    >svg{
                        width: 100%;
                        height: 100%;
                        display: inilne-block;
                        color: var(--main-text-white);
                    }
                }
                .background{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #f3f3f3;
                    border: 1px solid #e9e9e9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    svg{
                        color: var(--main-theme-color);
                        width: 60%;
                        height: 60%;
                    }
                }
            }
            .character-info{
                width: 170px;
                height: 40px;
                padding-left: 10px;
                .character-name{
                    text-align: start; 
                    font-size: 15px;
                    font-weight: 600;
                }
                .character-prefer-info{
                    font-size: 13px;
                    color: #999;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: start;
                    .heart-icon{
                        padding-top: 4px;
                        margin-right: -2px;
                        width: 20px;
                        height: 20px;
                        background-image: url('/image/icons.png');
                        background-size: 578px 558px;
                        background-position: -26px -516px;
                    }
                    p{
                        width: 150px;
                        overflow: hidden;
                        text-align: start;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        
                    }
                }
            }
            .prefer-control{
                a{
                    font-size: 14px;
                    color: #3f3fff;
                }
            }
            &:hover{
                background-color: #F0F0F0;
            }
        }
        .add-character-text{
            font-size: 14px;
            font-weight: 400;
            padding-left: 10px;
        }
    }
    .control{
        width: 100%;
        heigth: 70px;
        padding: 16px 25px;
        border-top: 1px solid #eee;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        .inner-control{
            display: flex;
            flex-direction: row;
            align-items: start;
            justify-content: center;
            p{
                font-size: 13px;
                color: #333;
            }
            svg{
                width: 13px;
                height: 13px;
                margin-top: 4px;
                margin-left: -1px;
                color: #333;
            }
        }
        .info-text{
            font-size: 14px;
            color: #999;
        }
    }
    .logout-button{
        margin-bottom: 20px;
    }
`;

const StyledHeader = styled.div`
    min-width: 950px;
    height: 100px;
    margin: 0px auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5000;
    background-color: var(--main-text-white);
    .header-left-side{
        .logo{
            width: 180px; 
            height: 30px;
            background-image: url(/Logo/Logo.svg);
            background-repeat: no-repeat;
            background-size: cover;
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
                .active{
                    color: var(--main-theme-color);
                    text-decoration: none;
                    font-size: 17px;
                    font-weight: 400;
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
        width: 150px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
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

const LogoutButton = styled.button`
    padding: 5px 11px;
    background-color: var(--main-background-color);
    color: var(--main-theme-color);
    border: 1px solid var(--main-theme-color);
    border-radius: 16px;

    font-size: 14px;
    line-height: 1.2;
    text-align: center;
`;