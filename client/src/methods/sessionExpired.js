import { removeCookie } from '../config/cookie';

export const sessionExpiredLogoutMethod = (e) => {
    if(e){
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
        window.localStorage.setItem('login', false);
        console.log('세션, 쿠키 삭제 완료')
        // alert('세션이 만료되었거나 유효하지 않은 요청입니다.');
        //세션이 만료되었습니다. 계속하려면 다시 로그인 하세요
        
    }else{
        alert('로그아웃에 실패했습니다.');
        window.location = '/';
    }
}

