import React, { useState, createContext, useEffect } from 'react'
import Router from './router/Router'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { getCookie, removeCookie, setCookie } from './config/cookie';
import axios from 'axios';
import { sessionExpiredLogoutMethod } from './methods/sessionExpired';

export const AppContext = createContext();
export const SetAppContext = createContext();

const App = () => {
    const [ isSessionValid, setIsSessionValid ] = useState(window.localStorage.getItem('login'));
    // console.log(isSessionValid);
    const initializeSessions = async() => { 
        // 혹시 남아있을지도 모르는 만료된 세션 삭제
        const initSession = await axios.post('http://localhost:8080/guest/initializeSessions');
        // console.log(initSession);
    };

    const preventInvalidLogin = async() => {
        // console.log('*******************');
        if((window.localStorage.getItem('login') === 'false') && (getCookie('client.sid') || getCookie('connect.sid'))){ 
            //로컬스토리지 false 인데 쿠키 하나라도 존재 -> 서버에 삭제요청 후 브라우저 쿠키도 삭제
            console.log('여기');
            const removeInvalidSessions = await axios.post('http://localhost:8080/verifiedClient/removeInvalidSessions', {token: getCookie('connect.sid'), clientsid: getCookie('client.sid')});
            console.log(removeInvalidSessions);
            removeCookie('connect.sid');
            removeCookie('client.sid');
        }
        if((window.localStorage.getItem('login') === 'false') && !getCookie('client.sid') && !getCookie('connect.sid')){
            //로컬스토리지 false 이고 브라우저에 쿠키 없음 => 정상 상태
        }
        if(window.localStorage.getItem('login') === 'true'){
            //로컬스토리지 true일 경우
            const check = await axios.post('http://localhost:8080/verifiedClient/check', {token: getCookie('connect.sid')});
            if(check.data.valid === false){
                sessionExpiredLogoutMethod(true);
            }else{
                if((getCookie('connect.sid') !== '') && (getCookie('connect.sid') !== undefined) && (getCookie('client.sid') === '' || getCookie('client.sid') === undefined)){
                    // 토큰 존재(빈값도 아니고 undefined도 아님) && 쿠키에 아이디는 없음(빈값이거나 undefined)
                    const reIssuance = await axios.post('http://localhost:8080/verifiedClient/reissuance', {token: getCookie('connect.sid'), id: getCookie('client.sid')});
                    // console.log(reIssuance);
                    if(reIssuance.data.valid === false){
                        window.localStorage.setItem('login', false);
                        removeCookie('connect.sid'); 
                        removeCookie('client.sid');
                    }else{
                        console.log(reIssuance.data.id);
                        setCookie('client.sid', reIssuance.data.id);
                    }
                };
                if((getCookie('connect.sid') === undefined) || (getCookie('connect.sid') === '')){
                    //브라우저에 토큰 없으니 client.sid 있는것도 삭제시키고 로컬스토리지 false로
                    removeCookie('connect.sid');
                    removeCookie('client.sid');
                    window.localStorage.setItem('login', false);
                    sessionExpiredLogoutMethod(true);
                }
            }
        }
    }
    
    useEffect(()=>{
        initializeSessions();
        preventInvalidLogin();
    }, [])

    // useEffect(()=>{
        
    // })
    
    return (
        <SetAppContext.Provider value={setIsSessionValid}>
            <AppContext.Provider value={isSessionValid}>
                <Router />
            </AppContext.Provider>
        </SetAppContext.Provider>
    )
}

export default App