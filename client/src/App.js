import React, { useState, createContext, useEffect } from 'react'
import Router from './router/Router'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { getCookie, removeCookie } from './config/cookie';
import axios from 'axios';
import { logoutMethod } from './methods/logout';

export const AppContext = createContext();
export const SetAppContext = createContext();

const App = () => {
    const [ isSessionValid, setIsSessionValid ] = useState(window.localStorage.getItem('login'));

    const initializeSessions = async() => {
        console.log('초기화');
        // 혹시 남아있을지도 모르는 만료된 세션 삭제
        const initSession = await axios.post('http://localhost:8080/guest/initializeSessions');
        console.log(initSession);
        // console.log(typeof(getCookie('client.sid')));
        // console.log(typeof(window.localStorage.getItem('login')));
        /**
         * localstorage = false 인데 브라우저에 쿠키 존재할 경우
         * 쿠키에 저장되어있는 값들 서버에 보내고 해당 토큰과 일치하는 세션 있는지 확인후 삭제 요청
         * 서버에 해당 토큰과 일치하는 세션 없다? ok 그럼 그냥 쿠키 삭제
         * 서버에 해당 토큰과 일치하는 세션 존재하니 삭제했다고 응답 오면 ? ok 얘도 그냥 쿠키 삭제
         * 서버에서 토큰이 undefined로 들어오면? 얘도 쿠키 삭제
         */
        if((window.localStorage.getItem('login') === 'false') && (getCookie('client.sid') || getCookie('connect.sid'))){ 
            //로컬스토리지 false 인데 쿠키 하나라도 존재 -> 서버에 삭제요청 후 브라우저 쿠키도 삭제
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
            if((getCookie('connect.sid') !== '') && (getCookie('connect.sid') !== undefined) && (getCookie('client.sid') === '' || getCookie('client.sid') === undefined)){
                //브라우저에서 토큰으로 무언가 가지고 있으니 유효한 토큰인지 확인만 하고 client.sid 재발급 connect.sid 값이 이상한 값일 수 있으니 !!
                // const reIssuance = await axios.post('http://localhost:8080/verifiedClient/reissuance', {token: getCookie('connect.sid'), clientsid: getCookie('client.sid')});
                // console.log(reIssuance);
                // if(!reIssuance.valid){
                //     // 유효하지 않은 토큰이면?
                //     removeCookie('connect.sid');
                //     removeCookie('client.sid');
                // }else{

                // }
                // setCookie('connect.sid', reIssuance.reIssuanceToken);
                // setCookie('client.sid', reIssuance.reIssuanceClientId);
            };
            if((getCookie('connect.sid') === undefined) || (getCookie('connect.sid') === '')){
                //브라우저에 토큰 없으니 client.sid 있는것도 삭제시키고 로컬스토리지 false로
                removeCookie('connect.sid');
                removeCookie('client.sid');
                window.localStorage.setItem('login', false);
                logoutMethod(true);
            }
        }
    };
    
    useEffect(()=>{
        initializeSessions();
    }, [])
    
    return (
        <SetAppContext.Provider value={setIsSessionValid}>
            <AppContext.Provider value={isSessionValid}>
                <Router />
            </AppContext.Provider>
        </SetAppContext.Provider>
    )
}

export default App