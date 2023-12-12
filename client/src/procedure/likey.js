// import Axios from "axios";
// import { Cookies } from "react-cookie";

// export async function likey_list_select_func(){
//     try{

//         const cookies = new Cookies();
//         const userid_cookies = cookies.get("client.sid");
        
//         console.log(userid_cookies);
        
//         let array1 = [];
        
//         const {data} = await Axios.get("/ezenmusic/browse/likeylist/"+userid_cookies)
//         // .then(({data}) => {
//             //     console.log("data");
//             //     console.log(data);
//             //     array1 = data[0].music_list;
//             // })
//             // .catch((err) => {
//             //     console.log(err);
//             // })
//             // console.log("array1");
//             // console.log(array1);
//         array1 = data[0].music_list;
//         console.log("array1");
//         console.log(array1)
//         return array1;
//     }
//     catch(e){
//         console.log(e);
//     }
// }