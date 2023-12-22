import React, { useState, createContext, useEffect } from 'react'
import Router from './router/Router'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { getCookie, removeCookie, setCookie } from './config/cookie';
import axios from 'axios';
import { sessionExpiredLogoutMethod } from './methods/sessionExpired';
import SessionExpiredModal from './modal/SessionExpiredModal';

export const AppContext = createContext();
export const SetAppContext = createContext();

const App = () => {
    const [ isSessionValid, setIsSessionValid ] = useState(JSON.parse(window.localStorage.getItem('login')));
    const [ sessionExpiredModalOpen, setSessionExpiredModalOpen ] = useState(false);
    const [ loading, setLoading ] = useState(true);

    const validDataSet = (str) => {
        // false for invalid value, true for valid value
        if(str === null || str === undefined || str === ''){
            return false;
        }else{
            return true;
        }
    }

    const removeSession = async() => {
        await axios.post('/verifiedClient/logout', {token: getCookie('connect.sid')}).then((res)=>{
            sessionExpiredLogoutMethod(true);
            setSessionExpiredModalOpen(true);
        }).catch((error)=>{console.log(error)});
    }

    const check = async() => {
        if(isSessionValid){
            if(!validDataSet(getCookie('character.sid')) || !validDataSet(getCookie('connect.sid')) || !validDataSet(getCookie('client.sid')) || !validDataSet('pfimg')){
                removeSession();
                return;
            }

            const reIssuance = await axios.post('/verifiedClient/reissuance', {token: getCookie('connect.sid'), id: getCookie('client.sid')});
            if(reIssuance.data.valid === false){
                removeSession();
                return;
            }else{
                if(getCookie('client.sid') !== reIssuance.data.user_id){
                    setCookie('client.sid', reIssuance.data.user_id, {
                        path: '/',
                        secure: false,
                        secret: process.env.COOKIE_SECRET
                    });
                    window.location = '/';
                }
                if(getCookie("character.sid").split("#")[0] !== reIssuance.data.user_id){
                    console.log("캐릭터 아이디 다름");
                    setCookie('character.sid', reIssuance.data.user_id+"#ch0"+getCookie("pfimg"), {
                        path: '/',
                        secure: false,
                        secret: process.env.COOKIE_SECRET
                    });
                    window.location = '/';
                }

            }
            
            const response = await axios.post('/verifiedClient/check' , {token: getCookie('connect.sid')});
            if(response.data.valid === true){
                if(getCookie('pfimg') < 1 || getCookie('pfimg') > 3 || !validDataSet(getCookie('pfimg'))){
                    removeSession();
                    return;
                }else{
                    const check = await axios.post('/verifiedClient/checkCharacterCookie', {token: getCookie('connect.sid'), characterId: getCookie('character.sid')});
                    if(check.data.isExist){
                        // good
                    }else{
                        removeSession();
                        return;
                    }
                }
                if(parseInt(getCookie('character.sid').split('#ch0')[1]) !== getCookie('pfimg')){
                    const response = await axios.post('/verifiedClient/checkCharacterCount', {token: getCookie('connect.sid'), clientId: getCookie('client.sid')});
                    if(response.data.includes(getCookie('pfimg'))){
                        setCookie('character.sid', `${getCookie('client.sid')}#ch0${response.data[0]}`, {
                            path: '/',
                            secure: false,
                            secret: process.env.COOKIE_SECRET
                        });
                        setCookie('pfimg', response.data[0], {
                            path: '/',
                            secure: false,
                            secret: process.env.COOKIE_SECRET
                        });
                        window.location = '/';
                    }else{
                        removeSession();
                        return;
                    }
                }else{
                    // ok
                }
            }else{
                sessionExpiredLogoutMethod(true);
                setSessionExpiredModalOpen(true);
                return;
            }
        }else{

        }
    }

    const preventInvalidLogin = async() => {
        if((window.localStorage.getItem('login') === 'false') && (getCookie('client.sid') || getCookie('connect.sid'))){
            const removeInvalidSessions = await axios.post('/verifiedClient/removeInvalidSessions', {token: getCookie('connect.sid'), user_id: getCookie('client.sid')});
            if(removeInvalidSessions.data.removeSuccess){
                removeCookie('connect.sid', {
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });
                removeCookie('client.sid', {
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });
            }
        }else if((window.localStorage.getItem('login') === 'false') && (getCookie('character.sid') || getCookie('pfimg'))){
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
        }
        setLoading(false);
    }

    useEffect(()=>{
        if(isSessionValid === true || isSessionValid === false){
            preventInvalidLogin();
            check();
        }else{
            // isSessionValid 에 초기값 할당했을때 boolean이 아닌 경우 localstorage false 저장
            window.localStorage.setItem('login', false);
            removeCookie('connect.sid', {
                path: '/',
                secure: false,
                secret: process.env.COOKIE_SECRET
            });
            removeCookie('client.sid', {
                path: '/',
                secure: false,
                secret: process.env.COOKIE_SECRET
            });
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
            window.location = '/';
        }
    },[isSessionValid]);

    if(loading){
        return null;
    }
    
    return (
        <SetAppContext.Provider value={setIsSessionValid}>
            <AppContext.Provider value={isSessionValid}>
                {sessionExpiredModalOpen && <SessionExpiredModal setModalOpen={setSessionExpiredModalOpen}/>}
                <Router />
            </AppContext.Provider>
        </SetAppContext.Provider>
    )
}

export default App