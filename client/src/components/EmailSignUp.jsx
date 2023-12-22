import React, { useEffect, useState } from 'react'
import MainStyledSection from '../layout/MainStyledSection'
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import AgreedAllTerms from '../modal/AgreedAllTerms';

const EmailSignUp = () => {
    const checkedData = [
        {id: 0, title: '필수1'},
        {id: 1, title: '필수2'},
        {id: 2, title: '필수3'},
        {id: 3, title: '선택4'},
        {id: 4, title: '선택5'},
        {id: 5, title: '선택6'}
    ];
    const termData = [
        {id: 0, necessary: true, title: '이용약관', name: 'neccessary-term1'},
        {id: 1, necessary: true, title: '개인정보 수집 및 이용 안내', name: 'neccessary-term2'},
        {id: 2, necessary: true, title: '제 3자 제공 동의', name: 'neccessary-term3'},
        {id: 3, necessary: false, title: '제 3자 제공 동의(선택)', name: 'choice-term4'},
        {id: 4, necessary: false, title: '이벤트/혜택 알림 수신 동의', name: 'choice-term5'},
        {id: 5, necessary: false, title: '이벤트/혜택 알림 제공을 위한 개인정보 수집 및 이용 안내', name: 'choice-term6'}
    ];
    const [ checkList, setCheckList ] = useState([]); // 전체선택 누르면 여기에 필수체크박스 name 담아주고 일괄 체크
    const [ next, setNext ] = useState(false);
    const [ modalOpen, setModalOpen ] = useState(false);

    const handleLink = (e) => {
        if(!next){
            e.preventDefault();
        }
    }
    const handleAllCheck = (checked) => {
        if(checked){
            let arr = [];
            checkedData.forEach((data)=>{
                arr.push(data.id);
            });
            setCheckList(arr);
            setModalOpen(true);
        }else{
            setCheckList([]);
        }
    }
    const handleSingleCheck = (checked, id) => {
        if(checked){
            setCheckList(prev => [...prev, id]);
        }else{
            setCheckList(checkList.filter((el) => el !== id));
        }
    }
    useEffect(()=>{
        if(checkList.includes(0) && checkList.includes(1) && checkList.includes(2)){
            setNext(true);
        }else{
            setNext(false);
        }
    }, [checkList])

    return (
        <MainStyledSection>
            <Logo className='logo mx-auto mt-[50px] mb-[50px]'>
                
            </Logo>
            <div className="overflow-hidden">
                <TermBox>
                    { modalOpen && <AgreedAllTerms setModalOpen={setModalOpen}/>}
                    <div className='terms'>
                        <p className='title pb-5'>
                            이용약관
                        </p>
                        <div className='detail'>
                            <form className='mb-5'>
                                {
                                    termData.map((data, idx)=>{
                                        return(
                                            <label className={termData.length === idx + 1 ? `w-full flex justify-start align-items-start` : `w-full flex justify-start align-items-center`}>
                                                <input type="checkbox" name={data.name} onChange={(e) => handleSingleCheck(e.target.checked, data.id)} checked={checkList.includes(data.id) ? true : false} />
                                                <div className='w-full flex justify-between'>
                                                    <div className='w-10/12'>
                                                        <span className='necessary' style={data.necessary ? {color:'var(--main-theme-color)'} : {}}>({data.necessary ? '필수' : '선택'})</span> {data.title}
                                                    </div>
                                                    <div className='see-all'>
                                                        <button type='button'>전문보기</button>
                                                    </div>
                                                </div>
                                            </label>
                                        )
                                    })
                                }

                                {/* 전체동의 */}
                                <label className='w-full flex align-items-start justify-start mt-5 pt-4 pb-10' style={{borderTop:'1px solid #d9d9d9'}}>
                                    <input type="checkbox" name='check-all-necessary' onChange={(e) => handleAllCheck(e.target.checked)} checked={checkList.length === checkedData.length ? true : false}/> 
                                    <div className='w-full flex justify-between align-items-center'>
                                        <div className=''>
                                            <span className='font-bold'>전체동의</span>
                                            <p style={{color: 'var(--main-text-gray-lighter)'}}>(선택)이벤트/혜택 알림을 포함하여 모두 동의합니다.</p>
                                        </div>
                                    </div>
                                </label>
                                <Link to={'/signup/resister'} onClick={handleLink}>
                                    <Next style={next ? {opacity: 1} : {opacity: 0.3}}>
                                        다음
                                    </Next>
                                </Link>
                            </form>
                        </div>
                    </div>
                </TermBox>
            </div>
        </MainStyledSection>
    )
}

export default EmailSignUp
const Logo = styled.div`
    width: 180px; 
    height: 30px;
    background-image: url(/Logo/Logo.svg);
    background-repeat: no-repeat;
    background-size: cover;
`;

const TermBox = styled.div`
    width: 700px;
    height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    padding: 60px 120px;
    border: 1px solid #d9d9d9;
    .terms{
        width: 100%;
        height: 100%;
        .title{
            color: #181818;
            font-size: 30px;
            font-weight: 700;
            text-align: center;
        }
        .detail{
            border-top: 1px solid #d9d9d9;
            // border-bottom: 1px solid #d9d9d9;
            >form{
                label{
                    input{
                        width: 30px;
                        height: 30px;
                        margin-right: 10px;
                    }
                    height: 30px;
                    margin: 30px 0;
                    font-size: 17px;
                    font-weight: 400;
                    >div{
                        .see-all{
                            color: #929292;
                            font-size: 15px;
                            font-weight: 300;
                        }
                    }
                }
                input[type=checkbox]{
                    accent-color: var(--main-theme-color);
                    border-color: #d9d9d9;
                }
            }
        }
    }
`;

const Next = styled.div`
    width: 100%;
    height: 70px;
    color: var(--main-text-white);
    background-color: var(--main-theme-color);
    font-size: 19px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
`;
