import React from 'react'
import MainStyledSection from '../layout/MainStyledSection'
import { Outlet, NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Purchase = () => {
    return (
        <MainStyledSection>
            <PurchaseHeader className='purchase-nav-bar'>
                <NavLink to={{pathname: 'voucher'}} className={({ isActive }) => isActive ? "nav-menu active" : "nav-menu"}>
                    일반
                </NavLink>
                <NavLink to={{pathname: 'my'}} className={({ isActive }) => isActive ? "nav-menu active" : "nav-menu"}>
                    나의 이용권
                </NavLink>
                <NavLink to={{pathname: 'coupon'}} className={({ isActive }) => isActive ? "nav-menu active" : "nav-menu"}>
                    쿠폰
                </NavLink>
            </PurchaseHeader>
            
            <Outlet />

        </MainStyledSection>
    )
}

export default Purchase

const PurchaseHeader = styled.div`
    width: 450px;
    height: 100px;
    margin: 15px auto 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .nav-menu{
        padding: 5px 15px;
        border-radius: 30px;
        font-size: 17px;
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
        background-color: var(--main-theme-color);
        color: var(--main-text-white);
    }
`;