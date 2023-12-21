import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import { RiHeart3Line } from "react-icons/ri";
import { Outlet, NavLink, useLocation } from 'react-router-dom';

const Storage = () => {
    const [activeTab, setActiveTab] = useState(false)
    const location = useLocation();

    useEffect(() =>{
        if(location.pathname === "/storage/mylist"){
            setActiveTab(true);
            
        }
        else{
            setActiveTab(false);
        }
    }, [location])

    return (
        <>
        <StyledMenuBar className='md:w-[1000px] xl:w-[1280px] 2xl:w-[1440px] flex flex-wrap mt-16 mx-auto mb-[15px]'>
            <NavLink to='/storage/mylist' className={ activeTab == true ? "nav-menu active" : "nav-menu"}>
                내 리스트
            </NavLink>
            <NavLink to='/storage/liketrack' className={ activeTab == false ? "nav-menu active" : "nav-menu"}>
                <RiHeart3Line className="mr-[2px] text-[17px]" />좋아요
            </NavLink>
        </StyledMenuBar>
        <Outlet />
        </>
    )
}


export default Storage

const StyledMenuBar = styled.div`
    
border-bottom: 1px solid #ededed;
    .nav-menu{

        padding-bottom: 5px;
        padding-top: 5px;
        padding-right: 18px;
        padding-left: 15px;

        font-size: 15px;
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: center;
        

        a{
            width: 78px;
            height: 34px;
            
        }
        &:hover{
            color: var(--main-theme-color);
        }
    }
    .nav-menu.active{
        color: var(--main-theme-color);
        border-bottom : 2px solid var(--main-theme-color);
    }
`;