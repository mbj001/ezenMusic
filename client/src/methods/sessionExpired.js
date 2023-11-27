import { removeCookie } from '../config/cookie';

export const sessionExpiredLogoutMethod = (e) => {
    if(e){
        removeCookie('connect.sid');
        removeCookie('client.sid');
        window.localStorage.setItem('login', false);
        alert('세션이 만료되어 자동 로그아웃되었습니다.');
        window.location='/';
    }else{
        alert('로그아웃에 실패했습니다.');
        window.location = '/';
    }
}

