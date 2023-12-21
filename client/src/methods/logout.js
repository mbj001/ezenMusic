import { removeCookie } from '../config/cookie';

export const logoutMethod = (e) => {
    if(e){
        removeCookie('connect.sid');
        removeCookie('client.sid');
        removeCookie('character.sid');
        removeCookie('pfimg');
        window.localStorage.setItem('login', false);
        // alert('로그아웃되었습니다.');
        window.location='/';
    }else{
        alert('로그아웃에 실패했습니다.');
        window.location = '/';
    }
}

