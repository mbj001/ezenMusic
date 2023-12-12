import { getCookie, removeCookie } from '../config/cookie';

export const sessionExpiredLogoutMethod = (e) => {
    if(e){
        // if(getCookie('connect.sid') || getCookie('client.sid') || getCookie('character.sid') || getCookie('pfimg')){
            
        // }
        removeCookie('connect.sid');
        removeCookie('client.sid');
        removeCookie('character.sid');
        removeCookie('pfimg');
        window.localStorage.setItem('login', false);
        alert('세션이 만료되었거나 유효하지 않은 요청입니다.');
        //세션이 만료되었습니다. 계속하려면 다시 로그인 하세요
        window.location='/';
    }else{
        alert('로그아웃에 실패했습니다.');
        window.location = '/';
    }
}

