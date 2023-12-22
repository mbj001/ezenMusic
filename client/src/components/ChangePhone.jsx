import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import axios from 'axios';
import { getCookie } from '../config/cookie'
import ConfirmFailure from '../modal/ConfirmFailure';
import ChangePhoneSuccess from '../modal/ChangePhoneSuccess';

const ChangePhone = () => {
    const [ password, setPassword ] = useState('');
    const [ currentPhone, setCurrentPhone ] = useState([]);
    const [ newPhone, setNewPhone ] = useState('');
    const [ resetPage, setResetPage ] = useState(false);
    const [ confirmed, setConfirmed ] = useState(false);
    const [ confirmFailureModalOpen, setConfirmFailureModalOpen ] = useState(false);

    const [ invalid, setInvalid] = useState(false);
    const [ success, setSuccess ] = useState(false);

    const [ currentPasswordType, setCurrentPasswordType ] = useState({
        type: 'password',
        visible: false
    });
    const [ chekcNewPhoneType, setCheckNewPhoneType ] = useState({
        type: 'text',
        visible: false
    });


    useEffect(()=>{
        axios.post(`/verifiedClient/myinfo/phone`, {token: getCookie('connect.sid'), id: getCookie('client.sid'), password: password})
        .then(({data}) =>{
            setCurrentPhone(data[0].phone.replace(/-[0-9]{3,4}-/g, "-****-"))
        })
        .catch((err) => {
        {}
        })
        
    }, [resetPage]);


    const handlePhoneType = (str) => {
        if(str === 'current'){
            setCurrentPasswordType(()=>{
                if(!currentPasswordType.visible){
                    return { type: 'text', visible: true }
                }else{
                    return { type: 'password', visible: false }
                }
            });
        }else{
            setCheckNewPhoneType(()=>{
                if(!chekcNewPhoneType.visible){
                    return { type: 'text', visible: true }
                }else{
                    return { type: 'text', visible: false }
                }
            });
        }
    };

    const validPhoneNumber = (str) => {
        // 000-0000-0000 형식 준수
        return /^\d{3}-\d{3,4}-\d{4}$/.test(str);
    }

    const confirmPassword = async(e) => {
        e.preventDefault();
        if(password !== ''){
            const response = await axios.post('/verifiedClient/confirmPassword', {token: getCookie('connect.sid'), user_id: getCookie('client.sid'), password: password});
            if(response.data.confirmed){
                setConfirmed(true);
            }else{
                setConfirmFailureModalOpen(true);
            }
        }
    };
    const resetPhone = async(e) => {
        e.preventDefault();
        await axios.post('/verifiedClient/changePhone', {token: getCookie('connect.sid'), id: getCookie('client.sid'), newPhone: newPhone})
        .then(({data}) =>{
            if(data === 1){
                alert("이미 등록된 전화번호입니다.");
                setResetPage(true);
            }else{
                setResetPage(true);
                setSuccess(true);
            }
        })
    };
    
    useEffect(() => {
        if (newPhone.length === 10) {
            setNewPhone(newPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }
        if (newPhone.length === 13) {
            setNewPhone(newPhone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
        }
        if (newPhone.length > 13) {
            setNewPhone(newPhone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
        }
        if(!validPhoneNumber(newPhone)){
            setInvalid(true);
        }else{
            setInvalid(false);
        }
    }, [newPhone]);

    return (
        <UserInfoBox>
            {success && <ChangePhoneSuccess setModalOpen={setSuccess}/>}
            {confirmFailureModalOpen && <ConfirmFailure setModalOpen={setConfirmFailureModalOpen}/>}
            <form onSubmit={confirmPassword}>
                <div>
                    <div className='password-input-cover'>
                        <span onClick={()=>handlePhoneType('current')} >
                            {currentPasswordType.visible ? <AiFillEyeInvisible/> : <AiFillEye/>}
                        </span>
                        <input type={currentPasswordType.type} id='current-password' name='signUpPw' className={confirmed ? 'input-text confirmed' : 'input-text'} 
                                disabled={confirmed ? true : false} placeholder='비밀번호 입력' onChange={e=>setPassword(e.target.value)} autoComplete="off"/>
                    </div>
                    <button type='submit'>확인</button>
                </div>
            </form>
            <form onSubmit={resetPhone}>
                <div className='py-8'>
                    <div className='password-input-cover'>
                        <input id='new-password' className='input-text' disabled={true} placeholder={currentPhone}/>
                    </div>
                </div>
                <div>
                    <div className='password-input-cover'>
                        <input type={chekcNewPhoneType.type} id='check-new-password' className='input-text' disabled={confirmed ? false : true} 
                                placeholder='변경할 휴대폰 번호 (-포함)' value={newPhone} onChange={e=>setNewPhone(e.target.value)} autoComplete="off"/>
                        { newPhone !== '' && invalid && <span className='invalid-text'>올바르지 않은 전화번호 형식입니다.</span> }
                    </div>
                    <button type='submit'>변경</button>
                </div>
            </form>
        </UserInfoBox>
    )
}

export default ChangePhone

const UserInfoBox = styled.div`
    form{
        div{
            width: 50%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: start;
            .password-input-cover{
                width: 70%;
                position: relative;
                span{
                    svg{
                        width: 30px;
                        height: 30px;
                        color: #ebebeb;
                        position: absolute;
                        top: 20%;
                        right: 0;
                        bottom: auto;
                        left: auto;
                    }
                }
                input[type=text]{
                    letter-spacing: 0;
                }
                input[type=password]{
                    letter-spacing: 2px;
                }
                .input-text{
                    width: 100%;
                    height: 58px;
                    font-size: 15px;
                    font-weight: 400;
                    color: #000000;
                    border-bottom: 1px solid #ebebeb;
                    &:focus{
                        border-bottom: 1px solid #000000;
                    }
                    &::placeholder{
                        font-size: 15px;
                        letter-spacing: 0;
                    }
                }
                .input-text.confirmed{
                    color: #dedede;
                }
                .invalid-text{
                    width: 100%;
                    position: absolute;
                    bottom: -15px;
                    left: 0;
                    font-size: 10px;
                    letter-spacing: -1px;
                    color: var(--signup-invalid-color);
                    border-top: 1px solid var(--signup-invalid-color);
                }
                .valid-text{
                    width: 100%;
                    position: absolute;
                    bottom: -15px;
                    left: 0;
                    font-size: 10px;
                    letter-spacing: -1px;
                    color: var(--main-theme-color);
                    border-top: 1px solid var(--main-theme-color);
                }
            }
            button{
                margin-left: 20px;
                min-width: 85px;
                height: 36px;
                padding: 0 15px;
                font-size: 14px;
                line-height: 36px;
                color: #fff;
                text-align: center;
                background-color: #3f3fff;
                border-radius: 5px;
                opacity: 0.2;
                &:hover{
                    opacity: 0.3;
                }
            }
        }
    }
`;
