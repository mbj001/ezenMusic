import {Cookies} from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name, value, options)=>{
	return cookies.set(name, value, {...options});
};

export const getCookie = (name)=>{
	return cookies.get(name);
};

export const removeCookie = (name, options) => {
    return cookies.remove(name, {...options});
};

// const cookies = new Cookies();
export const userid_cookies = cookies.get("character.sid");