import React from 'react'
import styled from 'styled-components'

const CharacterNameLengthCheck = ({setNameLengthModalOpen}) => {
    return (
        <StyledCharacterLengthCheckModal>
            <div className="modal-box">
                <p className="text-[14px] mt-[10px]">한 글자 이상의 캐릭터명을 입력해주세요.</p>
                <div className="mt-[50px]">
                    <span className="text-[13px] border-1 border-blue bg-blue text-white px-[27px] py-[7px] rounded-[5px] hover-bg-deepblue cursor-pointer" onClick={() => setNameLengthModalOpen(false)}>확인</span>
                </div>
            </div>
        </StyledCharacterLengthCheckModal>
        )
}

export const StyledCharacterLengthCheckModal = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;

    .modal-box{
        width: 400px;
        height: 180px;
        background-color: white;
        border-radius: 10px;
        text-align: center;
        padding-top: 30px;
    }
`

export default CharacterNameLengthCheck