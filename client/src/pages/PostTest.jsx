import React, {useState, useEffect} from 'react'
import Axios  from 'axios'

function PostTest() {
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [returnVal, setReturnVal] = useState();

    function postFunc(e){
        e.preventDefault();
        Axios.post("http://localhost:8080/ezenmusic/test", 
            {
                userid: id,
                userpw: pw
            }
        )
        .then(({data}) => {
            setReturnVal(data);
        })
        .catch((err) => {
            console.log("에러");
        })
        console.log("결과");
        console.log(returnVal);
    }

    return (
    <div className="mt-[100px] w-[800px] text-center mb-[100px] mx-auto">
        <form action="" onSubmit={postFunc}>
            <div className="mb-5">
                <label className="form-label">아이디</label>
                <input type="text" className="form-control" name="userid" value={id} onChange={(e) => setId(e.target.value)} />
            </div>
            <div className="mb-5">
                <label className="form-label">비밀번호</label>
                <input type="password" className="form-control" name="userpass" value={pw} onChange={(e) => setPw(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-info">제출</button>
        </form>
    </div>
    )
}

export default PostTest