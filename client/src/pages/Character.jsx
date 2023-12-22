import React, { useEffect, useState } from 'react'
import MainStyledSection from '../layout/MainStyledSection'
import styled from 'styled-components'
import { getCookie, setCookie } from '../config/cookie'
import axios from 'axios'
import { BsSuitHeart } from "react-icons/bs";
import { LuPencilLine } from "react-icons/lu";
import { TfiClose } from "react-icons/tfi";
import CancelEdit from '../modal/CancelEdit'
import { Link } from 'react-router-dom'
import DeleteFailure from '../modal/DeleteFailure'
import CharacterNameLengthCheck from '../modal/CharacterNameLengthCheck'
import ConfirmDeleteCharacter from '../modal/ConfirmDeleteCharacter'

const Character = () => {
    const [ currentCharacter, setCurrentCharcter ] = useState({});
    const [ preferGenre, setPreferGenre ] = useState([]);
    const [ newName, setNewname ] = useState('');
    const [ edit, setEdit ] = useState(false);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ deleteFailModalOpen, setDeleteFailModalOpen ] = useState(false);
    const [ confirmModalOpen, setConfirmModalOpen ] = useState(false);
    const [ keepGoing, setKeepGoing ] = useState(false);
    const [ nameLengthModalOpen, setNameLengthModalOpen ] = useState(false);
    
    const getCharacter = async() => {
        const response = await axios.post('/verifiedClient/characterControl', {token:getCookie('connect.sid'), characterId: getCookie('character.sid'), characterNum: getCookie('pfimg')});
        setPreferGenre(response.data.prefer_genre);
        setNewname(response.data.character_name);
        setCurrentCharcter(response.data);
    }


    const changeCharacter = async(e) => {
        e.preventDefault();
        if(newName === ''){

        }else{
            const response = await axios.post('/verifiedClient/updateCharacterName', {token: getCookie('connect.sid'), characterId: getCookie('character.sid'), newName: newName});
            if(response.data.success){
                // console.log('업데이트 성공');
                window.location = '/character';
            }else{
                // console.log('업데이트 실패');
            }
        }
    }

    const editMode = () => {
        if(edit){
            setEdit(false);
        }else{
            setEdit(true);
        }
    }

    const editModeCancel = () => {
        setModalOpen(true);
    }

    const confirmDeleteCharacter = () => {
        setConfirmModalOpen(true);
    }

    useEffect(()=>{
        if(keepGoing){
            deleteCharacter();
        }
    }, [keepGoing])

    const deleteCharacter = async() => {
        const response = await axios.post('/verifiedClient/deleteCharacter' ,{token: getCookie('connect.sid'), id: getCookie('client.sid'), characterId: getCookie('character.sid'), characterNum: getCookie('pfimg')});
        if(response.data.success === false){
            setDeleteFailModalOpen(true);
        }else{
            const status = response.data.pop();
            if(status.success){
                const changeTo = response.data[0];
                if(changeTo.character_id === undefined){
                    setCookie('character.sid', getCookie('client.sid')+'#ch01',{
                        path: '/',
                        secure: false,
                        secret: process.env.COOKIE_SECRET
                    });
                    setCookie('pfimg', 1,{
                        path: '/',
                        secure: false,
                        secret: process.env.COOKIE_SECRET
                    });    
                }else{
                    setCookie('character.sid', changeTo.character_id,{
                        path: '/',
                        secure: false,
                        secret: process.env.COOKIE_SECRET
                    });
                    setCookie('pfimg', changeTo.character_num,{
                        path: '/',
                        secure: false,
                        secret: process.env.COOKIE_SECRET
                    });
                }
                window.location = '/';
                
            }else{
                // console.log('삭제 실패');
            }
        }
    }

    useEffect(()=>{
        getCharacter();
    }, [])
    
    return (
        <>
        {confirmModalOpen && <ConfirmDeleteCharacter setModalOpen={setConfirmModalOpen} setKeepGoing={setKeepGoing}/>}
        {nameLengthModalOpen && <CharacterNameLengthCheck setNameLengthModalOpen={setNameLengthModalOpen} /> }
        <MainStyledSection>
            <CharacterInfoPage>
                {deleteFailModalOpen && <DeleteFailure setModalOpen={setDeleteFailModalOpen}/>}
                {modalOpen && <CancelEdit setModalOpen={setModalOpen} setKeepGoing={setEdit}/>}
                <p className='title'>캐릭터 관리</p>
                <div className='info-section'>
                    <div className='profile-image'>
                        <img src={`/image/character/character0${getCookie('pfimg')}.png`} alt="" />
                    </div>
                    <div className='character-name'>
                        {
                            edit ? 
                            <div className='edit-mode-on'>
                                <input type="text" className='edit-input' onChange={e => setNewname(e.target.value)} maxLength={10} value={newName}/>
                                <button type='button' className='remove-all' onClick={() => editModeCancel()}><TfiClose/></button>
                                <button type='button' className='edit' onClick={newName.length === 0 ? () => setNameLengthModalOpen(true)  : (e) => changeCharacter(e)}>완료</button>
                            </div>  
                            :
                            <div className='edit-mode-off'>
                                {currentCharacter.character_name} 
                                <button type='button' onClick={editMode} className='edit-button'><LuPencilLine /></button>
                            </div>
                        }
                    </div>
                    <div className='character-prefer'>  
                        <BsSuitHeart />
                        <span>
                            {
                                preferGenre === null ?
                                <>{'장르 취향을 선택해주세요.'}</>
                                :
                                preferGenre.map((data, index)=>{
                                    return (
                                        <>{
                                            preferGenre.length - 1 === index ?
                                            <>{data}</>
                                            :
                                            <>{data}, </>
                                        }</>
                                    )
                                })
                            }
                        </span> 
                    </div>
                    <div className='button-box'>
                        <Link to={'../discovery'} className='button submit'>
                                취향관리
                        </Link>
                        <button type='button' onClick={() => confirmDeleteCharacter()} className='button cancel'>
                            캐릭터 삭제
                        </button>
                    </div>
                </div>
                <div>
                    {

                    }
                </div>
            </CharacterInfoPage>
        </MainStyledSection>
        </>
    )
}

export default Character

const CharacterInfoPage = styled.div`
    .title{
        font-size: 26px;
        font-weight: 700;
        margin: 20px 0;
    }
    .info-section{
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .profile-image{
            width: 175px;
            height: 175px;
            margin: 10px auto;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .character-name{
            margin: 20px auto 10px;
            text-align: center;
            font-size: 24px;
            position: relative;
            .edit-mode-on{
                .edit-input{
                    width: 320px;
                    border-bottom: 1px solid var(--main-text-black);
                    padding: 15px 0;
                    font-size: 24px;
                    text-align: center;
                }
                button.remove-all{
                    font-size: 20px;
                    position: absolute;
                    top: 25px;
                    right: 10px;
                }
                button.edit{
                    color: var(--main-theme-color);
                    font-size: 15px;
                    position: absolute;
                    top: 23px;
                    right: -27px;

                }
            }
            .edit-mode-off{
                .edit-button{
                    width: 20px;
                    height: 20px;
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    right: -30px;
                    svg{
                        width: 100%;
                        height: 100%;
                        display: inline-block;
    
                    }
                }
            }
            
        }
        .character-prefer{
            text-align: center;
            font-size: 14px;
            color: #999;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 5px;
            svg{
                width: 14px;
                height: 14px;
                margin-top: 1px;
                margin-right: 4px;
                display: inline-block;
            }
        }
        .button-box{
            width: 100%;
            margin-top: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            .button{
                width: 100px;
                height: 36px;
                padding: 0 15px;
                font-size: 14px;
                line-height: 36px;
                text-align: center;
                border-radius: 5px;
                a{
                    display: inline-block;
                    width: 100px;
                    height: 36px;
                }
            }
            .submit{
                margin-right: 15px;
                background-color: var(--main-theme-color);
                color: #fff;
                &:hover{
                    background-color: var(--main-theme-color-hover);
                }
            }
            .cancel{
                background-color: var(--main-text-white);
                color: var(--main-text-black);
                border: 1px solid var(--main-text-gray-lighter);
                &:hover{
                    color: var(--main-theme-color);
                    border: 1px solid var(--main-theme-color);
                }
            }
        }
    }
`;