import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import { RiHeart3Line } from "react-icons/ri";
import MainStyledSection from '../layout/MainStyledSection'
import { Link, useParams, Outlet, NavLink  } from 'react-router-dom';
import Axios from "axios";

const Storage = () => {
    return (
    <>
    <StyledMenuBar className='w-[1444px] flex flex-wrap mt-16 mx-auto'>
        <NavLink to='mylist' className={({ isActive }) => isActive ? "nav-menu active" : "nav-menu"}>
            내 리스트
        </NavLink>
        <NavLink to='likey' className={({ isActive }) => isActive ? "nav-menu active" : "nav-menu"}>
            좋아요
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
        padding: 5px 15px;
        font-size: 15px;
        font-weight: 400;
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
    }
`;