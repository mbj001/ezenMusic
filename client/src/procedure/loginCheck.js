import { getCookie } from '../config/cookie'
import Axios from "axios";
import { Cookies } from "react-cookie";

export const loginCheck = async () =>{
    
    const checkId = getCookie('client.sid');
    const token = getCookie('connect.sid');

    // console.log("loginCheck.js");
    await Axios.post(`/verifiedClient/info`,{userid: checkId, token: token}).then((res)=>{
        if(res.data.valid == false){
            return false;
        }else{
            // console.log("checkId: " + checkId);
            return checkId;
        }
    }).catch((error)=>{console.log(error)});
}

const cookies = new Cookies();
// export const userid_cookies = cookies.get("client.sid");
export const userid_cookies = await loginCheck();