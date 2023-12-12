import React, { useState, createContext, useEffect } from 'react'
import Router from './router/Router'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { getCookie, removeCookie, setCookie } from './config/cookie';
import axios from 'axios';
import { sessionExpiredLogoutMethod } from './methods/sessionExpired';

import Logout from './modal/Logout'

export const AppContext = createContext();
export const SetAppContext = createContext();

const App = () => {
    const [ isSessionValid, setIsSessionValid ] = useState(window.localStorage.getItem('login'));
    const [ logoutModalOpen, setLogoutModalOpen ] = useState(false);

    const [ validCharacterNum , setValidCharacterNum ] = useState(true);

    const initializeSessions = async() => { 
        // 혹시 남아있을지도 모르는 만료된 세션 삭제
        const initSession = await axios.post('/guest/initializeSessions');
        // console.log(initSession);
    };

    const check = async() => {
        if(isSessionValid){
            // const userid = getCookie('client.sid');
            const response = await axios.post('/verifiedClient/check' , {token: getCookie('connect.sid')});
            // console.log(response);
            if(response.data.valid){
                // ########################################################
                // ################  invalid character id  ################
                const pfimg = getCookie('pfimg');
                if(pfimg < 1 || pfimg > 3 || pfimg === undefined || pfimg === null || pfimg === ''){
                    const character = await axios.post('/verifiedClient/issuanceCharacterCookie', {token: getCookie('connect.sid'), clientId: getCookie('client.sid')});
                    // setCookie('character.sid', character.data.characterId);
                    // setCookie('pfimg', character.data.characterNum);
                    sessionExpiredLogoutMethod(true);

                }else if(getCookie('character.sid').indexOf('undefined') !== -1){
                    // 캐릭터 쿠키가 이상한 값일 경우 1로 변경
                    // undefined 혹은 올바르지 않은 문자열 혹은 뭐 그런거 등등
                    const character = await axios.post('/verifiedClient/issuanceCharacterCookie', {token: getCookie('connect.sid'), clientId: getCookie('client.sid')});
                    // setCookie('character.sid', character.data.characterId);
                    // setCookie('pfimg', character.data.characterNum);
                    sessionExpiredLogoutMethod(true);
                }else{
                    const check = await axios.post('/verifiedClient/checkCharacterCookie', {token: getCookie('connect.sid'), characterId: getCookie('character.sid')});
                    // console.log(check)
                    if(check.data.isExist){
                        // good
                    }else{
                        const character = await axios.post('/verifiedClient/issuanceCharacterCookie', {token: getCookie('connect.sid'), clientId: getCookie('client.sid')});
                        // setCookie('character.sid', character.data.characterId);
                        // setCookie('pfimg', character.data.characterNum);
                        sessionExpiredLogoutMethod(true);
                    }
                }
                // ######################################################
                // ##############  character.sid !== pfimg  #############
                if(getCookie('character.sid')){
                    if(getCookie('character.sid').split('#ch0')[1] !== getCookie('pfimg')){
                        const response = await axios.post('/verifiedClient/checkCharacterCount', {token: getCookie('connect.sid'), clientId: getCookie('client.sid')});
                        // console.log(response)
                        const characterNum = response.data;
                        // console.log(characterNum);
                        // console.log(getCookie('pfimg'))
                        if(characterNum.includes(getCookie('pfimg'))){
                            // console.log('정상')
                        }else{
                            sessionExpiredLogoutMethod(true);
                            
                        }
                        // const count = characterCount.data.count;
                        // if(getCookie('pfimg') > count || parseInt(getCookie('character.sid').split('#ch0')[1]) > count){
    
                        //     const character = await axios.post('/verifiedClient/issuanceCharacterCookie', {token: getCookie('connect.sid'), clientId: getCookie('client.sid')});
                        // }
                        // setCookie('character.sid', character.data.characterId);
                        // setCookie('pfimg', character.data.characterNum);
                        // setCookie('character.sid', userid+'#ch0'+getCookie('pfimg'));
                        // console.log(getCookie('character.sid'));
                    }
                }else{
                    // getcookie 가 없을때
                    // console.log('else')
                }
            }else{
                // console.log('세션 만료');
            }
        }else{

        }
    }

    const preventInvalidLogin = async() => {
        // console.log('*******************');
        if((window.localStorage.getItem('login') === 'false')){
            removeCookie('character.sid');
            removeCookie('pfimg');
        }
        if((window.localStorage.getItem('login') === 'false') && (getCookie('client.sid') || getCookie('connect.sid'))){ 
            //로컬스토리지 false 인데 쿠키 하나라도 존재 -> 서버에 삭제요청 후 브라우저 쿠키도 삭제
            // console.log('여기');
            const removeInvalidSessions = await axios.post('/verifiedClient/removeInvalidSessions', {token: getCookie('connect.sid'), clientsid: getCookie('client.sid')});
            // console.log(removeInvalidSessions);
            removeCookie('connect.sid');
            removeCookie('client.sid');
        }
        if((window.localStorage.getItem('login') === 'false') && !getCookie('client.sid') && !getCookie('connect.sid')){
            //로컬스토리지 false 이고 브라우저에 쿠키 없음 => 정상 상태
        }
        if(window.localStorage.getItem('login') === 'true'){
            //로컬스토리지 true일 경우
            const check = await axios.post('/verifiedClient/check', {token: getCookie('connect.sid')});
            if(check.data.valid === false){
                sessionExpiredLogoutMethod(true);
            }else{
                // console.log('세션 확인 완료')
                const reIssuance = await axios.post('/verifiedClient/reissuance', {token: getCookie('connect.sid'), id: getCookie('client.sid')});
                if(reIssuance.data.valid === false){
                    window.localStorage.setItem('login', false);
                    removeCookie('connect.sid'); 
                    removeCookie('client.sid');
                }else{
                    // console.log(reIssuance.data.id);
                    // setCookie('client.sid', reIssuance.data.id);
                    // if((getCookie('client.sid') === '' || getCookie('client.sid') === undefined)){
                    //     const reIssuance = await axios.post('/verifiedClient/reissuance', {token: getCookie('connect.sid'), id: getCookie('client.sid')});
                    //     // console.log(reIssuance);
                    //     if(reIssuance.data.valid === false){
                    //         window.localStorage.setItem('login', false);
                    //         removeCookie('connect.sid'); 
                    //         removeCookie('client.sid');
                    //     }else{
                    //         // console.log(reIssuance.data.id);
                    //         setCookie('client.sid', reIssuance.data.id);
                    //     }
                    //     window.location = '/';
                    // }else{
                        
                    // }
                }
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
        check();
    }, []);
    
    return (
        <SetAppContext.Provider value={setIsSessionValid}>
            <AppContext.Provider value={isSessionValid}>
                <Router />
            </AppContext.Provider>
        </SetAppContext.Provider>
    )
}

export default App