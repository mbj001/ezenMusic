import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { TfiClose } from "react-icons/tfi";
import axios from 'axios';
import { getCookie, setCookie } from '../config/cookie';

const CreateCharacterModal = ({setModalOpen, characterNumber}) => {
    const [ characterName, setCharacterName ] = useState('');
    const createInputRef = useRef();

    const removeName = () => {
        setCharacterName('');
    }
    
    const createCharacter = async() => {
        if(characterName === '' || characterName === undefined || characterName === null){
        
        }else{    
            const success = await axios.post('/verifiedClient/createCharacter', {token: getCookie('connect.sid'), id: getCookie('client.sid'), characterName: characterName, characterNumber: characterNumber});
            if(success.data.success){
                // const response = await axios.post('/verifiedClient/createPreferPlaylist', {token: getCookie('connect.sid'), })
                setCookie('character.sid', success.data.characterId,{
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });
                setCookie('pfimg', success.data.characterNum,{
                    path: '/',
                    secure: false,
                    secret: process.env.COOKIE_SECRET
                });
                window.location = '/discovery';
                // navigate('/discovery');
            }else{
            }
        }
        
    }
    
    const closeModal = () =>{
        setModalOpen(false);
    }
    
    return (
        <CreateCharacter>
            <div className='create-modal-box'>
                <p className='mt-2 mb-2'>캐릭터 만들기</p>
                <form onSubmit={e => e.preventDefault()}>
                    <input type="text" ref={createInputRef} onChange={(e)=>setCharacterName(e.target.value)} value={characterName} maxLength={9} placeholder='캐릭터 이름 입력'/>
                    <div className='remove-all'>
                        <button type='button' onClick={() => removeName()}>
                            <TfiClose/>
                        </button>
                        </div>
                    <span className='length-limit'>
                        <span className='name-length'>{characterName.length}</span>/10자
                    </span>
                    <div className='button-box'>
                        <button type='button' className='cancel' onClick={() => closeModal()}>
                            취소
                        </button>
                        <button type='button' className='submit' onClick={() => createCharacter()}>
                            확인
                        </button>
                    </div>
                </form>
            </div>
        </CreateCharacter>
    )
}

export default CreateCharacterModal

const CreateCharacter = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999999999999999999999999;
    background-color: rgba(0,0,0,0.6);
    .create-modal-box{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 450px;
        height: 250px;
        border-radius: 5px;
        background-color: var(--main-background-white);
        color: var(--main-text-black);
        opacity: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        p{
            font-size: 18px;
            font-weight: 400;
            color: #181818;
            text-align: center;
        }
        form{
            position: relative;
            input{
                width: 320px;
                height: 58px;
                font-size: 15px;
                color: #181818;
                border: 0;
                border-bottom: 1px solid #ebebeb;
                &:focus{
                    border-bottom: 1.5px solid var(--main-text-black);
                }
                &:placeholder{
                    color: #ebebeb;
                }
            }
            .remove-all{
                width: 18px;
                height: 18px;
                position: absolute;
                top: 15px;
                right: 55px;
                button{
                    width: 100%;
                    heigth: 100%;
                    svg{
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .length-limit{
                color: #ebebeb;
                .name-length{
                    color: var(--main-theme-color);
                }
            }
            .button-box{
                width: 100%;
                margin-top: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                button{
                    width: 100px;
                    height: 36px;
                    padding: 0 15px;
                    font-size: 14px;
                    line-height: 36px;
                    text-align: center;
                    border-radius: 5px;
                }
                .cancel{
                    background-color: var(--main-text-white);
                    color: var(--main-text-black);
                    border: 1px solid var(--main-text-gray-lighter);
                    margin-right: 15px;
                    &:hover{
                        color: var(--main-theme-color);
                        border: 1px solid var(--main-theme-color);
                    }
                }
                .submit{
                    background-color: var(--main-theme-color);
                    color: #fff;
                }
            }
        }
    }
`;