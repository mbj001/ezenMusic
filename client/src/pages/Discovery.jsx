import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getCookie } from '../config/cookie';
import MainStyledSection from '../layout/MainStyledSection';
import { TfiClose } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import SelectFailure from '../modal/SelectFailure';
import { Link as ScrollLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

const Discovery = () => {
    const [ selectedArtist, setSelectedArtist ] = useState([]); // map 돌아가는 artist 배열
    const [ selectedGenre, setSelectedGenre ] = useState([]); // map 돌아가는 genre 배열
    const [ emptyData, setEmptyData ] = useState(true);

    const [ artist, setArtist ] = useState([]);
    const [ genreTable, setGenreTable ] = useState([]);
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const [activeSection, setActiveSection] = useState('');    
    
    const getArtistData = async() => {
        const response = await axios.post('/verifiedClient/getArtistData',{token: getCookie('connect.sid')});
        const arr = (response.data[1]);
        setArtist(arr);
    }

    const getGenreTableData = async() => {
        const response = await axios.post('/verifiedClient/getGenreTable',{token: getCookie('connect.sid')});
        const arr = (response.data);
        setGenreTable(arr);
    }

    const getCharacterPrefer = async() =>{
        const response = await axios.post('/verifiedClient/getPreferData', {token: getCookie('connect.sid'), characterId: getCookie('character.sid')});
        // console.log(response)
        if(response.data[0].prefer_artist !== null && response.data[0].prefer_artist !== undefined){
            setSelectedArtist(response.data[0].prefer_artist);
        }
        if(response.data[0].prefer_genre !== null && response.data[0].prefer_genre !== undefined){
            // console.log('담을게요')
            setSelectedGenre(response.data[0].prefer_genre);
        }
    }

    const likeThisArtist = (e) => {
        if(selectedArtist.some(selectedData=>{return selectedData.artist_id === e.artist_id})){
            setSelectedArtist((selected)=>{
                return selected.filter(data=>data.artist_id!==e.artist_id);
            });
        }else{
            setSelectedArtist((selected)=>{
                const addArray = [e, ...selected];
                return addArray;
            });
        }
    }
    
    const likeThisGenre = (e) => {
        if(selectedGenre.length < 3){
            if(selectedGenre.some(selectedData=>{return selectedData.genre_id === e.genre_id})){
                setSelectedGenre((selected)=>{
                    return selected.filter(data=>data.genre_id!==e.genre_id);
                });
            }else{
                setSelectedGenre((selected)=>{
                    const addArray = [e, ...selected];
                    return addArray;
                });
            }
        }else{
            if(selectedGenre.some(selectedData=>{return selectedData.genre_id === e.genre_id})){
                setSelectedGenre((selected)=>{
                    return selected.filter(data=>data.genre_id!==e.genre_id);
                });
            }else{
                setModalOpen(true);
            }
        }
    }

    const updatePrefer = async() =>{
        setLoading(true);
        const response = await axios.post('/verifiedClient/updatePrefer', {token: getCookie('connect.sid'), characterId: getCookie('character.sid'), preferArtist: selectedArtist, preferGenre: selectedGenre});
        if(response.data.success){
            const response = await axios.post('/verifiedClient/createPreferPlaylist', {token: getCookie('connect.sid'), characterId: getCookie('character.sid')});
            setLoading(false);
            if(response.data.createSuccess){
                window.location='/character';
            }else{
                alert('취향 반영 재생목록 생성에 실패했습니다.');
            }
        }
    }

    useEffect(()=>{
        if(selectedArtist.length >= 1 || selectedGenre.length >= 1){
            setEmptyData(false);
        }
    },[selectedArtist, selectedGenre]);

    useEffect(()=>{
        getCharacterPrefer();
        getArtistData();
        getGenreTableData();
    },[]);

    // ##########################################################################
    // react-scroll

    useEffect(() => {
        // Events.scrollEvent.register('begin', () => console.log('begin scroll'));
        // Events.scrollEvent.register('end', () => console.log('end scroll'));
    
        scrollSpy.update();
    
        return () => {
            Events.scrollEvent.remove('begin');
            Events.scrollEvent.remove('end');
        };
    }, []);

    const handleSetActive = (to) => {
        setActiveSection(to);
    };

    const [scrollArtist, setScrollArtist] = useState(true);
    const [scrollGenre, setScrollGenre] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if(window.scrollY >= 0 && window.scrollY < 13515){
                setScrollArtist(true);
                setScrollGenre(false);
            }else{
                setScrollArtist(false);
                setScrollGenre(true);
            }
        });
    }, []);


    return (  
        <MainStyledSection>
            <DiscoveryPage>
            <Element name="artist" className="artist"></Element>
                {loading && <Loading/>}
                <div className='title'>
                    <p>어떤 음악을 좋아하세요? 취향을 선택하고 나에게 맞는 홈을 받아보세요.</p>
                </div>
                <div className='discovery-head-nav'>
                    <button type='button' className={scrollArtist ? 'tab-menu active' : 'tab-menu'} >
                        <ScrollLink
                            to="artist"
                            spy={true}
                            smooth={false}
                            offset={0}
                            duration={200}
                            onSetActive={handleSetActive}
                        >
                            아티스트
                        </ScrollLink>
                    </button>
                    <button type='button'  className={scrollGenre ? 'tab-menu active' : 'tab-menu'} >
                        <ScrollLink
                            to="genre"
                            spy={true}
                            smooth={false}
                            offset={-250}
                            duration={200}
                            onSetActive={handleSetActive}
                        >
                            장르
                        </ScrollLink>
                    </button>
                    <Link to={'/character'} className='close-icon'>
                        <TfiClose/>
                    </Link>
                </div>
                {
                    !emptyData && 
                    <div className='selected-artist-section'>
                        <div className='selected-cover'>
                            <div>
                                {
                                    selectedArtist.map((data, index)=>{
                                        return (
                                            <>
                                            {
                                                index < 15 ?
                                                <div className={`selected-artist artist${index}`} style={{zIndex: `${selectedArtist.length - index}`}}>
                                                    <img src={`/image/artist/${data.org_artist_image}`} alt={`${data.org_artist_image}`} style={{zIndex: `${selectedArtist.length - index}`}}/>
                                                </div>
                                                :
                                                <></>
                                            }
                                            </>
                                        )
                                    })
                                }
                            </div>
                            <div>
                                {
                                    selectedGenre.map((data, index)=>{
                                        return (
                                            <>
                                            {
                                                index < 15 ?
                                                <div className={`selected-genre genre${index}`} style={{zIndex: `${selectedGenre.length - index}`}}>
                                                    <img src={`/image/genre/${data.org_cover_image}`} alt={`${data.org_cover_image}`} />
                                                </div>
                                                :
                                                <></>
                                            }
                                            </>
                                            
                                        )
                                    })
                                }
                            </div>
                            <div className='submit-button'>
                                <button type='button' onClick={() => updatePrefer()}>
                                    저장하기
                                </button>
                            </div>
                        </div>
                    </div>
                }
                
                {
                    genreTable.map((genre, index)=>{
                        return (
                            <>
                            {
                                genre.genre === 'WorldMusic' || genre.genre === 'Jazz' || genre.genre === 'Ost'?
                                <></>
                                :
                                <>
                                <SelectionTitle>
                                    <h3>{genre.description}</h3>
                                </SelectionTitle>
                                <div className='maping artist-section'>
                                    <div className='grid-cover'>
                                        {
                                            // 아티스트 선택
                                            artist.map((artist, index)=>{
                                                return (
                                                    <>
                                                        {
                                                            genre.genre === artist.genre && genre.area === artist.area ?
                                                            
                                                            <div className='artist-grid-box' onClick={() => likeThisArtist(artist)}>
                                                                <div className={selectedArtist.some(selectedData=>{return selectedData.artist_id === artist.artist_id}) ? 'artist-image checked' : 'artist-image'}>
                                                                    <img src={`/image/artist/${artist.org_artist_image}`} alt={`${artist.artist_name}`} />
                                                                </div>
                                                                <div className='artist-name'>
                                                                    {artist.artist_name} 
                                                                </div>
                                                            </div>
                                                            :
                                                            <></>
                                                        }
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                </>
                            }
                            </>
                        )
                    })
                }
                <Element name="genre" className="genre"></Element>
                
                <SelectionTitle id='genre-tab'>
                    <h3>장르</h3>
                </SelectionTitle>
                
                <div className='maping genre-section'>
                    <div className='grid-cover'>
                        {
                            genreTable.map((data)=>{
                                return (
                                    <>
                                        <div className='genre-grid-box' onClick={() => likeThisGenre(data)}>
                                            <div className={selectedGenre.some(selectedData=>{return selectedData.genre_id === data.genre_id}) ? 'genre-image checked' : 'genre-image'}>
                                                <img src={`/image/genre/${data.org_cover_image}`} alt={`${data.description}`} />
                                            </div>
                                            <div className='artist-name'>
                                                {data.description} 
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            </DiscoveryPage>
            {modalOpen && <SelectFailure setModalOpen={setModalOpen}/>}
        </MainStyledSection>
    ) 
}

export default Discovery    

const SelectionTitle = styled.div`
    h3{ 
        padding: 30px 0;
        font-size: 17px;
        font-weight: 400;
        color: #999;
        text-align: center; 

    }
`;

const DiscoveryPage = styled.div`
    .title{
        text-align: center;
        margin: 20px auto;
        position: relative;
        p{
            font-size: 20px;
            font-weight: 600;
        }
        
    }
    .discovery-head-nav{
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
        background-color: var(--main-background-white);
        position: sticky;
        top: 0;
        z-index: 99999999999999999999999999999999999999999;
        .tab-menu{
            display: block;
            width: 100px;
            height: 40px;
            font-size: 18px;
            line-height: 40px;
            border-radius: 20px;
            margin-left: 20px;
            margin-right: 20px;
        }
        .tab-menu.active{
            background-color: var(--main-theme-color);
            color: var(--main-text-white);
        }
        .close-icon{
            position: absolute;
            top: 15px;
            right: 0;
            display: inline-block;
            width: 30px;
            height: 30px;
            svg{
                display: inline-block;
                width: 100%;
                height: 100%;
            }
        }
    }
    .selected-artist-section{
        width: 100%;
        min-height: 100px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        padding: 20px;
        margin-bottom: 30px;
        position: sticky;
        top: 60px;
        background-color: rgba(255,255,255,0.91);
        z-index: 99999999999999999999999999999999999999999;
        div{
            button{
                font-size: 16px;
                svg{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    margin-left: -3px;
                    margin-top: -3px;
                }
            }
        }
        .selected-cover{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: start;
            overflow: hidden;
            position: relative;
            
            div{
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: start;
                margin-top: 5px;
                .selected-artist{
                    width: 60px;
                    height: 60px;
                    border: 2px solid var(--main-text-white);
                    border-radius: 50%;
                    overflow: hidden;
                    margin-left: -15px;
                    &:first-child{
                        margin-left: 0;
                    }
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .artist14::after{
                    content: '';
                    display: block;
                    position: absolute;
                    top: 10px;
                    right: 230px;
                    width: 60px;
                    height: 60px;
                    border: 2px solid var(--main-text-white);
                    border-radius: 50%;
                    z-index: 0;
                    background-image: url('/image/last.png');
                    background-repeat: no-repeat;
                    background-size: cover;
                }
            }
            div{
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: start;
                .selected-genre{
                    width: 60px;
                    height: 60px;
                    border: 2px solid var(--main-text-white);
                    border-radius: 50%;
                    overflow: hidden;
                    margin-left: -15px;
                    &:first-child{
                        margin-left: 0;
                    }
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .genre14::after{
                    content: '';
                    display: block;
                    position: absolute;
                    top: 20px;
                    right: 225px;
                    width: 60px;
                    height: 60px;
                    border: 2px solid var(--main-text-white);
                    border-radius: 50%;
                    z-index: 0;
                    background-image: url('/image/last.png');
                    background-repeat: no-repeat;
                    background-size: cover;
                }
            }
            .submit-button{
                button{
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    // transform: translate( 0, -50%);
                    bottom: 35px;
                    min-width: 96.55px;
                    height: 40px;
                    padding: 0 33px;
                    font-size: 16px;
                    line-height: 39px;
                    color: #3f3fff;
                    text-align: center;
                    border: 1px solid #3f3fff;
                    border-radius: 20px;
                }
            }
        }
    }
    .artist-section{
        .grid-cover{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: start;
            cursor: pointer;
            .artist-grid-box{ 
                width: 15.5%;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: 5.8px;
                margin-right: 5.8px;
                margin-bottom: 30px;
                .artist-image{
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    overflow: hidden;
                    position: relative;
                    
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .checked::after{
                    display: block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    content: '';
                    width: 140px;
                    height: 140px;
                    background-image: url('/image/checked.png');
                    background-repeat: no-repeat;
                    background-size: cover;
                }
                .artist-name{
                    font-size: 15px;
                    line-height: 18px;
                    margin-top: 10px;
                    margin-bottom: 40px;
                    text-align: center;
                    white-space: normal;
                }
            }
        }
    }
    .chart-section{

    }
    .genre-section{
        .grid-cover{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: start;
            cursor: pointer;
            .genre-grid-box{ 
                width: 15.5%;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: 5.8px;
                margin-right: 5.8px;
                margin-bottom: 30px;
                .genre-image{
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    overflow: hidden;
                    position: relative;
                    
                    img{
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                .checked::after{
                    display: block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    content: '';
                    width: 140px;
                    height: 140px;
                    background-image: url('/image/checked.png');
                    background-repeat: no-repeat;
                    background-size: cover;
                }
                .artist-name{
                    font-size: 15px;
                    line-height: 18px;
                    margin-top: 10px;
                    margin-bottom: 40px;
                    text-align: center;
                    white-space: normal;
                }
            }
        }
    }
    
`;